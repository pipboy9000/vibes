<template>
<transition name="fade">
  <div v-if="vibe">
    <div ref="scrollBarDiv" class="scrollBarDiv">
      <canvas id="img-canvas" width="200" height="150"></canvas>
      <div class="bg">
        <div class="top">
          <div class="cover">
            <div class="colorOverlay"></div>
          </div>
          <div class="closeBtn" @click="close">X</div>
          <div class="users">
            <img :src="'https://graph.facebook.com/' + vibe.createdBy.fbid + '/picture?type=large'">
            <img v-for="(uid, idx) in usersToDisplay" :src="'https://graph.facebook.com/' + uid + '/picture?type=large'" :key="idx">
            <p v-if="plusUsers > 0">+{{plusUsers}}</p>
          </div>
          <div class="editCover">
            <i class="fas fa-pen-alt"></i>
          </div>
          <div class="title">{{vibe.title}}</div>
          <div class="details">Created by {{vibe.createdBy.name}}<br>{{time}} | {{distance}}</div>
        </div>
        <div class="bottom">
          <div class="joinLeave">
            <p class="leave" v-if="inVibe" @click="leaveVibe">i want out</p>
            <p class="join" v-else-if="vibe.distance < 25" @click="joinVibe">i want in!</p>
            <p class="tooFar" v-else>too far</p>
          </div>
          <div ref="pictures" class="pictures" v-if="newPictures.length > 0" @mousewheel.stop.prevent="wheel">
            <photo-gallery :images="newPictures" v-model="index"></photo-gallery>
              <div v-for="(pic,idx) in newPictures" :key="idx" class="thumb" href="#" @click="index = idx" 
              :style="{'background-image': 'url(' + pic.thumbSrc + ')'}"/>
              <!-- :src="'https://picsum.photos/200/300/?random/&r=' + Math.round(Math.random() * 1000)"/> -->
        </div>
        <!-- </div> -->
        <div class="comments">
          <h2>Comments:</h2>
          <comment v-for="(comment, idx) in vibe.comments" :comment="comment" :key="idx"></comment>
        </div>
      </div>
    </div>    
    </div>
      <div v-if="inVibe" class="newComment" @click="focusNewComment">
          <input ref="newCommentInput" type="text" @keyup.enter="sendNewComment" v-model="commentTxt" placeholder="Type message">
          <!-- <div class="newCommentButtons">
            <div @click="sendNewComment">></div>
            <div v-if="uploadingPictures.length === 0" @click="sendPic"><i class="fas fa-camera"></i></div>
            <div v-else><i class="fas fa-spinner"></i></div>
          </div> -->

          <div class="newCommentButtons">
          <div @click="sendNewComment">></div>
          <div v-if="useHtmlCamera">
            <div v-if="uploadingPictures.length === 0" @click="$refs.fileInput.click()">
                <input ref="fileInput" type="file" accept="image/*" capture @change="fileLoaded" style="display:none">
              <i class="fas fa-camera">
              </i>
            </div>
            <div v-else><i class="fas fa-spinner"></i></div>
          </div>
          <div v-else>
            <div v-if="uploadingPictures.length === 0" @click="sendPic"><i class="fas fa-camera"></i></div>
            <div v-else><i class="fas fa-spinner"></i></div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { EventBus } from "../event-bus.js";
import { timeAgo } from "../services/timeAgo.js";
import { formatDistance } from "../services/maps.js";
import socket from "../services/socket.js";
import comment from "./comment";
import VueGallery from "vue-gallery";
import Pica from "pica";
const pica = Pica();
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { PhotoGallery } from "vue-photo-gallery";

export default {
  name: "VibeDetails",
  components: {
    comment,
    gallery: VueGallery,
    PulseLoader,
    PhotoGallery
  },
  data() {
    return {
      time: null,
      commentTxt: "",
      firebaseStorage: this.$root.firebaseStorage,
      firebase: this.$root.firebase,
      index: null,
      loaderColor: "#d5effd",
      uploadingPictures: [],
      slide: false, //check if link change was from a slide,
      demoPics: null,
      scrollM: 0, //picture scroller
      isMoving: false,
      commentSent: false //did we just a new comment?
    };
  },
  mounted() {
    var self = this;
    //keep timeago updated
    setInterval(function() {
      if (self.vibe) {
        self.time = timeAgo.format(self.vibe.createdAt);
      }
    }, 10000);
  },
  methods: {
    focusNewComment() {
      this.$refs.newCommentInput.focus();
    },
    wheel(e) {
      this.scrollM += e.wheelDelta / 7;
      if (!this.isMoving) {
        this.move();
      }
    },
    move() {
      if (this.$refs.pictures && (this.scrollM > 1 || this.scrollM < -1)) {
        this.isMoving = true;
        this.$refs.pictures.scrollBy(this.scrollM, 0);
        this.scrollM *= 0.95;
        requestAnimationFrame(this.move);
      } else {
        this.isMoving = false;
      }
    },
    openImg(idx) {
      var q = this.$route.query;
      this.$router.push({ query: { ...q, img: idx } });
      if (this.isNative) PhotoViewer.show(this.largePictures[idx]);
    },
    closeImg() {
      if (+this.$route.query.img >= 0) this.$router.go(-1);
    },
    slideEnd(e) {
      var q = this.$route.query;
      if (q.img != e.index && q.img >= 0) {
        this.slide = true;
        this.$router.replace({ query: { ...q, img: e.index } });
      }
    },
    removeBase64Prefix(base64Str) {
      return base64Str.substr(base64Str.indexOf(",") + 1);
    },
    fileLoaded(e) {
      var self = this;
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      if (files && files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
          self.uploadPicture(self.removeBase64Prefix(e.target.result));
        };
        reader.readAsDataURL(files[0]);
      }
    },
    uploadPicture(cordovaImageData) {
      var size = (cordovaImageData.length * 3) / 4;
      console.log("Picture Size: " + size);
      // alert("Picture Size: " + size / 1024 + "KB");

      var self = this;
      const base64JpegPrefix = "data:image/jpeg;base64,";

      function removePictureFromUploading(id) {
        self.uploadingPictures = self.uploadingPictures.filter(
          pic => pic.id !== id
        );
      }

      function uploadBase64(imageData, firebaseChild) {
        return new Promise(resolve => {
          //console.log("uploading imageData:" + imageData);
          try {
            var uploadTask = firebaseChild.putString(imageData, "base64");

            uploadTask.on(
              "state_changed",
              function(snapshot) {
                var progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                var firebase = self.firebase;
                console.log("Upload is " + progress + "% done");
                switch (snapshot.state) {
                  case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log("Upload is paused");
                    break;
                  case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log("Upload is running");
                    break;
                }
              },
              function(error) {
                // Handle unsuccessful uploads
                console.dir(error);
              },
              function() {
                uploadTask.snapshot.ref
                  .getDownloadURL()
                  .then(function(downloadURL) {
                    console.log("Uploaded a blob or file!");
                    console.log("got downloadURL: ", downloadURL);

                    resolve(downloadURL);
                  });
              }
            );
          } catch (errr) {
            console.error(errr);
          }
        });
      }

      function generateThumbnail(cordovaImageData) {
        return new Promise(resolve => {
          var canvas = document.getElementById("img-canvas"); // TODO: I know there's a better way to do this
          var ctx = canvas.getContext("2d");

          var image = new Image();
          image.src = base64JpegPrefix + cordovaImageData;
          image.onload = function() {
            ctx.drawImage(image, 0, 0);
            pica
              .resize(image, canvas)
              .then(result => pica.toBlob(result, "image/jpeg", 0.9))
              .then(blob => {
                console.log("resized to canvas & created blob!");
                console.log(blob);
                var reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function() {
                  var imageData = self.removeBase64Prefix(reader.result);
                  resolve(imageData);
                };
              });
          };
        });
      }

      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      //let base64Image = 'data:image/jpeg;base64,' + imageData;
      console.log("getPicture success callback");

      generateThumbnail(cordovaImageData).then(thumbnailImageData => {
        var dateStr = new Date().getTime().toString();
        var fullUploadPromise = uploadBase64(
          cordovaImageData,
          self.firebaseStorage.child(dateStr).child("full")
        );

        var thumbnailUploadPromise = uploadBase64(
          thumbnailImageData,
          self.firebaseStorage.child(dateStr).child("thumb")
        );

        var localPicture = {
          id: dateStr,
          vibeId: self.vibe.id,
          imgUrl: base64JpegPrefix + cordovaImageData,
          thumbnailUrl: base64JpegPrefix + thumbnailImageData
        };
        self.uploadingPictures.unshift(localPicture);
        Promise.all([fullUploadPromise, thumbnailUploadPromise]).then(urls => {
          var picture = {
            vibeId: self.vibe.id,
            imgUrl: urls[0],
            thumbnailUrl: urls[1]
          };
          socket.newPicture({
            token: self.$store.getters.token,
            picture
          });
          removePictureFromUploading(dateStr);
        });
      });
    },
    sendPic() {
      var self = this;
      console.log("setting camera options");
      const options = {
        quality: 80,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true
        // targetWidth: 200,
        // targetHeight: 200
      };

      this.camera.getPicture(
        cordovaImageData => self.uploadPicture(cordovaImageData),
        err => {
          // Handle error
          console.error("error in camera callback:");
          console.error(err);
        },
        options
      );
    },
    close() {
      this.$router.go(-1);
    },
    sendNewComment() {
      this.commentSent = true;
      var comment = {
        vibeId: this.$store.state.openVibe.id,
        text: this.commentTxt
      };
      socket.newComment({ token: this.$store.getters.token, comment });
      this.commentTxt = "";
      this.hideKeyboard();
    },
    hideKeyboard() {
      var field = document.createElement("input");
      field.setAttribute("type", "text");
      document.body.appendChild(field);

      setTimeout(function() {
        field.focus();
        setTimeout(function() {
          // field.setAttribute("style", "display:none;");
          document.body.removeChild(field);
        }, 50);
      }, 50);
    },
    joinVibe() {
      socket.joinVibe({
        token: this.$store.getters.token,
        vibeId: this.vibe.id
      });
    },
    leaveVibe() {
      socket.leaveVibe(this.$store.getters.token);
    },
    clearOpenVibe() {
      this.$store.commit("setOpenVibe", null);
    },
    scrollToBottom() {
      this.$refs.scrollBarDiv.scrollTo({
        top: this.$refs.scrollBarDiv.scrollHeight,
        left: 0,
        behavior: "smooth"
      });
    }
  },
  computed: {
    isNative() {
      return this.$root.cordova.device.platform !== "browser";
    },
    isAndroidOrIPhoneBrowser() {
      return (
        navigator.userAgent.indexOf("Android") != -1 ||
        navigator.userAgent.indexOf("iPhone") != -1 ||
        navigator.userAgent.indexOf("iPad") != -1
      );
    },
    useHtmlCamera() {
      return this.isAndroidOrIPhoneBrowser && device.platform === "browser";
    },
    largePictures() {
      return this.vibePictures.map(x => x.imgUrl);
    },
    newPictures() {
      return this.vibePictures.map(x => {
        return {
          src: x.imgUrl,
          thumbSrc: x.thumbnailUrl,
          w: 1600,
          h: 1600
        };
      });
    },
    usersToDisplay() {
      //in the top part
      var me = this;
      var arr = [];
      for (var i = 0; i < 4 && i < this.vibe.users.length; i++) {
        if (this.vibe.users[i] != this.vibe.createdBy.fbid) {
          arr.push(this.vibe.users[i]);
        }
      }
      return arr;
    },
    plusUsers() {
      //how many more users are in the vibe
      var self = this;
      var plus = 0;

      this.vibe.users.length - this.usersToDisplay.length;

      var creatorInVibe = this.vibe.users.findIndex(function(uid) {
        return uid === self.vibe.createdBy.fbid;
      });

      if (creatorInVibe !== -1) {
        plus -= 1;
      }
      return plus;
    },
    vibePictures() {
      return this.vibe.pictures;
    },
    camera() {
      return this.$root.cordova.camera;
    },
    vibe() {
      return this.$store.state.openVibe;
    },
    vibes() {
      return this.$store.state.vibes;
    },
    inVibe() {
      if (!this.$store.state.openVibe) return;
      return this.$store.state.openVibe.id === this.$store.state.inVibe;
    },
    profilePicSrc() {
      if (this.vibe) {
        return (
          "https://graph.facebook.com/" +
          this.vibe.createdBy.fbid +
          "/picture?type=square&width=70&height=70"
        );
      }
    },
    distance() {
      return formatDistance(this.vibe.distance);
    },
    isTooFar() {
      return this.vibe.distance < 25;
    },
    commentsCount() {
      if (this.vibe) return this.vibe.comments.length;
    }
  },
  watch: {
    commentsCount() {
      if (this.commentSent) {
        this.commentSent = false;
        this.$nextTick(this.scrollToBottom);
      }
    },
    $route(to, from) {
      if (this.slide) {
        this.slide = false;
        return;
      }
      var vibeId = to.query.v;
      if (vibeId) {
        var vibe = this.$store.getters.getVibeById(vibeId);
        if (vibe) {
          this.$store.commit("setOpenVibe", vibe);
          var imgIdx = to.query.img;
          if (imgIdx >= 0) {
            this.index = +imgIdx;
          } else {
            this.index = null;
          }
        } else {
          this.clearOpenVibe();
        }
      } else {
        this.clearOpenVibe();
      }
    },
    vibe(newVibe) {
      if (newVibe) this.time = timeAgo.format(this.vibe.createdAt);
    },
    vibes() {
      //in case user opens the app with link that has a vibe id we should open the vibe details window
      //we know its first time if this.vibe === null (this.$store.state.selectedVibe)
      var vibeId = this.$route.query.v;
      if (vibeId && !this.vibe) {
        var vibe = this.$store.getters.getVibeById(vibeId);
        if (vibe) {
          this.$store.commit("setSelectedVibe", vibe);
          this.$store.commit("setOpenVibe", vibe);
          let imgIdx = +this.$route.query.img;
          if (imgIdx >= 0) {
            this.index = null;
            var self = this;
            this.$nextTick(function() {
              self.index = imgIdx;
            });
          }
        }
      }
    }
  }
};
</script>

<style scoped="true">
.scrollBarDiv {
  position: absolute;
  width: 100%;
  height: 100%;
  max-width: 485px;
  overflow-y: auto;
}

.pictures::-webkit-scrollbar,
.scrollBarDiv::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.pictures::-webkit-scrollbar-button,
.scrollBarDiv::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}
.pictures::-webkit-scrollbar-thumb,
.scrollBarDiv::-webkit-scrollbar-thumb {
  background: #ffffff;
  border: 0px none #ffffff;
  border-radius: 50px;
}

.pictures::-webkit-scrollbar-track,
.scrollBarDiv::-webkit-scrollbar-track {
  background: #0000;
  border: 0px none #ffffff;
}
.pictures::-webkit-scrollbar-corner,
.scrollBarDiv::-webkit-scrollbar-corner {
  background: transparent;
}

.pictures::-webkit-scrollbar-thumb {
  background: #8be0ff;
}

/* items */
.bg {
  height: fit-content;
  width: 100%;
  max-width: 465px;
  background: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  float: left;
  position: relative;
  overflow-x: hidden;
  min-height: 100%;
}

.top {
  display: inline-block;
  width: 100%;
  padding-bottom: 22px;
}

.cover {
  position: absolute;
  width: 100%;
  height: 136px;
  background: url("/static/goodvibes.jpg");
  background-position: 48px -84px;
  background-size: 269px;
  top: 0;
  left: 0;
}

.colorOverlay {
  width: 100%;
  height: 100%;
  background: #3d3d3dd4;
}

.closeBtn {
  cursor: pointer;
  border-radius: 50px;
  width: 40px;
  height: 40px;
  background: #00000040;
  color: white;
  font-family: "Fredoka One", cursive;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  margin-top: 10px;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
}

.editCover {
  cursor: pointer;
  border-radius: 50px;
  width: 40px;
  height: 40px;
  background: #00000040;
  color: white;
  font-family: "Fredoka One", cursive;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  align-items: center;
  position: absolute;
  top: 88px;
  right: 0;
}

.title {
  line-height: 1.1;
  font-family: "Fredoka One", cursive;
  color: #2d2d2d;
  max-width: 100%;
  font-size: 36px;
  text-align: left;
  position: relative;
  margin-top: 15px;
  padding-left: 30px;
  padding-right: 30px;
  float: left;
  width: 100%;
  box-sizing: border-box;
}

.details {
  font-family: "Roboto", sans-serif;
  color: #000000b3;
  font-size: 16px;
  text-align: left;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding-left: 30px;
  padding-right: 30px;
  margin-top: 10px;
  float: left;
}

.joinLeave {
  width: 92%;
  max-width: 324px;
  height: 53px;
  line-height: 52px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Fredoka One", cursive;
  font-size: 25px;
  border-radius: 6px;
  overflow: hidden;
}

.join,
.leave {
  box-sizing: border-box;
  /* border-bottom: 4px solid #21b5ec; */
  background: #46ceff;
  display: inline-block;
  margin: 0;
  width: 100%;
  height: 100%;
  color: white;
}

.tooFar {
  width: 92%;
  max-width: 324px;
  height: 53px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 5px dashed #e8e8e8;
  color: #e8e8e8;
  box-sizing: border-box;
  background: white;
}

.users {
  position: relative;
  display: flex;
  float: left;
  margin-top: 102px;
  margin-left: 20px;
}

.users > img {
  width: 21px;
  height: 21px;
  border-radius: 65px;
  border: 1px solid #ffffffbd;
  margin-left: 4px;
}

.users > p {
  margin: 0;
  color: white;
  font-family: "Roboto", cursive;
  margin-left: 6px;
  font-size: 18px;
}

.users > :first-child {
  width: 48px;
  height: 48px;
  border-radius: 65px;
  border: 3px solid white;
  margin: 0;
}

.users > :nth-child(2) {
  margin-left: 10px;
}

.pictures {
  width: 100%;
  height: 160px;
  text-align: left;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  bottom: 82px;
  scroll-snap-type: x mandatory;
  margin-top: 25px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.thumb {
  display: inline-block;
  width: 145px;
  height: 145px;
  background-size: cover;
  background-position: center;
}

.comments {
  width: 100%;
  padding-bottom: 120px;
}

.comments > h2 {
  font-family: "Fredoka One", cursive;
  font-weight: 100;
  color: #373737;
  text-align: left;
  margin: 0;
  margin-left: 31px;
  margin-top: 20px;
}

.newComment {
  bottom: 0;
  left: 0;
  position: absolute;
  width: 100%;
  max-width: 465px;
  min-height: 53px;
  background: #000000c2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-items: center;
}

.newComment > input {
  max-width: 76%;
  background: #fff0;
  outline: none;
  color: #fff;
  font-family: "Roboto", sans-serif;
  display: inline-block;
  border: none;
  margin-left: 18px;
  font-size: 17px;
}

.newComment > input::placeholder {
  color: lightgray;
}

.newCommentButtons {
  width: 23%;
  max-width: 85px;
  height: 100%;
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.newCommentButtons > div {
  color: #ffffffe6;
  font-size: 1.1em;
  position: relative;
  outline: none;
  font-size: 35px;
  text-align: center;
  display: inline-block;
}

.newCommentButtons > div:nth-child(2) {
  font-size: 20px;
  padding-right: 20px;
}

.fa-spinner {
  animation: rotate 2s infinite linear;
}

#img-canvas {
  display: none;
}

.sendPicButton {
  width: 200px;
  height: 150px;
  font-size: 100px;
}

label.cameraButton {
  display: inline-block;
  margin: 1em 0;

  /* Styles to make it look like a button */
  padding: 0.5em;
  border: 2px solid #666;
  border-color: #eee #ccc #ccc #eee;
  background-color: #ddd;
}

/* Look like a clicked/depressed button */
label.cameraButton:active {
  border-color: #ccc #eee #eee #ccc;
}

/* This is the part that actually hides the 'Choose file' text box for camera inputs */
label.cameraButton input {
  display: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

@-webkit-keyframes rotate {
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes rotate {
  100% {
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
  }
}
</style>

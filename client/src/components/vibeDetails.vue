<template>
<transition name="fade">
    <div class="scrollBarDiv" v-if="vibe">
      <canvas id="img-canvas" width="200" height="150"></canvas>
      <div class="bg">
        <div class="top">
          <div class="cover">
            <div class="colorOverlay"></div>
          </div>
          <div class="closeBtn">X</div>
          <div class="users">
            <img :src="'https://graph.facebook.com/' + vibe.createdBy.fbid + '/picture?type=large'">
            <img v-for="(uid, idx) in usersToDisplay" :src="'https://graph.facebook.com/' + uid + '/picture?type=large'" :key="idx">
            <p v-if="plusUsers > 0">+{{plusUsers}}</p>
          </div>
          <div class="editCover">
            <i class="fas fa-pen-alt"></i>
          </div>
          <div class="title">!!Fun Party!!</div>
          <div class="details">Created by {{vibe.createdBy.name}}<br>{{time}} | {{distance}}</div>
        </div>
        <div class="bottom">
          <div class="joinLeave">
            <p v-if="inVibe" @click="leaveVibe">i want out</p>
            <p v-else-if="vibe.distance < 25" @click="joinVibe">i want in!</p>
            <p v-else class="tooFar">too far</p>
          </div>
        </div>
          <!-- <div v-if="inVibe" class="sendPicButtonContainer">
            <label v-if="useHtmlCamera" class="cameraButton">Take a picture
              <input type="file" accept="image/*" capture @change="fileLoaded">
            </label>
            <button v-if="!useHtmlCamera" class="cameraButton" @click="sendPic">Take a picture</button>
          </div> -->
          <div class="pictures">
              <photo-gallery :images="newPictures" v-model="index"></photo-gallery>
              <a v-for="(picture, idx) in newPictures" :key="idx" class="thumbSmall" href="#" @click="index = idx">
                <img :src="picture.thumbSrc"/>
              </a>

            <!-- <gallery v-if="!isNative" :images="largePictures" :index="index" @close="closeImg" @onslideend="slideEnd"></gallery>
            <div class="thumbSmall" v-for="(picture, idx) in vibePictures" :key="idx" @click="openImg(idx)" 
            :style="{ backgroundImage: 'url(' + picture.thumbnailUrl + ')' }"
            :class="{thumbBig: idx %4 == 0}">
            </div> -->
          </div>
          <hr>
          <div class="comments">
            <h2>Comments:</h2>
            <comment v-for="(comment, idx) in vibe.comments" :comment="comment" :key="idx"></comment>
          </div>
      </div>
      <div v-if="inVibe" class="newComment">
          <input type="text" @keyup.enter="sendNewComment" v-model="commentTxt">
          <button @click="sendNewComment">></button>
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
import Logo from "./logo";
import { PhotoGallery } from "vue-photo-gallery";

export default {
  name: "VibeDetails",
  components: {
    comment,
    gallery: VueGallery,
    PulseLoader,
    Logo,
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
      demoPics: null
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
      alert("Picture Size: " + size / 1024 + "KB");

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
      var comment = {
        vibeId: this.$store.state.selectedVibe.id,
        text: this.commentTxt
      };
      socket.newComment({ token: this.$store.getters.token, comment });
    },
    joinVibe() {
      socket.joinVibe({
        token: this.$store.getters.token,
        vibeId: this.vibe.id
      });
    },
    leaveVibe() {
      socket.leaveVibe(this.$store.getters.token);
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
      var arr = [4, 4, 4, 4];
      for (var i = 0; i < 4; i++) {
        if (
          this.vibe.users[i] &&
          this.vibe.users[i] != this.vibe.createdBy.fbid
        ) {
          arr.push(this.vibe.users[i]);
        }
      }
      return arr;
    },
    plusUsers() {
      //how many more users are in the vibe
      return this.vibe.users.length - this.usersToDisplay.length;
    },
    vibePictures() {
      return this.vibe.pictures;
    },
    camera() {
      return this.$root.cordova.camera;
    },
    vibe() {
      return this.$store.state.selectedVibe;
    },
    vibes() {
      return this.$store.state.vibes;
    },
    inVibe() {
      return this.$store.state.selectedVibe.id === this.$store.state.inVibe;
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
    }
  },
  watch: {
    $route(to, from) {
      if (this.slide) {
        this.slide = false;
        return;
      }
      var vibeId = to.query.v;
      if (vibeId) {
        var vibe = this.$store.getters.getVibeById(vibeId);
        if (vibe) {
          this.$store.commit("setSelectedVibe", vibe);
          var imgIdx = to.query.img;
          if (imgIdx >= 0) {
            this.index = +imgIdx;
          } else {
            this.index = null;
          }
        }
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
  max-width: 500px;
  overflow-y: hidden;
}

.scrollBarDiv::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.scrollBarDiv::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}
.scrollBarDiv::-webkit-scrollbar-thumb {
  background: #ffffff;
  border: 0px none #ffffff;
  border-radius: 50px;
}
.scrollBarDiv::-webkit-scrollbar-thumb:hover {
  background: #fff;
}
.scrollBarDiv::-webkit-scrollbar-thumb:active {
  background: #ffff;
}
.scrollBarDiv::-webkit-scrollbar-track {
  background: #0000;
  border: 0px none #ffffff;
}
.scrollBarDiv::-webkit-scrollbar-corner {
  background: transparent;
}

/* items */
.bg {
  width: 100%;
  max-width: 465px;
  background: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  float: left;
  position: relative;
  overflow-y: hidden;
  overflow-x: hidden;
  min-height: 100%;
}

.top {
  display: inline-block;
  height: 285px;
  width: 100%;
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
  position: absolute;
  max-width: 100%;
  font-size: 36px;
  text-align: left;
  padding: 0;
  top: 175px;
  left: 31px;
}

.details {
  position: absolute;
  font-family: "Roboto", sans-serif;
  color: #000000b3;
  font-size: 16px;
  text-align: left;
  top: 223px;
  left: 32px;
}

.joinLeave {
  width: 92%;
  max-width: 324px;
  background: #8be0ff;
  height: 53px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.joinLeave > p {
  margin: 0;
  width: 100%;
  height: 100%;
  line-height: 53px;
  font-family: "Fredoka One", cursive;
  color: white;
  font-size: 25px;
}

.tooFar {
  display: flex;
  align-items: center;
  border: 5px dashed #e8e8e8;
  box-sizing: border-box;
  border-radius: 10px;
  font-size: 20px;
}

.tooFar > span {
  margin: 0;
  padding: 10px 35px;
  color: #e8e8e8;
  font-weight: bold;
}

.thumbSmall {
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  grid-column: span 1;
  grid-row: span 1;
}

.thumbBig {
  width: 100%;
  height: 100%;
  grid-column: span 2;
  grid-row: span 2;
}

.picture {
  width: 200px;
  height: 150px;
}

.pictures {
  box-sizing: border-box;
  width: 100%;
  overflow-x: hidden;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  grid-auto-rows: 160px;
  grid-auto-flow: dense;
  grid-gap: 0;
  margin-top: 25px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.users {
  position: absolute;
  display: flex;
  top: 102px;
  left: 22px;
}

.users > img {
  width: 21px;
  height: 21px;
  border-radius: 65px;
  border: 1px solid #ffffffbd;
  margin-left: 4px;
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

.comments {
  width: 100%;
  padding-bottom: 120px;
}

.comments > h2 {
  text-align: left;
}

.newComment {
  bottom: 0;
  left: 0;
  position: absolute;
  width: 480px;
  height: 10%;
  display: flex;
  align-items: center;
  background: #fff;
  justify-content: space-between;
  box-shadow: -30px 20px 47px;
  border-top: 1px solid #eaeaea;
}

.newComment > input {
  width: 80%;
  height: 40%;
  background: #dddddd;
  border: 1px solid #c7c7c7;
  outline: none;
  margin-left: 2%;
  padding: 10px;
  border-radius: 100px;
  color: #373737;
  font-family: "ABeeZee", sans-serif;
  font-size: 1.1em;
}

.newComment > button {
  padding: 10px;
  font-size: 1.1em;
  font-family: "ABeeZee", sans-serif;
  border-radius: 100px;
  position: relative;
  width: 15%;
  margin-left: 15px;
  margin-right: 15px;
  border: 1px solid #c7c7c7;
  height: 80%;
  padding: 10px;
  outline: none;
  font-size: 24px;
  line-height: 10px;
  text-align: center;
}

.spinner {
  /* position: absolute; */
}

#img-canvas {
  display: none;
}

hr {
  border: 0;
  height: 1px;
  background-image: linear-gradient(to right, #e4e4e410, #e4e4e4, #e4e4e410);
  width: 95%;
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
</style>

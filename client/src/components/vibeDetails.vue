<template>
    <div class="main" v-if="vibe" :class="{open: isOpen, closed: !isOpen}">
      <canvas id="img-canvas" width="200" height="150"></canvas>
          <div class="topBar" v-if="isMobile">
            <Logo class="logo" :size="40" :shadow="false" :plain="true"></Logo>
            <div class="closeBtn" @click="close">
              <div></div>
              <div></div>
            </div>
          </div>
      <div class="scrollBarDiv" ref="scrollBarDiv">
        <div class="bg">
          <div class="titleWrapper" ref="titleWrapper">
              <div class="titleBg"></div>
              <div class="titleStroke" ref="titleStroke">{{vibe.title}}</div>
              <div class="title" ref="title">{{vibe.title}}</div>
          </div>
          <div class="top">
            <div class="joinLeave">
                <div class="join" v-if="!inVibe && vibe.distance < 50" @click="joinVibe">
                  <div class="joinText">
                    <span>Join!</span>
                    <span>Join!</span>
                  </div>
                  <img src="../assets/join_arrow.png">
                </div>
                <div class="tooFar" v-else-if="!inVibe && vibe.distance > 50">
                    <span>Too Far</span>
                </div>
                <div class="leave" v-else-if="inVibe" @click="leaveVibe">
                  <img src="../assets/leave_arrow.png">
                  <div class="leaveText">
                    <span>Leave</span>
                    <span>Leave</span>
                  </div>
                </div>
            </div>
            <div class="emojis">
                <div class="emoji">{{vibe.emojis[0]}}</div>
                <div class="emoji">{{vibe.emojis[1]}}</div>
                <div class="emoji">{{vibe.emojis[2]}}</div>
            </div>
          </div>
          <div class="info">
            <img class="creatorPic" :src="'https://graph.facebook.com/' + vibe.createdBy.fbid + '/picture?type=square'">
            <div class="details">
              <p>Created By: {{vibe.createdBy.name}}</p>
              <div>
                <img src="../assets/users_icon.png">
                <span> {{vibe.users.length}} - {{distance}} - {{time}}.</span>
              </div>
            </div>
          </div>
          <div class="users" v-if="vibe.users.length > 0">
            <img class="profilePic" v-for="(user, idx) in vibe.users" :key="idx" :src="'https://graph.facebook.com/' + user + '/picture?type=square'">
          </div>
          <div v-if="inVibe" class="sendPicButtonContainer">
            <label v-if="useHtmlCamera" class="cameraButton">Take a picture
              <input type="file" accept="image/*" capture @change="fileLoaded">
            </label>
            <button v-if="!useHtmlCamera" class="cameraButton" @click="sendPic">Take a picture</button>
          </div>
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
      </div>
      <div v-if="inVibe" class="newComment">
          <input type="text" @keyup.enter="sendNewComment" v-model="commentTxt">
          <button @click="sendNewComment">></button>
      </div>
      <div class="closeBtn" @click="close" v-if="!isMobile">
          <div></div>
          <div></div>
      </div>
    </div>    
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
import { PhotoGallery } from 'vue-photo-gallery';

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
      isMobile: false,
      isMounted: false,
      isOpen: false,
      time: null,
      commentTxt: "",
      titlePxSizeBase: 45,
      maxTitleHeight: 150,
      firebaseStorage: this.$root.firebaseStorage,
      firebase: this.$root.firebase,
      index: null,
      loaderColor: "#d5effd",
      uploadingPictures: [],
      slide: false, //check if link change was from a slide,
      demoPics: null,
    };
  },
  mounted() {
    this.isMounted = true;
    var self = this;

    //keep timeago updated
    setInterval(function() {
      if (self.vibe) {
        self.time = timeAgo.format(self.vibe.createdAt);
      }
    }, 10000);
    window.addEventListener("resize", this.resizeLayout);
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
        quality: 100,
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
    resizeLayout(e) {
      if (!this.open || !this.isMounted || !this.vibe) return;

      this.$nextTick(function() {
        this.$refs.scrollBarDiv.style.marginTop = this.isMobile ? "80px" : "0";

        //title resize
        var fontSize = this.titlePxSizeBase;
        var title = this.$refs.title;
        var titleStroke = this.$refs.titleStroke;
        var titleWrapper = this.$refs.titleWrapper;
        var maxHeight = this.maxTitleHeight;
        var maxWidth = titleWrapper.clientWidth;

        titleStroke.style.fontSize = fontSize + "px";

        while (
          titleStroke.clientHeight > maxHeight ||
          titleStroke.clientWidth > maxWidth
        ) {
          fontSize--;
          titleStroke.style.fontSize = fontSize + "px";
        }

        titleStroke.style.fontSize = fontSize - 5 + "px";
        title.style.fontSize = fontSize - 5 + "px";
        titleWrapper.style.height =
          Math.max(titleStroke.clientHeight, 35) + "px";
      });
    },
    open() {
      this.isMobile = window.innerWidth < 650 ? true : false;
      this.isOpen = true;
      this.resizeLayout();
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
        }
      });
    },
    vibePictures() {
      if (!this.demoPics) {
        this.demoPics = [];
        for (var i=0; i<30; i++) {
          var url = 'https://picsum.photos/200/300/?random&r=' + Math.random();
          this.demoPics.push({
            imgUrl: url,
            thumbnailUrl: url
          });
        }
      }
      var returnPics = this.vibe.pictures.reverse().concat(this.demoPics);
      return returnPics;
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
          this.open();
          var imgIdx = to.query.img;
          if (imgIdx >= 0) {
            this.index = +imgIdx;
          } else {
            this.index = null;
          }
        }
      } else {
        this.isOpen = false;
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
          this.open();
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
@keyframes openAnim {
  from {
    left: -600px;
  }
  to {
    left: 0px;
  }
}

@keyframes closeAnim {
  from {
    left: 0px;
  }
  to {
    left: -600px;
  }
}

.noAnim {
  animation-duration: 0s;
}

.open {
  left: 0px;
  animation: openAnim;
  animation-duration: 0.25s;
  animation-timing-function: ease-out;
}

.closed {
  pointer-events: none;
  transform: translateX(-10px);
  left: -650px;
  animation: closeAnim;
  animation-duration: 0.25s;
  animation-timing-function: ease-out;
}

.wrapper {
  position: absolute;
  height: 100%;
}

.scrollBarDiv {
  width: 505px;
  height: 100%;
  overflow-y: auto;
  margin-top: 80px;
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
.topBar {
  position: absolute;
  width: 100vw;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* justify-content: flex-end; */
  /* background: white; */
  background: #5dc8ff;
  border-bottom: 1px #dfdfdf solid;
  margin-top: 0px;
}

.topBar > .closeBtn {
  cursor: pointer;
  border-radius: 50px;
  width: 50px;
  height: 50px;
  background: #fff;
  color: white;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 10px;
  box-sizing: border-box;
  box-shadow: unset;
  margin: 0;
  margin-right: 20px;
  position: relative;
}

.logo {
  margin-left: 20px;
}

/* items */
.bg {
  width: 480px;
  background: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  float: left;
  position: relative;
  overflow-y: hidden;
  overflow-x: hidden;
  min-height: 100%;
}

.main {
  height: 100%;
  width: 580px;
  overflow-y: hidden;
  overflow-x: hidden;
}

.closeBtn {
  cursor: pointer;
  border-radius: 50px;
  border: 3px white solid;
  width: 65px;
  height: 65px;
  background: #5dc8ff;
  float: left;
  color: white;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 10px;
  box-sizing: border-box;
  margin-left: 15px;
  margin-top: 15px;
  align-items: center;
  box-shadow: 0px 6px 6px -1px #00000030;
  position: absolute;
  top: 0;
  right: 0;
}

.closeBtn > div {
  position: absolute;
  width: 25px;
  height: 5px;
  background: white;
  border-radius: 10px;
}

.closeBtn > div:nth-child(1) {
  transform: rotate(45deg);
}

.closeBtn > div:nth-child(2) {
  transform: rotate(-45deg);
}

.topBar > .closeBtn > div {
  background: #5dc8ff;
}

.titleWrapper {
  padding-top: 37px;
  padding-bottom: 25px;
  overflow: initial;
  line-height: normal;
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.titleWrapper > div::first-letter {
  text-transform: capitalize;
}

.titleBg {
  background: #d5effd;
  min-height: 55px;
  height: 65%;
  width: 100%;
  margin-left: 20px;
  margin-right: 20px;
  border-radius: 8px 8px 8px 8px;
}

.title {
  line-height: 1.1;
  font-family: "Pacifico", cursive, sans-serif;
  color: white;
  position: absolute;
  transform: translateY(-10px);
  width: 100%;
  font-size: 40px;
  text-align: center;
  padding: 0;
}

.titleStroke {
  line-height: 1.1;
  font-family: "Pacifico", cursive, sans-serif;
  color: white;
  position: absolute;
  transform: translateY(-10px);
  width: 100%;
  font-size: 40px;
  text-align: center;
  padding: 0;
  -webkit-text-stroke-width: 5px;
  -webkit-text-stroke-color: #3fb7f5;
  transform: translateY(-10px);
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  padding-bottom: 10px;
}

.join,
.leave {
  cursor: pointer;
  font-family: "Pacifico", cursive, sans-serif;
  font-size: 36px;
  border-radius: 20px;
  background: #ffe9f1;
  box-shadow: -7px 7px 0px 0px #ff91de;
  border: 4px solid #ff91de;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  width: 170px;
  color: white;
  padding: 0px 15px 0px 15px;
}

.leave {
  background: #d5effd;
  box-shadow: -7px 7px 0px 0px #92cded;
  border: 4px solid #92cded;
}

.joinText,
.leaveText {
  user-select: none;
  width: 100px;
  height: 40px;
  display: flex;
  align-items: center;
}

.joinText span:nth-child(1) {
  -webkit-text-stroke: #ff99e0 5px;
}

.leaveText span:nth-child(1) {
  -webkit-text-stroke: #92cded 5px;
}

.join span,
.leave span {
  position: absolute;
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

.details {
  height: 100%;
  width: 100%;
  display: inline-block;
  font-family: "ABeeZee", sans-serif;
  color: #b3b3b3;
  font-size: 16px;
  text-align: left;
  padding-left: 5px;
  font-style: italic;
  height: fit-content;
}

.details > p {
  color: #818181;
  font-size: 15px;
  font-weight: bold;
  font-family: "ABeeZee", sans-serif;
  margin: 7px 0px 0px 10px;
}

.details > div {
  display: flex;
  margin: 5px 0px 0px 20px;
  font-size: 13px;
}

.details > div > img {
  margin-right: 15px;
  width: 18px;
  height: 18px;
}

.profilePic {
  width: 30px;
  height: 30px;
  margin: 1px;
  border-radius: 70px;
}

.info {
  padding: 20px;
  display: flex;
}

.creatorPic {
  width: 50px;
  height: 50px;
  border-radius: 70px;
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
  box-sizing: border-box;
  display: flex;
  background: #efefef;
  width: 100%;
  flex-flow: wrap;
  padding: 5px;
  margin-top: 10px;
}

.emojis {
  padding-right: 10px;
  float: right;
  display: inline-flex;
  justify-content: center;
  font-size: 40px;
  opacity: 0.9;
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

.sendPicButtonContainer {
}

@media (max-width: 650px) {
  .main {
    width: 100%;
  }

  .wrapper {
    width: 100%;
  }

  .scrollBarDiv {
    width: 100%;
  }

  .scrollBarDiv::-webkit-scrollbar-track {
    background: #d8d8d8;
    border: 0px none #ffffff;
  }

  .bg {
    width: 100%;
  }

  .tooFar > p {
    padding: 10px 30px;
  }

  .closeBtn {
    margin-right: 15px;
  }

  .newComment {
    width: 100%;
  }

  .userPics {
    display: none;
  }
}

@media (max-width: 420px) {
  .top {
    flex-direction: column-reverse;
  }
  .joinLeave {
    margin-top: 20px;
    margin-left: 0px;
  }

  .pictures {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    grid-auto-rows: 120px;
  }
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
</style>

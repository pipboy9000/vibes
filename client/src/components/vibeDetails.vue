<template>
    <div class="main" v-if="vibe" :class="{open: isOpen, closed: !isOpen}">
      <div class="scrollBarDiv">
        <div class="bg">
          <div class="titleWrapper" ref="titleWrapper">
              <div class="titleBg"></div>
              <div class="titleStroke" ref="titleStroke">{{vibe.title}}</div>
              <div class="title" ref="title">{{vibe.title}}</div>
          </div>
          <div class="top">
            <div class="joinLeave">
                <div class="tooFar" v-if="vibe.distance > 50">
                    <span>Too Far</span>
                </div>
                <div class="join" v-else-if="!inVibe" @click="joinVibe">
                    <span>Join!</span>
                    <span>Join!</span>
                    <img src="../assets/join_arrow.png">
                </div>
                <div class="leave" v-else @click="leaveVibe">
                    <img src="../assets/leave_vibe_btn.png">
                    <span>Leave Vibe :( </span>
                </div>
            </div>
            <div class="emojis">
                <div class="emoji">{{vibe.emojis[0]}}</div>
                <div class="emoji">{{vibe.emojis[1]}}</div>
                <div class="emoji">{{vibe.emojis[2]}}</div>
            </div>
          </div>
            <!-- <div class="pictures">
              <gallery :images="images" :index="index" @close="index = null"></gallery>
              <div
                class="image"
                v-for="(image, imageIndex) in images"
                :key="imageIndex"
                @click="index = imageIndex"
                :style="{ backgroundImage: 'url(' + image + ')', width: '200px', height: '200px' }"
              ></div>
            </div> -->
              <!-- <div
                class="image"
                v-for="(image, imageIndex) in images"
                :key="imageIndex"
                @click="index = imageIndex"
                :style="{ backgroundImage: 'url(' + image + ')', width: '200px', height: '200px' }"
              ></div> -->
          <!-- <div class="info">
              <div class="details">
                  <div class="userPics">
                    <img :src="profilePicSrc" class="profilePic" v-for="(test, index) in [123,123,123,1,1,1,1,1,1,1,1,1,1,1]" :key="index">
                  </div>
                  <br>
                  <div class="createdBy">
                      <p>Created by {{vibe.createdBy.name}}</p>
                  </div>
                  <br>
                  <div class="users">
                      <img src="../assets/users_icon.png">
                      <p> {{vibe.users.length}} - {{distance}} - {{time}}.</p>
                  </div>
              </div>
          </div> -->
          <hr>
          <div class="comments">
            <comment v-for="(comment, idx) in vibe.comments" :comment="comment" :key="idx"></comment>
          </div>
        </div>
      </div>
      <div class="newComment">
          <input type="text" @keyup.enter="sendNewComment" v-model="commentTxt">
          <button>></button>
          <button @click="sendPic">+</button>
      </div>
      <div  class="closeBtn" @click="close">
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

export default {
  name: "VibeDetails",
  components: {
    comment,
    gallery: VueGallery
  },
  data() {
    return {
      isMounted: false,
      isOpen: false,
      time: null,
      commentTxt: "",
      titlePxSizeBase: 65,
      maxTitleHeight: 150,
      firebaseStorage: this.$root.firebaseStorage,
      firebase: this.$root.firebase,
      index: null
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

    EventBus.$on("listItemClicked", this.open);
    EventBus.$on("vibeMarkerClicked", this.open);

    window.onresize = function() {
      if (self.open) {
        self.resizeLayout();
      }
    };
  },
  methods: {
    sendPic() {
      //console.log(firebase.storage());
      //console.log(firebase.storage().ref());
      //firebase.storage().ref("pepo").putString("123");
      //console.log("after");

      console.log("setting camera options");
      const options = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        targetWidth: 200,
        targetHeight: 200
      };

      var self = this;
      this.camera.getPicture(
        imageData => {
          // imageData is either a base64 encoded string or a file URI
          // If it's base64 (DATA_URL):
          //let base64Image = 'data:image/jpeg;base64,' + imageData;
          console.log("getPicture success callback");
          //console.log("imageData:"+imageData);
          try {
            var uploadTask = self.firebaseStorage
              .child(new Date().getTime().toString())
              .putString(imageData, "base64");

            uploadTask.on(
              "state_changed",
              function(snapshot) {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress =
                  snapshot.bytesTransferred / snapshot.totalBytes * 100;
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
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                uploadTask.snapshot.ref
                  .getDownloadURL()
                  .then(function(downloadURL) {
                    console.log("Uploaded a blob or file!");
                    console.log("got downloadURL: ", downloadURL);

                    var picture = {
                      vibeId: self.$store.state.selectedVibe.id,
                      imgUrl: downloadURL
                    };
                    socket.newPicture({
                      token: self.$store.getters.token,
                      picture
                    });
                    self.vibe.pictures.push(picture);

                    // var comment = {
                    //   vibeId: self.$store.state.selectedVibe.id,
                    //   imgUrl: downloadURL
                    // };
                    // socket.newComment({
                    //   token: self.$store.getters.token,
                    //   comment
                    // });
                  });
              }
            );
          } catch (errr) {
            alert(errr);
          }
        },
        err => {
          // Handle error
          console.error("error in camera callback:");
          console.error(err);
        },
        options
      );
    },
    resizeLayout(e) {
      if (!this.isMounted || !this.vibe) return;

      this.$nextTick(function() {
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
      this.isOpen = true;
      this.resizeLayout();
    },
    close() {
      this.isOpen = false;
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
    images() {
      return this.vibe.pictures.map(x => x.imgUrl);
    },
    camera() {
      return this.$root.cordova.camera;
    },
    vibe() {
      return this.$store.state.selectedVibe;
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
    vibe(newVibe) {
      this.time = timeAgo.format(this.vibe.createdAt);
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
  left: -570px;
  animation: closeAnim;
  animation-duration: 0.25s;
  animation-timing-function: ease-out;
}

.wrapper {
  position: absolute;
  height: 100%;
}

.scrollBarDiv {
  width: 495px;
  height: 100%;
  overflow-y: auto;
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
  width: 570px;
  overflow-y: hidden;
  overflow-x: hidden;
}

.closeBtn {
  border-radius: 50px;
  border: 4px white solid;
  width: 65px;
  height: 65px;
  background: #22dbe3a8;
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

.titleWrapper {
  padding-top: 10px;
  padding-bottom: 10px;
  overflow: initial;
  line-height: normal;
  margin-top: 15px;
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
  height: 55px;
  width: 95%;
  border-radius: 0 8px 8px 0;
}

.title {
  line-height: 1.1;
  padding-left: 20px;
  padding-right: 20px;
  text-align: left;
  font-size: 60px;
  font-family: "Pacifico", cursive, sans-serif;
  color: white;
  position: absolute;
  transform: translateY(-10px);
  /* text-overflow: ellipsis; */
}

.titleStroke {
  line-height: 1.1;
  padding-left: 20px;
  padding-right: 20px;
  text-align: left;
  font-size: 60px;
  font-family: "Pacifico", cursive, sans-serif;
  color: white;
  position: absolute;
  -webkit-text-stroke-width: 5px;
  -webkit-text-stroke-color: #3fb7f5;
  transform: translateY(-10px);
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  margin-top: 10px;
}

.join {
  float: left;
  font-family: "Pacifico", cursive, sans-serif;
  border-radius: 20px;
  background: #ffe9f1;
  box-shadow: -7px 7px 0px 0px #ff91de;
  border: 4px solid #ff91de;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 100px;
}

.join > span {
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

.info {
  box-sizing: border-box;
  background: #f2faff;
  height: 75px;
  display: flex;
  align-items: center;
  width: 100%;
  height: fit-content;
  padding: 22px 0 20px 10px;
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

.createdBy {
  display: inline-block;
  margin-top: 10px;
  margin-bottom: 10px;
  max-width: 65%;
  margin-left: 10px;
}

.createdBy > p {
  padding: 0;
  margin: 0;
  margin-top: 5px;
  margin-bottom: 5px;
}

.profilePic {
  padding: 3px;
  display: inline-block;
  width: 35px;
  border-radius: 70px;
  max-width: 15%;
}

.pictures {
  width: 100%;
  height: 210px;
  overflow-x: scroll;
}

.image {
  margin: 5px;
  border-radius: 10px;
  display: inline-block;
}

.users {
  display: inline-flex;
  align-items: center;
  white-space: pre;
  margin-left: 15px;
  height: fit-content;
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
  padding-bottom: 60px;
  width: 100%;
}

.newComment {
  display: inline-block;
  bottom: 0;
  left: 0;
  position: absolute;
  width: 480px;
  height: 10%;
  display: flex;
  align-items: center;
}

.newComment > input {
  width: 70%;
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
  width: 10%;
  margin-left: 2%;
  border: 1px solid #c7c7c7;
  height: 80%;
  padding: 10px;
  outline: none;
  font-size: 24px;
  line-height: 10px;
  text-align: center;
}

hr {
  border: 0;
  height: 1px;
  background-image: linear-gradient(to right, #e4e4e410, #e4e4e4, #e4e4e410);
  width: 95%;
}

@media (max-width: 570px) {
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

  .title,
  .titleStroke,
  .titleBg {
    margin-right: 95px;
  }

  .newComment {
    width: 100%;
  }

  .userPics {
    display: none;
  }
}
</style>

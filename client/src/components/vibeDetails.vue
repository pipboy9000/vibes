<template>
    <div v-if="vibe" class="wrapper" :class="{open: isOpen, closed: !isOpen, noAnim: !ready}">
        <div class="bg">
          <div class="main">
            <div class="titleWrapper" ref="titleWrapper">
                <div ref="titleBg" class="titleBg"></div>
                <div class="titleStroke" ref="titleStroke">{{vibe.title}}</div>
                <div class="title" ref="title">{{vibe.title}}</div>
            </div>
            <div class="joinLeave">
              <div class="tooFar" v-if="vibe.distance > 50">
                <p>Too Far</p>
              </div>
                <div class="join" v-else-if="!inVibe" @click="joinVibe">
                    <img src="../assets/join_vibe_btn.png">
                    <p>Join Vibe!</p>
                </div>
                <div class="leave" v-else @click="leaveVibe">
                  <img src="../assets/leave_vibe_btn.png">
                    <p>Leave Vibe :( </p>
                </div>
            </div>
                <div class="emojis">
                    <div class="emoji">{{vibe.emojis[0]}}</div>
                    <div class="emoji">{{vibe.emojis[1]}}</div>
                    <div class="emoji">{{vibe.emojis[2]}}</div>
                </div>
            <div class="pictures"></div>
            <div class="info">
                <div class="details">
                    <img :src="profilePicSrc" class="profilePic" v-for="(test, index) in [123,123,123,1,1,1,1,1,1,1,1,1,1,1]" :key="index">
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
            </div>
            <hr>
            <div class="comments">
              <comment v-for="(comment, idx) in vibe.comments" :comment="comment" :key="idx"></comment>
            </div>
          </div>
        </div>
            <div class="newComment">
              <input type="text" @keyup.enter="sendNewComment" v-model="commentTxt">
              <button>></button>
            </div>
        <div class="closeBtn" @click="close">X</div>
    </div>
</template>

<script>
import { EventBus } from "../event-bus.js";
import { timeAgo } from "../services/timeAgo.js";
import { formatDistance } from "../services/maps.js";
import socket from "../services/socket.js";
import comment from "./comment";

export default {
  name: "VibeDetails",
  components: {
    comment
  },
  data() {
    return {
      isOpen: false,
      ready: false, //used to fix animations
      time: null,
      commentTxt: "",
      titleWidth: null,
      titlePxSize: 65,
      titlePxSizeBase: 65
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

    EventBus.$on("listItemClicked", this.open);
    EventBus.$on("vibeMarkerClicked", this.open);
  },
  methods: {
    resizeTitle(e) {
      debugger;
      if (this.$refs.titleStroke.clientWidth - this.titleWidth > 10) {
        this.titlePxSize--;
        this.$refs.titleStroke.style.fontSize = this.titlePxSize + "px";
        this.$refs.title.style.fontSize = this.titlePxSize + "px";
        var marginTop = (65 - this.titlePxSize) / 65 * 20;
        this.$refs.titleStroke.style.marginTop = marginTop + "px";
        this.$refs.title.style.marginTop = marginTop + "px";
        this.$nextTick(this.resizeTitle);
      } else if (
        this.$refs.titleStroke.clientWidth - this.titleWidth < -10 &&
        this.titlePxSize < this.titlePxSizeBase
      ) {
        this.titlePxSize++;
        this.$refs.titleStroke.style.fontSize = this.titlePxSize + "px";
        this.$refs.title.style.fontSize = this.titlePxSize + "px";
        this.$nextTick(this.resizeTitle);
      }
    },
    open() {
      debugger;
      this.isOpen = true;
      if (!this.titleWidth) {
        this.$nextTick(function() {
          debugger;
          this.titleWidth = this.$refs.titleBg.clientWidth - 30;
        });
      }
      setTimeout(this.resizeTitle, 0);
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
  transform: translateX(-10px);
  left: -550px;
  animation: closeAnim;
  animation-duration: 0.25s;
  animation-timing-function: ease-out;
}

.wrapper {
  position: absolute;
  height: 100%;
}

/* items */
.bg {
  height: 100%;
  width: 480px;
  background: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  float: left;
  position: relative;
}

.main {
  height: 90%;
  overflow-y: scroll;
  overflow-x: hidden;
}

.closeBtn {
  margin-top: 10px;
  margin-left: 10px;
  border-radius: 50px;
  border: 3px white solid;
  width: 50px;
  height: 50px;
  line-height: 43px;
  font-size: 20px;
  background: #91daffc9;
  font-family: cursive;
  font-weight: 900;
  float: left;
  color: white;
  user-select: none;
  box-sizing: border-box;
}

.openBtn {
  margin-left: 6px;
  border-radius: 50px;
  border: 3px white solid;
  width: 50px;
  height: 50px;
  background: #91daffc9;
  float: left;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 10px;
  box-sizing: border-box;
}

.openBtn {
  float: left;
}

.titleWrapper {
  position: relative;
  height: 100px;
  padding-top: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.titleBg {
  background: #d5effd;
  height: 55px;
  width: 95%;
  border-radius: 0 8px 8px 0;
}

.title {
  width: 80%;
  padding-left: 15px;
  text-align: left;
  font-size: 60px;
  font-family: "Pacifico", cursive;
  color: white;
  position: absolute;
  transform: translateY(-10px);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.titleStroke {
  /* width: 80%; */
  text-align: left;
  padding-left: 15px;
  font-size: 60px;
  font-family: "Pacifico", cursive;
  color: white;
  position: absolute;
  -webkit-text-stroke-width: 5px;
  -webkit-text-stroke-color: #3fb7f5;
  transform: translateY(-10px);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.joinLeave {
}

.joinLeave:hover {
}

.join,
.leave {
  display: flex;
  align-items: center;
  width: max-content;
  padding-left: 12px;
  padding-bottom: 15px;
  font-size: 15px;
  padding: 10px;
  background: #5bd6ff;
  border-radius: 10px;
  font-size: 20px;
  padding-right: 36px;
  font-weight: 700;
  margin: 15px;
  margin-bottom: 30px;
  box-shadow: 0px 7px 0px 0px #51c7ee;
  min-width: 40%;
  float: left;
}

.tooFar {
  display: flex;
  align-items: center;
  width: max-content;
  font-size: 15px;
  border: 5px dashed #e8e8e8;
  box-sizing: border-box;
  border-radius: 10px;
  font-size: 20px;
  font-weight: 700;
  margin: 15px;
  margin-bottom: 30px;
  min-width: 40%;
  float: left;
}

.tooFar > p {
  margin: 0;
  padding: 0;
  color: #e8e8e8;
  width: 100%;
  line-height: 50px;
}

.join > p,
.leave > p {
  margin-left: 15px;
  margin-top: 0;
  margin-right: 0;
  margin-bottom: 0;
  padding: 0;
  color: white;
  text-shadow: -1px -1px 0px #86e0ff;
  width: 100%;
}

.info {
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

.users {
  display: inline-flex;
  align-items: center;
  white-space: pre;
  margin-left: 15px;
  height: fit-content;
}

.emojis {
  padding-right: 10px;
  width: 40%;
  line-height: 100px;
  float: right;
  display: inline-flex;
  justify-content: center;
  font-size: 40px;
  opacity: 0.9;
}

.emoji {
  margin-left: 5px;
  margin-right: 5px;
}

.comments {
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

.main::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.main::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}
.main::-webkit-scrollbar-thumb {
  background: #d2d2d2;
  border: 1px none #f00;
  border-radius: 50px;
}

.main::-webkit-scrollbar-track {
  background: #0000;
  border: 0px none #ffffff;
  border-radius: 50px;
}
.main::-webkit-scrollbar-corner {
  background: transparent;
}
</style>

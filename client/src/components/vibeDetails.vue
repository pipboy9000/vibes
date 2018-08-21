<template>
    <div v-if="vibe" class="wrapper" :class="{open: isOpen, closed: !isOpen, noAnim: !ready}">
        <div class="bg">
          <div class="main">
            <div class="titleWrapper" ref="titleWrapper">
                <div class="titleBg"></div>
                <div class="titleStroke" ref="titleStroke">{{vibe.title}}</div>
                <div class="title" ref="title">{{vibe.title}}</div>
            </div>
            <div class="pictures"></div>
            <div class="info">
                <div class="details">
                    <img :src="profilePicSrc" class="profilePic">
                    <div class="createdBy">
                        Created by: {{vibe.createdBy.name}} - {{distance}}
                    </div>
                    <br>
                    <div class="users">
                        <img src="../assets/users_icon.png">
                        <p> {{vibe.users.length}} - {{time}}.</p>
                    </div>
                </div>
                <div class="emojis">
                    <div class="emoji">{{vibe.emojis[0]}}</div>
                    <div class="emoji">{{vibe.emojis[1]}}</div>
                    <div class="emoji">{{vibe.emojis[2]}}</div>
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
      commentTxt: ""
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
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
    sendNewComment() {
      var comment = {
        vibeId: this.$store.state.selectedVibe.id,
        text: this.commentTxt
      };
      socket.newComment({ comment, token: this.$store.getters.token });
    }
  },
  computed: {
    vibe() {
      return this.$store.state.selectedVibe;
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
  height: 110px;
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
  width: 80%;
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

.info {
  background: #f2faff;
  height: 75px;
  display: flex;
  align-items: center;
  width: 100%;
  height: fit-content;
  padding: 5px 0 5px;
}

.details {
  height: 100%;
  width: 50%;
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
  margin-bottom: 10px;
  max-width: 65%;
  margin-left: 10px;
}

.profilePic {
  border-radius: 70px;
  display: inline-block;
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
  height: 100%;
  width: 50%;
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
  width: 100%;
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

<template>
    <div v-if="vibe" class="wrapper" :class="{open: isOpen, closed: !isOpen, noAnim: !ready}">
        <div class="bg">
            <div class="titleWrapper">
                <div class="titleBg"></div>
                <div class="titleStroke">{{vibe.title}}</div>
                <div class="title">{{vibe.title}}</div>
            </div>
            <div class="pictures">
                
            </div>
            <div class="info">
                <div class="details">
                    <div class="createdBy">
                        Created by: Dan Levin
                    </div>
                    <br>
                    <div class="users">
                        <img src="../assets/users_icon.png">
                        <p> 9 - {{time}}.</p>
                    </div>
                </div>
                <div class="emojis">
                    <div class="emoji">{{vibe.emojis[0]}}</div>
                    <div class="emoji">{{vibe.emojis[1]}}</div>
                    <div class="emoji">{{vibe.emojis[2]}}</div>
                </div>
            </div>
            <hr>
        </div>
        <div class="closeBtn" @click="close">X</div>
    </div>
</template>

<script>
import { EventBus } from "../event-bus.js";
import { timeAgo } from "../services/timeAgo.js";
export default {
  name: "VibeDetails",
  data() {
    return {
      isOpen: false,
      ready: false, //used to fix animations
      time: null
    };
  },
  mounted() {
    var self = this;

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
    }
  },
  computed: {
    vibe() {
      return this.$store.state.selectedVibe;
    }
  },
  watch: {
    vibe(newVibe) {
      debugger;
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

.bg {
  height: 100%;
  width: 480px;
  background: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  float: left;
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
  height: 110px;
  width: 100%;
  display: flex;
  align-items: center;
}

.titleBg {
  background: #d5effd;
  height: 55px;
  width: 95%;
  border-radius: 0 8px 8px 0;
}

.title {
  margin-left: 20px;
  font-size: 65px;
  text-align: center;
  font-family: "Pacifico", cursive;
  color: white;
  position: absolute;
  transform: translateY(-10px);
}

.titleStroke {
  margin-left: 20px;
  font-size: 65px;
  text-align: center;
  font-family: "Pacifico", cursive;
  color: white;
  position: absolute;
  -webkit-text-stroke-width: 5px;
  -webkit-text-stroke-color: #3fb7f5;
  transform: translateY(-10px);
}

.info {
  height: 75px;
  display: flex;
  align-items: center;
  padding: 5px;
  height: fit-content;
  margin-top: 10px;
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

hr {
  border: 0;
  height: 1px;
  background-image: linear-gradient(to right, #e4e4e410, #e4e4e4, #e4e4e410);
  width: 95%;
}
</style>

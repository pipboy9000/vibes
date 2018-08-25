<template>
  <transition name="fade">
    <div class="overlay" @click="close" v-if="show">
        <div class="bg" @click="bgClicked">
            <div class="titleWRapper">
                <div ref="titleBg" class="titleBg"></div>
                <div ref="titleStroke" class="titleStroke">{{title}}</div>
                <input ref="titleInput" 
                       class="title input" 
                       placeholder="Title" 
                       v-model="title" 
                       @input="resizeTitle" 
                       @paste="onPaste" 
                       @keydown="resizeTitle" 
                       maxlength="25">
            </div>
            <div class="tagsWrapper">
                <div @click="selectEmoji(0)" :class="{addTagBtn: emojis[0] === '+' , emoji:emojis[0] !== '+'}">{{emojis[0]}}</div>
                <div @click="selectEmoji(1)" :class="{addTagBtn: emojis[1] === '+' , emoji:emojis[1] !== '+'}">{{emojis[1]}}</div>
                <div @click="selectEmoji(2)" :class="{addTagBtn: emojis[2] === '+' , emoji:emojis[2] !== '+'}">{{emojis[2]}}</div>
            </div>
              <!-- <textarea class="description" rows="10" placeholder="description" v-model="description"></textarea> -->
              <div class="startBtn" @click="startVibe">Start</div>
        </div>
    </div>
  </transition>
</template>

<script>
import { EventBus } from "../event-bus";
import socket from "../services/socket.js";
import location from "../services/location.js";
export default {
  name: "NewVibeForm",
  mounted() {},
  created() {
    EventBus.$on("openNewVibeForm", this.open);
  },
  data() {
    return {
      show: false,
      title: "",
      emojis: ["+", "+", "+"],
      titleWidth: null,
      titlePxSize: 65,
      titlePxSizeBase: 65
    };
  },
  methods: {
    onPaste() {
      console.log("pasted");
    },
    open() {
      this.show = true;
      if (!this.titleWidth) {
        this.$nextTick(function() {
          this.titleWidth = this.$refs.titleBg.clientWidth - 30;
        });
      }
    },
    close() {
      this.show = false;
    },
    bgClicked(e) {
      e.stopPropagation();
    },
    resizeTitle(e) {
      if (this.$refs.titleStroke.clientWidth - this.titleWidth > 10) {
        this.titlePxSize--;
        this.$refs.titleStroke.style.fontSize = this.titlePxSize + "px";
        this.$refs.titleInput.style.fontSize = this.titlePxSize + "px";
        this.$nextTick(this.resizeTitle);
      } else if (
        this.$refs.titleStroke.clientWidth - this.titleWidth < -10 &&
        this.titlePxSize < this.titlePxSizeBase
      ) {
        this.titlePxSize++;
        this.$refs.titleStroke.style.fontSize = this.titlePxSize + "px";
        this.$refs.titleInput.style.fontSize = this.titlePxSize + "px";
        this.$nextTick(this.resizeTitle);
      }
    },
    selectEmoji(emojiIdx) {
      var self = this;
      EventBus.$emit("openEmojiSelector", emoji => {
        self.emojis[emojiIdx] = emoji;
        self.emojis = self.emojis.slice();
      });
    },
    startVibe() {
      if (!this.$store.state.location) {
        console.log("location not ready");
        return;
      }

      //development
      var location = this.$store.state.location;

      // var location = {
      //   lat: this.$store.state.location.coords.latitude,
      //   lng: this.$store.state.location.coords.longitude
      // };

      var vibe = {
        title: this.title,
        emojis: this.emojis,
        location
      };

      var token = this.$store.getters.token;

      var inVibe = this.$store.state.inVibe;

      socket.newVibe({ vibe, token, inVibe });
      this.close();
    }
  },
  computed: {
    getEmoji(idx) {
      return this.emojis[idx] ? this.emojis[idx].char : "+";
    }
  }
};
</script>

<style scoped="true">
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #0000001f;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg {
  position: relative;
  width: 100%;
  max-width: 487px;
  height: 100%;
  max-height: min-content;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  min-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 30px;
}

.titleWRapper {
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.titleBg {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  margin: 20px;
  height: 65px;
  border-radius: 10px;
  background: #d5effd;
}

.titleStroke {
  position: absolute;
  border-radius: 10px;
  background: transparent;
  font-size: 65px;
  text-align: center;
  font-family: "Pacifico", cursive;
  color: white;
  border: none;
  outline: none;
  white-space: pre;
  top: auto;
  bottom: auto;
  -webkit-text-stroke-width: 5px;
  -webkit-text-stroke-color: #3fb7f5;
}

.title {
  position: absolute;
  border-radius: 10px;
  background: transparent;
  font-size: 65px;
  text-align: center;
  font-family: "Pacifico", cursive;
  color: white;
  border: none;
  outline: none;
  white-space: pre;
  top: auto;
  bottom: auto;
}

.title::placeholder {
  color: #d0d0d0;
}

.input {
  width: 100%;
}

.tagsWrapper {
  margin-top: 10px;
  width: 100%;
  height: 132px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.addTagBtn {
  width: 90px;
  height: 90px;
  min-width: 90px;
  border-radius: 102px;
  border: 5px solid #ababab;
  background: #d2d2d2;
  line-height: 80px;
  font-size: 60px;
  color: #bababa;
  font-family: cursive;
}

.emoji {
  font-size: 90px;
}

/* .description {
  width: 88%;
  height: 180px;
  resize: none;
  text-align: center;
  font-family: unset;
  font-size: 22px;
  border: none;
  background: hsla(196, 0%, 91%, 1);
  border-radius: 5px;
  outline: none;
  color: #62caff;
  padding: 10px;
} */

.description::placeholder {
  color: #d0d0d0;
}

.startBtn {
  width: 100%;
  background: #3fb7f5;
  max-width: 300px;
  height: 52px;
  margin-top: 20px;
  border-radius: 5px;
  font-size: 29px;
  line-height: 52px;
  color: white;
  box-shadow: 0 5px 1px 1px #0002;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>



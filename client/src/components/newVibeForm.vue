<template>
  <transition name="fade">
    <div class="overlay" @click="close" v-if="show">
      <div class="bg" @click="bgClicked">
        <div ref="title" class="title">
          <p>New Vibe</p>
          <div class="closeBtn" @click="close">X</div>
        </div>

        <div class="bottom">
          <div class="inputWrapper">
            <input
              class="title input"
              ref="titleInput"
              placeholder="What's your vibe?"
              v-model="title"
              maxlength="35"
              @keyup.enter="startVibe"
            >
            <font-awesome-icon class="smily" :icon="['far', 'smile']" @click="openEmojiSelector"></font-awesome-icon>
          </div>
          <hr>
          <div class="startBtn" @click="startVibe">Start</div>
        </div>
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
  created() {
    // EventBus.$on("openNewVibeForm", this.open);
  },
  data() {
    return {
      show: false,
      title: ""
    };
  },
  methods: {
    addEmoji(emoji) {
      debugger;
      var selectionStart = this.$refs.titleInput.selectionStart;
      var selectionEnd = this.$refs.titleInput.selectionEnd;
      this.title =
        this.title.slice(0, selectionStart) +
        emoji +
        this.title.slice(selectionEnd, this.$refs.titleInput.value.length);
    },
    openEmojiSelector() {
      EventBus.$emit("openEmojiSelector", this.addEmoji);
    },
    open() {
      this.show = true;
      this.$nextTick(function() {
        this.$refs.titleInput.focus();
      });
    },
    close() {
      this.$router.go(-1);
    },
    bgClicked(e) {
      e.stopPropagation();
    },
    startVibe() {
      this.$store.dispatch("startVibe", this.title);
      this.title = "";
      this.close();
    }
  },
  computed: {
    getEmoji(idx) {
      return this.emojis[idx] ? this.emojis[idx].char : "+";
    }
  },
  watch: {
    $route(to, from) {
      var q = this.$route.query;
      if (q.new) {
        this.open();
      } else {
        this.show = false;
      }
    }
  }
};
</script>

<style scoped="true">
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #0000008a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.bg {
  position: relative;
  background-color: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  min-width: 330px;
  max-width: 400px;
  border-radius: 3px;
  height: 198px;
  overflow: hidden;
}

.title {
  background: #8be0ff;
  width: 100%;
  height: 47px;
  font-family: "Fredoka One", cursive, sans-serif;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title > p {
  margin: 0;
  color: #fff;
  font-size: 24px;
}

.closeBtn {
  float: right;
  position: absolute;
  right: 0;
  background: #4acfff;
  width: 30px;
  height: 30px;
  border-radius: 30px;
  color: white;
  margin-right: 8px;
  line-height: 30px;
}

.bottom {
  width: 100%;
  background: transparent;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.inputWrapper {
  margin-left: 30px;
}

.inputWrapper > input {
  background: #fff;
  font-size: 20px;
  height: unset;
  margin-top: 10px;
  border: none;
  color: #646464;
  width: unset;
  display: inline-block;
}

.inputWrapper > input::placeholder {
  color: #b5b8b8;
}

.inputWrapper > input:focus {
  outline: none;
}

hr {
  background: #95e0e3;
  height: 3px;
  width: 223px;
  border: none;
  border-radius: 10px;
  margin: 0;
}

.startBtn {
  cursor: pointer;
  background: #46ceff;
  height: 40px;
  border-radius: 5px;
  color: white;
  box-shadow: 0 5px 1px 1px #0002;
  font-family: "Fredoka One", cursive;
  line-height: 40px;
  width: 100%;
  max-width: 150px;
  font-size: 20px;
  margin-top: 17px;
  border-bottom: #00b4f4 5px solid;
}

.smily {
  font-size: 30px;
  color: #b5b8b8;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>



<template>
  <transition name="fade">
      <div class="overlay" @click="close" v-if="show">
          <div class="bg" @click="bgClicked">
            <input class="search" type="text" v-model="query" placeholder="search" ref="search">
            <br>
            <div class="emoji" v-for="(emoji, idx) in filteredList" :key="idx" @click="pick(emoji.char)">
              {{emoji.char}}
            </div>
          </div>
      </div>
  </transition>
</template>

<script>
import { EventBus } from "../event-bus";
import emojisList from "emoji.json";

export default {
  name: "emojiSelector",
  data() {
    return {
      show: false,
      query: "",
      callback: null
    };
  },
  created() {
    EventBus.$on("openEmojiSelector", this.open);
  },
  methods: {
    pick(emoji) {
      this.callback(emoji);
      this.close();
    },
    close() {
      this.show = false;
    },
    open(callback) {
      this.callback = callback;
      this.show = true;
      this.$nextTick(function() {
        this.$refs.search.focus();
      });
    },
    bgClicked(e) {
      e.stopPropagation();
    }
  },
  computed: {
    filteredList() {
      if (!this.query) return emojisList.slice(0, 30);

      var q = this.query.split(" ");
      var flist = emojisList.filter(emoji => {
        for (var i = 0; i < q.length; i++) {
          if (emoji.keywords.indexOf(q[i]) === -1) {
            return false;
          }
        }
        return true;
      });
      return flist.slice(0, 30);
    }
  }
};
</script>

<style scoped="true">
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #0005;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg {
  width: 400px;
  height: 350px;
  background: white;
  border-radius: 7px;
  box-shadow: 0 5px 25px -5px #0005;
  padding: 15px 10px 10px 10px;
}

.search {
  border: 1px #797979 solid;
  border-radius: 5px;
  padding: 3px 10px;
  margin-bottom: 5px;
  outline: none;
}

.emoji {
  display: inline-block;
  font-size: 35px;
  line-height: 50px;
  width: 50px;
  height: 50px;
  padding: 5px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

@media (max-width: 510px) {
  .bg {
    padding: 15px 2px 2px 2px;
  }

  .emoji {
    padding: 2px;
  }
}
</style>



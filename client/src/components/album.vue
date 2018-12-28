<template>
  <transition name="fade">
    <div class="overlay" @click="close" v-if="show">
      <div class="bg" @click="bgClicked">
        <div class="top">
          <div class="coverOverlay"></div>
          <font-awesome-icon icon="book-open"></font-awesome-icon>
          <p>My Vibes Album</p>
          <div class="closeBtn" @click="close">X</div>
        </div>
        <div class="bottom">
          <div v-if="!vibes">
            <font-awesome-icon icon="spinner"></font-awesome-icon>
          </div>
          <div v-else>
            <album-list-item v-for="(vibe, idx) in vibesSliced" :key="idx" :title="vibe.title"></album-list-item>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import socket from "../services/socket.js";
import albumListItem from "./albumListItem";

export default {
  name: "album",
  components: { albumListItem },
  data() {
    return {
      show: false,
      vibesToShow: 5
    };
  },
  methods: {
    open() {
      this.show = true;
      if (this.vibes === null) {
        socket.getAlbum(this.$store.getters.token);
      }
    },
    close() {
      this.$router.go(-1);
    },
    bgClicked(e) {
      e.stopPropagation();
    }
  },
  computed: {
    vibes() {
      return this.$store.state.album;
    },
    vibesSliced() {
      if (this.vibes) return this.vibes.slice(-this.vibesToShow);
      return;
    }
  },
  watch: {
    $route(to, from) {
      var q = this.$route.query;
      if (q.album) {
        this.open();
      } else {
        this.show = false;
      }
    }
  }
};
</script>

<style scoped>
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #0000008a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  justify-content: start;
  align-items: flex-start;
}

.bg {
  width: 100%;
  max-width: 360px;
  min-height: 300px;

  background: white;
}

.top {
  height: 65px;
  width: 100%;
  background: url("/static/goodvibes.jpg");
  background-position-y: -173px;
  background-size: 282px;
  background-position-x: -35px;
  position: relative;
  display: flex;
  align-items: center;
  color: white;
}

.top > :nth-child(2) {
  position: relative;
  margin-left: 22px;
  font-size: 28px;
  margin-top: 2px;
}

.top > :nth-child(3) {
  position: relative;
  margin-left: 16px;
  margin-top: 18px;
  font-size: 18px;
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

.coverOverlay {
  width: 100%;
  height: 100%;
  position: absolute;
  background: #3d3d3dd4;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

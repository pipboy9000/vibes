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
          <font-awesome-icon v-if="!album" icon="spinner" class="spinner"></font-awesome-icon>
          <div v-else-if="album.length === 0">
            <p class="empty">Your album is empty</p>
          </div>
          <div v-else class="list">
            <album-list-item v-for="(vibe, idx) in albumSliced" :key="idx" :vibe="vibe"></album-list-item>
            <p v-if="album && vibesToShow < album.length" class="more" @click="showMore">More...</p>
          </div>
          <font-awesome-icon icon="sync-alt" class="reload" @click="reload"></font-awesome-icon>
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
      if (this.album === null) {
        socket.getAlbum(this.$store.getters.token);
      }
    },
    reload() {
      this.$store.commit("setAlbum", null);
      socket.getAlbum(this.$store.getters.token);
    },
    close() {
      this.$router.go(-1);
    },
    bgClicked(e) {
      e.stopPropagation();
    },
    showMore() {
      this.vibesToShow += 5;
    }
  },
  computed: {
    album() {
      // return [];
      return this.$store.state.album;
    },
    albumSliced() {
      if (this.album) return this.album.slice(-this.vibesToShow).reverse();
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
  width: 100%;
  max-width: 360px;
  min-height: 300px;
  background: black;
  border-radius: 5px;
  overflow: hidden;
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

.coverOverlay {
  width: 100%;
  height: 100%;
  position: absolute;
  background: #3d3d3dd4;
}

.top > :nth-child(2) {
  position: relative;
  margin-left: 22px;
  font-size: 25px;
  margin-top: 2px;
}

.top > :nth-child(3) {
  position: relative;
  margin-left: 16px;
  margin-top: 18px;
  font-size: 18px;
}

.reload {
  cursor: pointer;
  margin-right: 20px;
  margin-top: 10px;
  font-size: 25px;
  position: absolute;
  top: 0;
  right: 0;
}

.empty {
  font-family: "Fredoka One", cursive, sans-serif;
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

.bottom {
  background: white;
  position: relative;
  height: 75vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.list {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.more {
  font-family: "Fredoka One", cursive, sans-serif;
  color: #46ceff;
  cursor: pointer;
}

.spinner {
  position: absolute;
  font-size: 30px;
  margin-top: 60px;
  animation: rotate 2s infinite linear;
}

.list::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.list::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}
.list::-webkit-scrollbar-thumb {
  background: #ffffff;
  border: 0px none #ffffff;
  border-radius: 50px;
}

.list::-webkit-scrollbar-track {
  background: #0000;
  border: 0px none #ffffff;
}
.list::-webkit-scrollbar-corner {
  background: transparent;
}

.list::-webkit-scrollbar-thumb {
  background: #8be0ff;
}

@-webkit-keyframes rotate {
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes rotate {
  100% {
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

@media (max-width: 540px) {
  .bg {
    max-width: 100%;
    height: 100%;
  }

  .bottom {
    height: -webkit-fill-available;
  }
}
</style>

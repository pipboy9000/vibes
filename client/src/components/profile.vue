<template>
  <div ref="main" class="main">
    <div class="bg">
      <div class="top">
        <div class="coverOverlay"></div>
        <img :src="'https://graph.facebook.com/' + me.fbid + '/picture?type=large'">
        <h2>{{me.name}}</h2>
        <div type="checkbox" class="checkbox" @click="toggleVisibility">
          <div v-show="visible">
            <font-awesome-icon icon="check"></font-awesome-icon>
          </div>
        </div>
        <h2 @click="toggleVisibility">Visible</h2>
      </div>
      <div class="bottom">
        <div class="album" @click="openAlbum">
          <font-awesome-icon icon="book-open"></font-awesome-icon>
          <p>My Vibes Album</p>
        </div>
        <div class="logout">
          <font-awesome-icon icon="power-off"></font-awesome-icon>
          <p>Logout</p>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="overlay" :class="{overlayClosed: !isOpen}"></div>
      <div class="btn" :class="{closeBtnOpen: isOpen}">
        <div v-if="isOpen" class="closeBtn" @click="close">X</div>
        <div v-else class="openBtn" @click="open">
          <font-awesome-icon icon="user-alt"></font-awesome-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import socket from "../services/socket.js";
export default {
  name: "profile",
  data() {
    return {
      isOpen: false,
      width: null
    };
  },
  mounted() {
    this.width = window.innerWidth;
    this.width = Math.min(this.width, 465);
    this.$refs.main.style.transform = "translateX(" + -this.width + "px)";
  },
  methods: {
    close() {
      this.$router.go(-1);
    },
    open() {
      var q = this.$route.query;
      if (!q.profile) {
        this.$router.push({ query: { ...q, profile: true } });
      }
    },
    toggleVisibility() {
      socket.setVisible({
        token: this.$store.getters.token,
        visible: !this.visible
      });
    },
    openAlbum() {
      this.$router.replace({ query: { album: true } });
    }
  },
  computed: {
    me() {
      return this.$store.getters.me;
    },
    visible() {
      return this.$store.state.visible;
    }
  },
  watch: {
    $route(to, from) {
      if (to.query.profile) {
        this.isOpen = true;
        this.$refs.main.style.transform = "translateX(0px)";
      } else {
        this.isOpen = false;
        this.$refs.main.style.transform = "translateX(" + -this.width + "px)";
      }
    }
  }
};
</script>

<style scoped="true">
.main {
  pointer-events: none;
  width: 100%;
  height: 100%;
  transform: translateX(-1000px);
  transition: transform 0.25s;
  will-change: transform;
  /* overflow: hidden; */
}

.overlay {
  pointer-events: all;
  width: 100vw;
  height: 100%;
  background: #0008;
  position: absolute;
  opacity: 1;
  transition: opacity 0.25s;
}

.overlayClosed {
  opacity: 0;
  pointer-events: none;
}

.btn {
  pointer-events: all;
  cursor: pointer;
  border-radius: 50px;
  width: 54px;
  height: 54px;
  background: #00000040;
  color: white;
  font-family: "Fredoka One", cursive;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  align-items: center;
  position: absolute;
  transition: transform 0.25s;
  will-change: transform;
}

.openBtn,
.closeBtn {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.closeBtnOpen {
  transform: translateX(-75px);
}
.right {
  position: relative;
  width: fit-content;
  height: 100vh;
  float: left;
}

.bg {
  pointer-events: all;
  width: 100%;
  height: 100%;
  background: white;
  box-shadow: -5px 0px 35px #000000a3;
  max-width: 465px;
  position: relative;
  float: left;
}

.top {
  background: url("/static/goodvibes.jpg");
  height: 108px;
  width: 100%;
  background-size: 285px;
  background-position-y: -105px;
  user-select: none;
}

.coverOverlay {
  width: 100%;
  height: 108px;
  position: absolute;
  background: #3d3d3dd4;
}

.top > img {
  border-radius: 100px;
  left: 16px;
  top: 21px;
  position: absolute;
  width: 56px;
  height: 56px;
  border: 2px solid white;
}

.top > :nth-child(3) {
  margin: 0;
  position: absolute;
  color: white;
  top: 29px;
  left: 91px;
  font-size: 19px;
}

.top > :nth-child(5) {
  cursor: pointer;
  margin: 0;
  position: absolute;
  color: white;
  top: 57px;
  left: 117px;
  font-size: 15px;
  font-weight: 300;
  padding-top: 2px;
  user-select: none;
}

.checkbox {
  cursor: pointer;
  position: absolute;
  border: 1.5px solid white;
  width: 13px;
  height: 13px;
  border-radius: 5px;
  top: 57px;
  left: 92px;
  color: white;
  display: inline-block;
  padding: 1px;
  font-size: 12px;
}

.bottom {
  color: #535353;
  width: 100%;
  user-select: none;
}

.album {
  cursor: pointer;
  width: 100%;
  background: white;
  height: 68px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: start;
}

.album > :nth-child(1) {
  font-size: 20px;
  margin-left: 18px;
  padding: 10px;
}

.album > :nth-child(2) {
  margin: 0;
  margin-left: 10px;
  font-size: 14px;
}

.logout {
  cursor: pointer;
  width: 100%;
  background: white;
  height: 68px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: start;
}

.logout > :nth-child(1) {
  font-size: 22px;
  margin-left: 18px;
  padding: 10px;
}

.logout > :nth-child(2) {
  margin: 0;
  margin-left: 13px;
  font-size: 14px;
}
</style>

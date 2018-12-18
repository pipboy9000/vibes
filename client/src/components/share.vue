<template>
  <transition name="fade">
    <div class="overlay" v-if="show" @click="close">
      <div class="bg" @click="bgClicked">
        <qrcode-vue class="qrcode" :value="link" :size="230" level="H"></qrcode-vue>
        <input ref="link" class="link" :v-model="link" :value="link" @click="copyLink">
        <div class="copyLink" @click="copyLink">
          <i class="far fa-copy"></i>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import QrcodeVue from "qrcode.vue";

export default {
  name: "share",
  props: ["link"],
  data() {
    return {
      show: false
    };
  },
  components: {
    QrcodeVue
  },
  methods: {
    copyLink() {
      this.$refs.link.select();
      document.execCommand("copy");
    },
    close() {
      this.$router.go(-1);
    },
    bgClicked(e) {
      e.stopPropagation();
    }
  },
  watch: {
    $route(to) {
      if (to.query.share) {
        this.show = true;
      } else {
        this.show = false;
      }
    }
  }
};
</script>

<style scoped>
.overlay {
  width: 100%;
  height: 100%;
  background: #000000cc;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg {
  width: 100%;
  height: 100%;
  max-width: 300px;
  max-height: 400px;
  border-radius: 5px;
  background: #0008;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #46ceff;
  font-family: "Fredoka One";
  position: absolute;
  pointer-events: all;
}

input {
  margin-top: 10px;
  width: 200px;
  border: 2px solid #46ceff;
  border-radius: 13px;
  background: transparent;
  padding: 14px;
  height: 20px;
  color: #25b2e5;
  font-family: "Fredoka One";
  font-size: 19px;
  outline: none;
}

.copyLink {
  margin-top: 15px;
  font-size: 30px;
}

.qrcode {
  overflow: hidden;
  border: 6px solid white;
  border-radius: 5px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

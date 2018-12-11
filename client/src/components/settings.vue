<template>
    <div class="main" :class="{open: isOpen, closed: !isOpen}">
        <div class="bg"></div>
        <div class="overlay" :class="{overlayClosed: !isOpen}"></div>
        <div v-if="isOpen" class="closeBtn" @click="close">X</div>
        <div v-else class="openBtn" @click="open">
            <font-awesome-icon icon="user-alt"></font-awesome-icon> 
        </div>
    </div>
</template>

<script>
export default {
  name: "settings",
  data() {
    return {
      isOpen: false
    };
  },
  methods: {
    close() {
      this.isOpen = false;
    },
    open() {
      this.isOpen = true;
    }
  }
};
</script>

<style scoped="true">
.open {
  transform: translateX(0px);
}

.closed {
  transform: translateX(-288px);
}

.main {
  width: 100%;
  height: 100%;
  max-width: 360px;
  transition: transform 0.25s;
  will-change: transform;
}

.overlay {
  pointer-events: none;
  width: 200%;
  height: 100%;
  background: #0008;
  position: absolute;
  transform: translateX(288px);
  opacity: 1;
  transition: opacity 0.25s;
}

.overlayClosed {
  opacity: 0;
}

.openBtn,
.closeBtn {
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
  margin-right: 7px;
  margin-top: 9px;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
}

.bg {
  width: 100%;
  height: 100%;
  background: white;
  box-shadow: -10px 0px 35px #000000a3;
  max-width: 288px;
  position: absolute;
}
</style>

<template>
  <div class="wrapper">
    <div class="sideBtns">
      <div class="focusBtn" @click="focus">
        <img src="../assets/focus_icon.png">
      </div>
      <div class="zoom">
        <div class="zoomIn" @click="zoomIn">+</div>
        <hr>
        <div class="zoomOut" @click="zoomOut">-</div>
      </div>
    </div>
    <div class="newVibeBtn" @click="openNewVibeForm">+</div>
  </div>
</template>

<script>
import { EventBus } from "../event-bus";
export default {
  name: "MapUI",
  methods: {
    zoomIn() {
      EventBus.$emit("zoomIn");
    },
    zoomOut() {
      EventBus.$emit("zoomOut");
    },
    focus() {
      EventBus.$emit("focus");
    },
    openNewVibeForm() {
      EventBus.$emit("openNewVibeForm");
    }
  }
};
</script>

<style scoped="true">
.wrapper {
}

.sideBtns {
  width: min-content;
  height: min-content;
  position: absolute;
  right: 0;
  bottom: 0;
  margin: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  user-select: none;
}

.focusBtn {
  width: 50px;
  height: 50px;
  background: #22dbe3;
  border: 4px solid white;
  border-radius: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 5px 3px -2px #0004;
}

.focusBtn > img {
  width: 28px;
  height: 28px;
}

hr {
  margin: 0;
}

.zoom {
  width: 50px;
  height: 100px;
  margin-top: 5px;
  background: #22dbe3;
  border: 4px solid white;
  border-radius: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  line-height: 48px;
  font-size: 39px;
  font-family: cursive;
  color: white;
  box-shadow: 0px 5px 3px -2px #0004;
}

.newVibeBtn {
  user-select: none;
  position: absolute;
  width: 80px;
  height: 80px;
  background-color: #22dbe3;
  border: 5px solid white;
  left: 50%;
  -webkit-transform: translateX (-50%);
  transform: translateX(-50%);
  bottom: 50px;
  border-radius: 80px;
  font-family: cursive;
  font-size: 70px;
  line-height: 70px;
  color: white;
  box-shadow: 0px 8px 10px -1px #0004;
}

@media (max-width: 316px) {
  .newVibeBtn {
    left: 20px;
    bottom: 30px;
    -webkit-transform: translateX (0);
    transform: translateX(0);
  }
}
</style>

<template>
  <div class="wrapper">
    <div class="gradient"></div>
    <list></list>
    <div class="newVibeBtn" @click="openNewVibeForm">New Vibe</div>
    <div class="sideBtns">
      <div class="zoom">
        <div class="zoomIn" @click="zoomIn">
          <i class="fas fa-plus"></i>
        </div>
        <hr>
        <div class="zoomOut" @click="zoomOut">
          <i class="fas fa-minus"></i>
        </div>
      </div>
      <div class="focusBtn" @click="focus">
        <i class="fas fa-crosshairs"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from "../event-bus";
import list from "./list";

export default {
  name: "MapUI",
  components: { list },
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
      var q = this.$route.query;
      this.$router.push({ query: { ...q, new: true } });
      // EventBus.$emit("openNewVibeForm");
    }
  }
};
</script>

<style scoped="true">
.gradient {
  pointer-events: none;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(0deg, #0000003d, transparent);
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.plusIcon {
  margin-top: 6px;
}

.newVibeBtn {
  cursor: pointer;
  user-select: none;
  position: absolute;
  width: 90%;
  max-width: 318px;
  height: 46px;
  background-color: #46ceff;
  left: 50%;
  -webkit-transform: translateX (-50%);
  transform: translateX(-50%);
  bottom: 24px;
  border-radius: 5px;
  font-family: "Fredoka One", cursive;
  font-size: 23px;
  line-height: 70px;
  color: white;
  -webkit-box-shadow: 0px 0px 0px 6px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px 0px 0px 6px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 0px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 5px solid #21b5ec;
}

.sideBtns {
  cursor: pointer;
  width: min-content;
  height: min-content;
  position: absolute;
  right: 13px;
  bottom: 243px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  user-select: none;
  font-size: 25px;
  color: rgb(139, 224, 255);
}

.focusBtn {
  width: 52px;
  height: 52px;
  border-radius: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-box-shadow: 0px 0px 0px 5px rgba(0, 0, 0, 0.05);
  -moz-box-shadow: 0px 0px 0px 5px rgba(0, 0, 0, 0.05);
  box-shadow: 0px 0px 0px 5px rgba(0, 0, 0, 0.05);
  background: #fff;
}

hr {
  border: 0;
  margin: 0;
  width: 100%;
  height: 4px;
  background-color: #e8e8e8;
}

.zoom {
  margin-bottom: 12px;
  width: 52px;
  height: 90px;
  border-radius: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  line-height: 48px;
  font-family: cursive;
  -webkit-box-shadow: 0px 0px 0px 5px rgba(0, 0, 0, 0.05);
  -moz-box-shadow: 0px 0px 0px 5px rgba(0, 0, 0, 0.05);
  box-shadow: 0px 0px 0px 5px rgba(0, 0, 0, 0.05);
  background: #fff;
  font-size: 20px;
}

.zoomIn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50%;
}

.zoomOut {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50%;
}
</style>

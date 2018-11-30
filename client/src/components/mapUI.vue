<template>
  <div class="wrapper">
    <div class="gradient"></div>
    <list></list>
    <div class="newVibeBtn" @click="openNewVibeForm">
      New Vibe
    </div>
    <div class="sideBtns">
      <div class="zoom">
        <div class="zoomIn" @click="zoomIn">
          <plus-icon class="plusIcon" :size="19" :thickness="7" :radius="2" :color="'#8be0ff'"></plus-icon>
        </div>
        <hr>
        <div class="zoomOut" @click="zoomOut">
          <minus-icon :size="19" :thickness="7" :radius="2" :color="'#8be0ff'"></minus-icon>
        </div>
      </div>
      <div class="focusBtn" @click="focus">
        <i class="fas fa-crosshairs" style="font-size: 35px; color: rgb(139, 224, 255);"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from "../event-bus";
import plusIcon from "./plusIcon";
import minusIcon from "./minusIcon";
import list from "./list";

export default {
  name: "MapUI",
  components: { plusIcon, minusIcon, list },
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
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(0deg, #0000003d, transparent);
}

.plusIcon {
  margin-top: 6px;
}

.newVibeBtn {
  cursor: pointer;
  user-select: none;
  position: absolute;
  width: 90%;
  max-width: 410px;
  height: 60px;
  background-color: #8be0ff;
  left: 50%;
  -webkit-transform: translateX (-50%);
  transform: translateX(-50%);
  bottom: 31px;
  border-radius: 10px;
  font-family: "Fredoka One", cursive;
  font-size: 29px;
  line-height: 70px;
  color: white;
  -webkit-box-shadow: 0px 0px 0px 6px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px 0px 0px 6px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 0px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sideBtns {
  cursor: pointer;
  width: min-content;
  height: min-content;
  position: absolute;
  right: 16px;
  bottom: 314px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  user-select: none;
}

.focusBtn {
  width: 66px;
  height: 66px;
  border-radius: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-box-shadow: 0px 0px 0px 5px rgba(0, 0, 0, 0.05);
  -moz-box-shadow: 0px 0px 0px 5px rgba(0, 0, 0, 0.05);
  box-shadow: 0px 0px 0px 5px rgba(0, 0, 0, 0.05);
  background: #fff;
}

.focusBtn > img {
  width: 28px;
  height: 28px;
}

hr {
  border: 0;
  margin: 0;
  width: 100%;
  height: 4px;
  background-color: #e8e8e8;
}

.zoom {
  margin-bottom: 16px;
  width: 66px;
  height: 118px;
  border-radius: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  line-height: 48px;
  font-size: 39px;
  font-family: cursive;
  color: white;
  -webkit-box-shadow: 0px 0px 0px 5px rgba(0, 0, 0, 0.05);
  -moz-box-shadow: 0px 0px 0px 5px rgba(0, 0, 0, 0.05);
  box-shadow: 0px 0px 0px 5px rgba(0, 0, 0, 0.05);
  background: #fff;
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

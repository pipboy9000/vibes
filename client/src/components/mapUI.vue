<template>
  <div class="wrapper">
    <div class="sideBtns">
      <div class="focusBtn" @click="focus">
        <img src="../assets/focus_icon.png">
      </div>
      <div class="zoom">
        <div class="zoomIn" @click="zoomIn">
          <plus-icon :size="15" :thickness="5" :color="'white'"></plus-icon>
        </div>
        <hr>
        <div class="zoomOut" @click="zoomOut">
          <minus-icon :size="15" :thickness="5" :color="'white'"></minus-icon>
        </div>
      </div>
    </div>
    <div class="newVibeBtn" @click="openNewVibeForm">
      <plus-icon :size="25" :thickness="8" :color="'white'"></plus-icon>
    </div>
  </div>
</template>

<script>
import { EventBus } from "../event-bus";
import plusIcon from "./plusIcon";
import minusIcon from "./minusIcon";

export default {
  name: "MapUI",
  components: { plusIcon, minusIcon },
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
.sideBtns {
  cursor: pointer;
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
  background: #5dc8ff;
  border: 3px solid white;
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
  background: #5dc8ff;
  border: 3px solid white;
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

.newVibeBtn {
  cursor: pointer;
  user-select: none;
  position: absolute;
  width: 80px;
  height: 80px;
  background-color: #5dc8ff;
  border: 3px solid white;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 620px) {
  .sideBtns {
    margin: 15px;
  }

  .newVibeBtn {
    bottom: 35px;
  }
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

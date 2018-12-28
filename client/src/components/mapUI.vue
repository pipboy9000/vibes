<template>
  <div class="wrapper">
    <div class="gradient"></div>
    <list></list>
    <div v-if="!inVibe || inVibe === ''" class="newVibeBtn" @click="openNewVibeForm">New Vibe</div>
    <div v-else class="newVibeBtn inVibe" @click="clickedInVibe">
      <font-awesome-icon icon="map-marker-alt"></font-awesome-icon>
      <p>: {{inVibe.title}}</p>
    </div>
    <div class="sideBtns">
      <div class="zoom">
        <div class="zoomIn" @click="zoomIn">
          <font-awesome-icon icon="plus"></font-awesome-icon>
        </div>
        <hr>
        <div class="zoomOut" @click="zoomOut">
          <font-awesome-icon icon="minus"></font-awesome-icon>
        </div>
      </div>
      <div class="focusBtn" @click="focus">
        <font-awesome-icon icon="crosshairs"></font-awesome-icon>
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
    },
    clickedInVibe() {
      if (this.openVibe) {
        this.$store.commit("setSelectedVibe", this.inVibe);
        this.$router.replace({ path: "", query: { v: this.inVibe.id } });
      } else {
        if (!this.selectedVibe || this.selectedVibe.id != this.inVibe.id) {
          this.$store.commit("setSelectedVibe", this.inVibe);
        } else {
          if (this.$router.currentRoute.query.v) {
            this.$router.replace({ path: "", query: { v: this.inVibe.id } });
          } else {
            this.$router.push({ path: "", query: { v: this.inVibe.id } });
          }
          EventBus.$emit("listItemClicked", this.inVibe);
        }
      }
    }
  },
  computed: {
    inVibe() {
      var inVibeId = this.$store.state.inVibe;
      return this.$store.getters.getVibeById(inVibeId);
    },
    selectedVibe() {
      return this.$store.state.selectedVibe;
    },
    openVibe() {
      return this.$store.state.openVibe;
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

.inVibe > svg {
  margin-right: 5px;
  margin-left: 15px;
}

.inVibe > p {
  overflow: hidden;
  white-space: nowrap;
  padding-right: 10px;
  text-overflow: ellipsis;
}
</style>

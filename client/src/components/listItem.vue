<template>
  <div ref="bg" class="bg" :class="{selected:isSelected}" @click="clicked">
    <div class="top">
      <div class="left">
        <img :src="'https://graph.facebook.com/' + vibe.createdBy.fbid + '/picture?type=large'">
      </div>
      <div class="right">
        <div class="title">{{ vibe.title }}</div>
      </div>
    </div>
    <div class="bottom">
      <p>Created by {{ vibe.createdBy.name }}</p>
      <p>{{ time }}</p>
      <div class="icons">
        <i class="fas fa-map-marker-alt"></i>
        <p>{{ this.distance }}</p>
        <i class="fas fa-user-circle"></i>
        <p>{{ vibe.users.length }}</p>
        <i class="fas fa-camera"></i>
        <p>{{ vibe.pictures.length }}</p>
      </div>
    </div>
  </div>
</template>


<script>
import { timeAgo } from "../services/timeAgo.js";
import { EventBus } from "../event-bus";
import { getDistance, formatDistance } from "../services/maps.js";

export default {
  props: ["vibe"],
  computed: {
    time() {
      return timeAgo.format(this.vibe.createdAt);
    },
    distance() {
      if (this.vibe.distance || this.vibe.distance === 0) {
        return formatDistance(this.vibe.distance);
      }
    },
    selectedVibe() {
      return this.$store.state.selectedVibe;
    },
    openVibe() {
      return this.$store.state.openVibe;
    },
    isSelected() {
      if (!this.selectedVibe) return false;
      return this.selectedVibe.id === this.vibe.id;
    }
  },
  methods: {
    clicked() {
      if (this.openVibe) {
        this.$store.commit("setSelectedVibe", this.vibe);
        this.$router.replace({ path: "", query: { v: this.vibe.id } });
      } else {
        if (!this.isSelected) {
          this.$store.commit("setSelectedVibe", this.vibe);
        } else {
          if (this.$router.currentRoute.query.v) {
            this.$router.replace({ path: "", query: { v: this.vibe.id } });
          } else {
            this.$router.push({ path: "", query: { v: this.vibe.id } });
          }
          EventBus.$emit("listItemClicked", this.vibe);
        }
      }
    }
  }
};
</script>

<style scoped="true">
.bg {
  cursor: pointer;
  width: 226px;
  height: 132px;
  background-color: white;
  display: inline-block;
  margin-left: 4px;
  margin-right: 4px;
  border-radius: 8px;
  position: relative;
  box-shadow: 0px 5px 25px -12px;
  text-overflow: ellipsis;
  overflow-x: hidden;
  box-sizing: border-box;
  transition: border;
  transition-duration: 100ms;
}

.selected {
  border: 3px solid #46ceff;
}

.top {
  height: 46%;
  width: 100%;
  float: left;
}

.bottom {
  width: 100%;
  height: 54%;
  float: left;
}

.left,
.right {
  height: 100%;
  float: left;
}

.left {
  width: 28%;
}

.right {
  width: 72%;
  display: flex;
  align-items: center;
}

.left > img {
  float: left;
  width: 46px;
  margin-left: 9px;
  margin-top: 10px;
  border-radius: 61px;
}

.title {
  max-width: 100%;
  text-align: left;
  font-size: 19px;
  white-space: pre-wrap;
  line-height: 19px;
  margin-left: 1px;
  padding-right: 8px;
  padding-top: 8px;
  font-family: "Fredoka One", cursive;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.bottom > p:nth-child(1) {
  font-family: "Roboto", sans-serif;
  text-align: left;
  margin: 0;
  margin-left: 10px;
  font-size: 15px;
  margin-top: 8px;
  letter-spacing: -0.2px;
}

.bottom > p:nth-child(2) {
  font-family: "Roboto", sans-serif;
  text-align: left;
  margin: 0;
  margin-left: 13px;
  font-size: 12px;
  margin-top: 2px;
}

.icons {
  text-align: left;
  margin: 0;
  margin-left: 13px;
  margin-top: 5px;
  font-size: 15px;
  color: #9f9f9f;
  display: flex;
  align-items: center;
  align-content: center;
  font-family: "Roboto", sans-serif;
}

.icons > p {
  margin: 0;
  font-size: 14px;
  margin-left: 5px;
}

.icons > svg {
  /* icons */
  margin: 0;
  font-size: 16px;
}

.icons > svg:nth-child(3) {
  margin-left: 20px;
}

.icons > svg:nth-child(5) {
  margin-left: 24px;
}
</style>

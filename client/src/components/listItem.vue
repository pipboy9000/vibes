<template>
    <div class="bg" @click="clicked">
      <div class="top">
        <div class="left">
          <img :src="'https://graph.facebook.com/' + vibe.createdBy.fbid + '/picture?type=square'">
        </div>
        <!-- var list=document.getElementsByClassName("list")[0]; list.scrollTo(list.scrollWidth-982,0); -->
        <div class="right">
          <div class="title">{{ vibe.title }}</div>
        </div>
      </div>
      <div class="bottom">
        <p>Created by {{ vibe.createdBy.name }}</p>
        <p>{{ time }}</p>
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
    }
  },
  methods: {
    clicked() {
      {
        //we only replace because we assume url already has list=true
        this.$router.replace({ path: "", query: { v: this.vibe.id } });
        EventBus.$emit("listItemClicked", this.vibe);
      }
    }
  }
};
</script>

<style scoped="true">
.bg {
  cursor: pointer;
  width: 292px;
  height: 170px;
  background-color: white;
  display: inline-block;
  margin-left: 5px;
  margin-right: 5px;
  border-radius: 6px;
  position: relative;
}

.top {
  height: 50%;
  width: 100%;
  float: left;
}

.bottom {
  width: 100%;
  height: 50%;
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
  width: 58px;
  margin-left: 12px;
  margin-top: 14px;
  border-radius: 61px;
}

.title {
  max-width: 100%;
  text-align: left;
  font-family: "Black Han Sans", sans-serif;
  font-size: 22px;
  white-space: pre-wrap;
  line-height: 32px;
  margin-top: 5px;
  margin-left: 1px;
}

.bottom > p:nth-child(1) {
  font-family: "Roboto", sans-serif;
  text-align: left;
  margin: 0;
  margin-left: 17px;
  font-size: 19px;
  margin-top: 2px;
}

.bottom > p:nth-child(2) {
  font-family: "Roboto", sans-serif;
  text-align: left;
  margin: 0;
  margin-left: 19px;
  font-size: 13px;
  margin-top: 3px;
}
</style>

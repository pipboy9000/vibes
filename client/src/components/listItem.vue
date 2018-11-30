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
    </div>
</template>


<script>
import { timeAgo } from "../services/timeAgo";
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
  position: absolute;
}

.left,
.right {
  height: 100%;
  float: left;
}

.left {
  width: 29%;
}

.right {
  width: 71%;
}

.left > img {
  float: left;
  width: 58px;
  margin-left: 12px;
  margin-top: 14px;
  border-radius: 61px;
}
</style>

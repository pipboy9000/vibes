<template>
  <div class="item">
    <img :src="'https://graph.facebook.com/' + vibe.createdBy.fbid + '/picture?type=large'">
    <div class="details">
      <div class="title">{{vibe.title}}</div>
      <div class="time">{{time}}</div>
    </div>
  </div>
</template>

<script>
import { timeAgo } from "../services/timeAgo.js";

export default {
  name: "albumListItem",
  props: ["vibe"],
  computed: {
    time() {
      return timeAgo.format(this.vibe.createdAt);
    }
  }
};
</script>

<style scoped>
.item {
  width: 100%;
  height: 80px;
}

img {
  border-radius: 50%;
  width: 60px;
  float: left;
}

.details {
}

.title {
}

.time {
}
</style>

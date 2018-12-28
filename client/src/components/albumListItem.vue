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
  height: 70px;
  display: flex;
  align-items: center;
}

img {
  border-radius: 50%;
  width: 40px;
  float: left;
  margin-left: 20px;
}

.details {
  margin-left: 15px;
}

.title {
  text-align: left;
  font-family: "Fredoka One", sans-serif;
}

.time {
  font-size: 12px;
  text-align: left;
  font-family: "Roboto", sans-serif;
}
</style>

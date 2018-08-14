<template>
    <div class="wrapper">
        <img class="profilePic" :src="profilePicSrc">
        <div class="details">
            <div class="title">{{comment.name}} - {{time}}</div>
            <div class="text">{{comment.text}}</div>
        </div>
    </div>
</template>

<script>
import { timeAgo } from "../services/timeAgo.js";
export default {
  props: ["comment"],
  computed: {
    profilePicSrc() {
      var src =
        "https://graph.facebook.com/" +
        this.comment.uid +
        "/picture?type=square&width=70&height=70";
      return src;
    },
    time() {
      return timeAgo.format(this.comment.createdAt);
    }
  }
};
</script>

<style scoped="true">
.wrapper {
  position: relative;
  width: 100%;
  height: fit-content;
}

.profilePic {
  width: 70px;
  height: 70px;
}
</style>

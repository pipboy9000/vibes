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
  margin-top: 30px;
  text-align: left;
  display: flex;
  position: relative;
  width: 100%;
  height: fit-content;
}

.profilePic {
  border-radius: 100px;
  margin-left: 15px;
  width: 40px;
  height: 40px;
}

.details {
  margin-left: 15px;
  font-family: "ABeeZee", sans-serif;
}

.title {
  color: #838383;
  font-style: italic;
}

.text {
  margin-left: 10px;
  margin-top: 5px;
  color: #5a5959;
}
</style>

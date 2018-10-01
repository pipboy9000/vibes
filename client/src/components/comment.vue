<template>
    <div class="wrapper">
        <div class="comment">
            <img class="profilePic" :src="profilePicSrc">
            <div class="details">
                <div class="title">{{comment.name}} - {{time}}</div>
                <div class="text">{{comment.text}}</div>
            </div>
        </div>
        <hr>
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
        this.comment.fbid +
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
  position: relative;
  width: 100%;
  height: fit-content;
}
.comment {
  display: flex;
}

.profilePic {
  border-radius: 100px;
  margin-left: 15px;
  width: 40px;
  min-width: 40px;
  height: 40px;
  min-height: 40px;
}

.details {
  margin-top: 8px;
  margin-left: 15px;
  font-family: "ABeeZee", sans-serif;
}

.title {
  font-size: 13px;
  color: #949494;
  font-style: italic;
}

.text {
  font-size: 16px;
  margin-left: 10px;
  margin-top: 5px;
  color: #5a5959;
}

hr {
  border: 0;
  height: 1px;
  background-image: linear-gradient(to right, #e4e4e410, #e4e4e4, #e4e4e410);
  width: 80%;
}
</style>

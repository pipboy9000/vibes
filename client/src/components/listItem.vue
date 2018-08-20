<template>
    <div class="bg" @click="clicked">
        <div class="left">
            <div class="title"> {{vibe.title}} </div>
            <div class="details">
                <div class="users">
                    <img src="../assets/users_icon.png">
                    <p>{{vibe.users.length}}    {{time}}
                      {{distance}}
                    </p>
                </div>
                <div class="time"></div>
            </div>
        </div>
        <div class="right">
            <div class="emojis">
                <div class="emoji">{{vibe.emojis[0]}}</div>
                <div class="emoji">{{vibe.emojis[1]}}</div>
                <div class="emoji">{{vibe.emojis[2]}}</div>
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
      if (this.vibe.distance) {
        return formatDistance(this.vibe.distance);
      }
    }
  },
  methods: {
    clicked() {
      {
        this.$store.commit("setSelectedVibe", this.vibe);
        EventBus.$emit("listItemClicked", this.vibe);
      }
    }
  }
};
</script>

<style scoped="true">
.bg {
  width: 530px;
  height: 80px;
  margin-bottom: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px 1px #00000025;
}

.left {
  width: 336px;
  height: 80px;
  float: left;
}

.right {
  width: 194px;
  height: 80px;
  float: left;
}

.title {
  width: 100%;
  height: 62px;
  text-align: left;
  transform: translateY(-2px);
  color: #8fd9ff;
  font-size: 28px;
  margin-left: 10px;
  font-family: "Pacifico", cursive;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.users {
  float: left;
  transform: translateY(-8px);
  display: flex;
  align-items: center;
  margin-left: 12px;
  font-family: "ABeeZee", sans-serif;
  color: #b3b3b3;
  font-size: 12px;
  opacity: 0.8;
}

.users > p {
  margin: 0;
  display: inline-block;
  margin-left: 4px;
  font-size: 11px;
  white-space: pre-wrap;
}

.emojis {
  font-family: "Segoe UI Emoji";
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-size: 36px;
  height: 90%;
  opacity: 0.9;
}

.details {
  font-style: italic;
}
</style>

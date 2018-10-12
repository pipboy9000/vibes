<template>
    <div class="bg" @click="clicked">
        <div class="left">
            <div class="title"> {{vibe.title}} </div>
            <div class="details">
                <div class="users">
                    <img src="../assets/users_icon.png">
                    <p>{{vibe.users.length}} - {{time}} - {{distance}}
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
      if (this.vibe.distance || this.vibe.distance === 0) {
        return formatDistance(this.vibe.distance);
      }
    }
  },
  methods: {
    clicked() {
      {
        // this.$store.commit("setSelectedVibe", this.vibe);
        var vibeId = this.$route.query.v;
        if (vibeId) {
          this.$router.replace({ path: "", query: { v: vibeId } });
          EventBus.$emit("vibeMarkerClicked", this.vibe);
        } else {
          vibeId = this.vibe.id;
          this.$router.push({ path: "", query: { v: vibeId } });
        }
        EventBus.$emit("listItemClicked", this.vibe);
      }
    }
  }
};
</script>

<style scoped="true">
.bg {
  cursor: pointer;
  width: 520px;
  height: 80px;
  margin-bottom: 10px;
  padding-right: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px 1px #00000025;
}

.left {
  /* width: 336px; */
  height: 80px;
  float: left;
  max-width: 70%;
  box-sizing: border-box;
}

.right {
  box-sizing: border-box;
  padding-right: 10px;
  max-width: 30%;
  height: 80px;
  float: right;
}

.title {
  width: 98%;
  height: 62px;
  text-align: left;
  transform: translateY(-2px);
  color: #8fd9ff;
  font-size: 28px;
  margin-left: 10px;
  font-family: "Pacifico", cursive, sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.title::first-letter {
  text-transform: capitalize;
}

.users {
  float: left;
  transform: translateY(-8px);
  display: flex;
  align-items: center;
  margin-left: 12px;
  font-family: "ABeeZee", sans-serif;
  color: #8d8d8d;
  font-size: 12px;
  opacity: 0.9;
}

.users > p {
  margin: 0;
  display: inline-block;
  margin-left: 8px;
  font-size: 13px;
  min-width: 200px;
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
  text-align: left;
}

@media (max-width: 650px) {
  .bg {
    width: 100%;
    height: 80px;
    margin: 0;
    border-radius: 0;
  }
  .left {
    max-width: 65%;
  }

  .title {
    font-size: 25px;
    margin-left: 15px;
  }

  .right {
    max-width: 35%;
  }

  .users {
    margin-left: 20px;
  }

  .users > p {
    font-size: 12px;
  }

  .emojis {
    width: 100%;
    font-size: 32px;
  }

  .emoji {
    min-width: max-content;
    width: 33.33333%;
  }
}

@media (max-width: 480px) {
  .bg {
    padding-right: 5px;
  }

  .emoji {
    font-size: 23px;
  }

  .right {
    margin-top: 10px;
    height: 48px;
  }

  .left {
    height: 50px;
  }
}
</style>

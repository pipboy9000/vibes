<template>
    <div v-if="hasVibes" class="wrapper" :class="{open: isOpen, closed: !isOpen}">
      <div class="list">
        <listItem v-for="(vibe, key) in $store.state.vibes" :key="key" :vibe="vibe"></listItem>
      </div>
      <div v-if="isOpen" class="closeBtn" @click="close">X</div>
      <div v-else class="openBtn" @click="open">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
</template>

<script>
import store from "../store";
import listItem from "./listItem";
import { EventBus } from "../event-bus";

export default {
  name: "list",
  data() {
    return {
      isOpen: false
    };
  },
  components: { listItem },
  methods: {
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    }
  },
  computed: {
    hasVibes() {
      console.log(Object.keys(this.$store.state.vibes).length);
      return Object.keys(this.$store.state.vibes).length;
    }
  }
};
</script>

<style scoped="true">
.wrapper {
  position: absolute;
  margin: 10px;
}

@keyframes openAnim {
  from {
    left: -550px;
  }
  to {
    left: 0px;
  }
}

@keyframes closeAnim {
  from {
    left: 0px;
  }
  to {
    left: -550px;
  }
}

.open {
  left: 0px;
  animation: openAnim;
  animation-duration: 0.2s;
}

.closed {
  left: -550px;
  animation: closeAnim;
  animation-duration: 0.2s;
}

.list {
  max-height: 90vh;
  padding-right: 8px;
  overflow-y: scroll;
  float: left;
}

.closeBtn {
  margin-left: 6px;
  border-radius: 50px;
  border: 3px white solid;
  width: 50px;
  height: 50px;
  line-height: 43px;
  font-size: 20px;
  background: #91daffc9;
  font-family: cursive;
  font-weight: 900;
  float: left;
  color: white;
  user-select: none;
  box-sizing: border-box;
}

.openBtn {
  margin-left: 6px;
  border-radius: 50px;
  border: 3px white solid;
  width: 50px;
  height: 50px;
  background: #91daffc9;
  float: left;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 10px;
  box-sizing: border-box;
}

.openBtn > div {
  width: 100%;
  height: 5px;
  background: white;
  border-radius: 10px;
}

.list::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.list::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}
.list::-webkit-scrollbar-thumb {
  background: #fffd;
  border: 0px none #ffffff;
  border-radius: 50px;
}
.list::-webkit-scrollbar-thumb:hover {
  background: #fff;
}
.list::-webkit-scrollbar-thumb:active {
  background: #ffff;
}
.list::-webkit-scrollbar-track {
  background: #0000;
  border: 0px none #ffffff;
  border-radius: 50px;
}
.list::-webkit-scrollbar-corner {
  background: transparent;
}
</style>


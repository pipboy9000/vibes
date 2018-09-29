<template>
  <div class="list" v-if="hasVibes" :class="{open :isOpen, closed: !isOpen && ready}">
    <div class="items">
      <listItem v-for="(vibe, key) in $store.state.vibes" :key="key" :vibe="vibe"></listItem>
    </div>
    <div class="btn">
      <div v-if="isOpen" class="closeBtn" @click="close">
        <div></div>
        <div></div>
      </div>
      <div v-else class="openBtn" @click="open">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
import ListItem from "./listItem";
import { EventBus } from "../event-bus";

export default {
  name: "List",
  data() {
    return {
      isOpen: false,
      ready: false //used to fix animations
    };
  },
  components: { ListItem },
  mounted() {
    EventBus.$on("listItemClicked", this.close);
  },
  methods: {
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
      this.ready = true;
    }
  },
  computed: {
    hasVibes() {
      return this.$store.state.vibes.length > 0;
    }
  },
  watch: {
    hasVibes(newVibesCount, oldVibesCount) {
      var self = this;
      if (newVibesCount > 0 && oldVibesCount === 0) {
        setTimeout(function() {
          self.ready = true;
        }, 500);
      } else if (newVibesCount === 0 && oldVibesCount > 0) {
        this.ready = false;
        this.close();
      }
    }
  }
};
</script>

<style scoped="true">
.list {
  padding: 10px;
  transform: translateX(-575px);
  position: absolute;
  float: left;
  left: 0px;
}

.items {
  box-sizing: border-box;
  float: left;
  max-height: 536px;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-right: 15px;
}

.btn {
  float: left;
}

.closed {
  animation: closeAnim;
  animation-duration: 0.25s;
  animation-timing-function: ease-out;
  transform: translateX(-575px);
}

.open {
  animation: openAnim;
  animation-duration: 0.25s;
  animation-timing-function: ease-out;
  transform: translateX(0px);
}

@keyframes openAnim {
  from {
    transform: translateX(-540px);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes closeAnim {
  from {
    transform: translateX(0px);
  }
  to {
    transform: translateX(-540px);
  }
}

.noAnim {
  animation-duration: 0s;
}

.openBtn {
  border-radius: 50px;
  border: 4px white solid;
  width: 65px;
  height: 65px;
  background: #22dbe3;
  float: left;
  color: white;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 12px;
  box-sizing: border-box;
  margin-left: 15px;
  box-shadow: 0px 6px 6px -1px #00000030;
}

.openBtn > div {
  width: 100%;
  height: 6px;
  background: white;
  border-radius: 10px;
}

.closeBtn {
  border-radius: 50px;
  border: 4px white solid;
  width: 65px;
  height: 65px;
  background: #22dbe3a8;
  float: left;
  color: white;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 10px;
  box-sizing: border-box;
  margin-left: 5px;
  align-items: center;
  box-shadow: 0px 6px 6px -1px #00000030;
}

.closeBtn > div {
  position: absolute;
  width: 25px;
  height: 5px;
  background: white;
  border-radius: 10px;
}

.closeBtn > div:nth-child(1) {
  transform: rotate(45deg);
}

.closeBtn > div:nth-child(2) {
  transform: rotate(-45deg);
}

.items::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.items::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}
.items::-webkit-scrollbar-thumb {
  background: #fffd;
  border: 0px none #ffffff;
  border-radius: 50px;
}
.items::-webkit-scrollbar-thumb:hover {
  background: #fff;
}
.items::-webkit-scrollbar-thumb:active {
  background: #ffff;
}
.items::-webkit-scrollbar-track {
  background: #0000;
  border: 0px none #ffffff;
  border-radius: 50px;
}
.items::-webkit-scrollbar-corner {
  background: transparent;
}

@media (max-width: 650px) {
  .list {
    width: 100%;
    padding: 0;
    transform: translateX(-80%);
  }
  .wrapper {
    margin: 0;
    width: 95%;
    box-shadow: -18px 10px 56px;
  }

  .items {
    width: 80%;
    max-height: 100vh;
  }

  .btn {
    width: 20%;
    margin-top: 10px;
  }

  @keyframes openAnim {
    from {
      transform: translateX(-80%);
    }
    to {
      transform: translateX(-20px);
    }
  }

  @keyframes closeAnim {
    from {
      transform: translateX(-20px);
    }
    to {
      transform: translateX(80%px);
    }
  }

  .closed {
    animation: closeAnim;
    animation-duration: 0.25s;
    animation-timing-function: ease-out;
    transform: translateX(-80%);
  }

  .open {
    animation: openAnim;
    animation-duration: 0.25s;
    animation-timing-function: ease-out;
    transform: translateX(0);
  }

  .items {
    width: 80%;
    padding-bottom: 15px;
  }

  .items > .bg:last-child {
    border-radius: 0px 0px 10px 0px;
  }
}

@media (max-width: 400px) {
  .closeBtn {
    width: 57px;
    height: 57px;
  }

  .items {
    padding-right: 8px;
  }
}
</style>


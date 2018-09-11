<template>
    <!-- <div v-show="hasVibes" class="wrapper" :class="{open: isOpen, closed: !isOpen, noAnim: !ready}"> -->
    <div v-show="hasVibes" class="wrapper open">
      <div class="listBig">
        <listItem v-for="(vibe, key) in $store.state.vibes" :key="key" :vibe="vibe"></listItem>
      </div>
      <div class="listSmall">
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
import listItem from "./listItem";
import { EventBus } from "../event-bus";

export default {
  name: "List",
  data() {
    return {
      isOpen: false,
      ready: false //used to fix animations
    };
  },
  components: { listItem },
  mounted() {
    var self = this;
    if (this.hasVibes) {
      setTimeout(function() {
        self.ready = true;
      }, 500);
    }

    EventBus.$on("listItemClicked", this.close);
  },
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
      return this.$store.state.vibes.length;
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
.wrapper {
  position: absolute;
  left: -550px;
  margin: 10px;
  overflow: hidden;
  height: 100%;
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
  animation-duration: 0.25s;
  animation-timing-function: ease-out;
}

.closed {
  transform: translateX(-10px);
  left: -550px;
  animation: closeAnim;
  animation-duration: 0.25s;
  animation-timing-function: ease-out;
}

.closed > .openBtn {
  margin-left: 10px;
}

.noAnim {
  animation-duration: 0s;
}

.listBig {
  max-height: 50vh;
  padding-right: 8px;
  overflow-y: scroll;
  float: left;
  clear: none;
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
  float: right;
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

.listBig,
.listSmall::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.listBig,
.listSmall::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}
.listBig,
.listSmall::-webkit-scrollbar-thumb {
  background: #fffd;
  border: 0px none #ffffff;
  border-radius: 50px;
}
.listBig,
.listSmall::-webkit-scrollbar-thumb:hover {
  background: #fff;
}
.listBig,
.listSmall::-webkit-scrollbar-thumb:active {
  background: #ffff;
}
.listBig,
.listSmall::-webkit-scrollbar-track {
  background: #0000;
  border: 0px none #ffffff;
  border-radius: 50px;
}
.listBig,
.listSmall::-webkit-scrollbar-corner {
  background: transparent;
}

.listSmall {
  visibility: visible;
  display: none;
  width: 85%;
  float: left;
  clear: none;
}

@media (max-width: 650px) {
  .wrapper {
    margin: 0;
  }

  .listBig {
    visibility: collapse;
    display: none;
  }

  .listSmall {
    visibility: visible;
    display: inline-block;
    height: 100%;
    overflow-y: scroll;
  }
}
</style>


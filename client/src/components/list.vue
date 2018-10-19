<template>
  <div class="list" v-if="hasVibes" :class="{open :isOpen, closed: !isOpen && ready}">
    <div class="topBar" v-if="isMobile">
      <!-- <div class="logo"></div> -->
      <Logo class="logo" :size="40"></Logo>
      <div class="closeBtn" @click="close">
        <div></div>
        <div></div>
      </div>
    </div>
    <div class="items">
      <listItem v-for="(vibe, key) in $store.state.vibes" :key="key" :vibe="vibe"></listItem>
    </div>
    <div class="btn">
      <div v-if="isOpen" class="closeBtn" @click="close">
        <div></div>
        <div></div>
      </div>
      <router-link tag="div" v-else class="openBtn" :to="{path:'', query:{list:true}}">
        <div></div>
        <div></div>
        <div></div>
      </router-link>
    </div>
  </div>
</template>

<script>
import ListItem from "./listItem";
import Logo from "./logo";
import { EventBus } from "../event-bus";

export default {
  name: "List",
  data() {
    return {
      isOpen: false,
      ready: false, //used to fix animations
      isMobile: false
    };
  },
  components: { ListItem, Logo },
  methods: {
    open() {
      this.isMobile = window.innerWidth < 650 ? true : false;
      this.isOpen = true;
      this.ready = true;
    },
    close() {
      this.$router.go(-1);
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
    },
    $route(to, from) {
      if (this.$route.query.list) {
        this.open();
      } else {
        this.isOpen = false;
      }
    }
  }
};
</script>

<style scoped="true">
.list {
  padding: 10px;
  transform: translateX(-565px);
  position: absolute;
  float: left;
  left: 0px;
}

.topBar {
  width: 100vw;
  height: 80px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* justify-content: flex-end; */
  background: white;
  border-bottom: 1px #dfdfdf solid;
}

.logo {
  margin-left: 15px;
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
  cursor: pointer;
  float: left;
}

.closed {
  animation: closeAnim;
  animation-duration: 0.25s;
  animation-timing-function: ease-out;
  transform: translateX(-565px);
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
  border: 3px white solid;
  width: 65px;
  height: 65px;
  background: #5dc8ff;
  float: left;
  color: white;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 10px;
  box-sizing: border-box;
  margin-left: 15px;
  box-shadow: 0px 6px 6px -1px #00000030;
}

.openBtn > div {
  width: 100%;
  height: 5px;
  background: white;
  border-radius: 10px;
}

.closeBtn {
  border-radius: 50px;
  border: 3px white solid;
  width: 65px;
  height: 65px;
  background: #5dc8ff;
  float: left;
  color: white;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 10px;
  box-sizing: border-box;
  margin-left: 10px;
  align-items: center;
  box-shadow: 0px 2px 6px -1px #00000030;
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
    width: 120vw;
    padding: 0;
    transform: translateX(-100vw);
  }
  .wrapper {
    margin: 0;
    width: 95%;
    box-shadow: -18px 10px 56px;
  }

  .btn {
    width: 20vw;
    margin-top: 15px;
  }

  .closeBtn {
    margin-right: 20px;
    background: #ffffff;
    border: 4px #5dc8ff solid;
    width: 50px;
    height: 50px;
    box-shadow: unset;
  }

  .closeBtn > div {
    background: #5dc8ff;
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
    transform: translateX(-100vw);
  }

  .open {
    animation: openAnim;
    animation-duration: 0.25s;
    animation-timing-function: ease-out;
    transform: translateX(0);
  }

  .items {
    width: 100vw;
    padding-right: 0;
    max-height: 480px;
    margin-top: 80px;
    box-shadow: -20px 10px 43px -10px;
    overflow-y: auto;
  }

  .items::-webkit-scrollbar-track {
    background: #5dc8ff;
    border: 0px none #ffffff;
    border-radius: 0px;
  }

  .items::-webkit-scrollbar-thumb {
    background: #ffffffd9;
  }

  .items > .bg:last-child {
    border-radius: 0px 0px 00px 0px;
  }
}

@media (max-width: 400px) {
  .closeBtn {
    width: 57px;
    height: 57px;
  }

  .items > .bg:last-child {
    border-radius: 0px 0px 0px 0px;
  }
}
</style>


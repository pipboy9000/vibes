<template>
  <div class="list" ref="list">
    <div class="items">
      <listItem v-for="(vibe, key) in $store.state.vibes" :key="key" :vibe="vibe"></listItem>
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
      ready: false, //used to fix animations
      isMobile: false
    };
  },
  mounted() {
    this.$refs.list.addEventListener("mousedown", function(e) {
      console.log("list - mousedown");
    });
  },
  components: { ListItem },
  methods: {},
  computed: {
    hasVibes() {
      return this.$store.state.vibes.length > 0;
    }
  },
  watch: {
    hasVibes(newVibesCount, oldVibesCount) {}
  }
};
</script>

<style scoped="true">
.list {
  width: 100%;
  height: 145px;
  position: absolute;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  bottom: 82px;
  scroll-snap-type: x mandatory;
}

.list::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
.list::-webkit-scrollbar-button {
  width: 33px;
  height: 33px;
}
.list::-webkit-scrollbar-thumb {
  background: #ffffff;
  border: 2px none #ffffff;
  border-radius: 50px;
}

.list::-webkit-scrollbar-track {
  background: #0000;
  border: 0px none #ffffff;
  border-radius: 50px;
}

.list::-webkit-scrollbar-corner {
  background: transparent;
}

.items {
  width: 100%;
  height: 80px;
}
</style>


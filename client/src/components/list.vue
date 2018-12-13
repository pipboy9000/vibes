<template>
  <div class="list" ref="list" @mousewheel="wheel" @scroll="listScroll">
    <div class="items">
      <listItem v-for="(vibe, key) in $store.state.vibes" :key="key" :vibe="vibe" ref="items"></listItem>
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
      scrollM: 0, //scroll momentum, used when user uses mousewheel on the list
      isMoving: false
    };
  },
  mounted() {},
  components: { ListItem },
  methods: {
    wheel(e) {
      this.scrollM += e.wheelDelta / 7;
      if (!this.isMoving) {
        this.move();
      }
    },
    move() {
      this.isMoving = true;
      if (this.scrollM > 1 || this.scrollM < -1) {
        this.$refs.list.scrollBy(this.scrollM, 0);
        this.scrollM *= 0.9;
        requestAnimationFrame(this.move);
      } else {
        this.$refs.list.scrollBy(this.scrollM, 0);
        this.isMoving = false;
      }
    },
    scrollToItem(idx) {
      var to = 0;
      for (var i = 0; i < idx; i++) {
        var el = this.$refs.items[i].$el;
        to += el.scrollWidth + 8; //margin = 8, 4 on each side
      }
      to += this.$refs.items[idx].$el.scrollWidth / 2;
      to -= this.$refs.list.clientWidth / 2;

      this.$refs.list.scrollTo({
        top: 0,
        left: to,
        behavior: "smooth"
      });
    },
    listScroll() {
      console.log(this.$refs.list.scrollLeft);
    }
  },
  computed: {
    hasVibes() {
      return this.$store.state.vibes.length > 0;
    },
    selectedVibe() {
      return this.$store.state.selectedVibe;
    },
    vibes() {
      return this.$store.state.vibes;
    }
  },
  watch: {
    selectedVibe() {
      var self = this;
      var idx = this.vibes.indexOf(this.selectedVibe);
      this.scrollToItem(idx);
    }
  }
};
</script>

<style scoped="true">
.list {
  max-width: 100%;
  height: 145px;
  position: absolute;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  bottom: 82px;
  /* scroll-snap-type: x mandatory; */
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


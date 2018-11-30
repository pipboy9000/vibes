<template>
  <div>
    <div class="md-layout">
      <div class="md-layout-item">
        <NewVibe></NewVibe>
      </div>
      <div class="md-layout-item">
        <FutureVibeList></FutureVibeList>
      </div>
    </div>
    <Map></Map>
  </div>
</template>

<script>
import Map from "./map";
import NewVibe from '@/components/NewVibe';
import FutureVibeList from "@/components/FutureVibeList";

export default {
  name: "Dashboard",
  components: {
    Map,
    NewVibe,
    FutureVibeList
  },
};
</script>

<style lang="scss" scoped>
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}
</style>

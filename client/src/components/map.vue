<template>
<GmapMap class="map"
  :center="{lat:10, lng:10}"
  :zoom="7"
  map-type-id="terrain"
  ref="map"
  :options="{disableDefaultUI: true}"
>
    <gmap-marker
    :v-if="myLocation"
      :position="myLocation"
      :clickable="true"
    ></gmap-marker>
</GmapMap>
</template>

<script>
import location from "../services/location.js";
import { EventBus } from "../event-bus.js";

export default {
  name: "Map",

  data() {
    return {
      map: null,
      myMarker: null
    };
  },
  mounted() {
    this.$refs.map.$mapPromise.then(map => {
      this.map = map;
      location.watchLocation();
    });
  },
  computed: {
    myLocation() {
      if (this.$store.state.location)
        return {
          lat: this.$store.state.location.coords.latitude,
          lng: this.$store.state.location.coords.longitude
        };
        return null;
    }
  },
  watch: {
    myLocation(newLoc, oldLoc) {
      console.log(newLoc);
      this.map.panTo(newLoc);
      this.map.setZoom(15);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.map {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>

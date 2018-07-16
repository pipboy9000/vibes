<template>
<GmapMap class="map" :center="{lat:10, lng:10}" :zoom="7" map-type-id="terrain" ref="map" :options="{disableDefaultUI: true}">
    <!-- <gmap-marker :v-if="myLocation" :position="myLocation" :clickable="true" ></gmap-marker> -->
    <gmap-marker v-for="vibe in $store.state.vibes" :key="vibe._id" :position="vibe.location"></gmap-marker>
</GmapMap>
</template>

<script>
import location from "../services/location.js";
import { EventBus } from "../event-bus.js";
import { gmapApi } from "vue2-google-maps";

export default {
  name: "Map",

  data() {
    return {
      map: null,
      myMarker: null,
      circles: []
    };
  },
  mounted() {
    this.$refs.map.$mapPromise.then(map => {
      this.map = map;
      location.watchLocation();
      EventBus.$on("listItemClicked", this.focusVibe);
      EventBus.$on("zoomIn", this.zoomIn);
      EventBus.$on("zoomOut", this.zoomOut);
      EventBus.$on("focus", this.focusSelf);
    });
  },
  methods: {
    focus(location) {
      debugger;
      if (location) {
        this.map.panTo(location);
        this.map.setZoom(10);
      }
    },
    focusVibe(vibe) {
      this.focus(vibe.location);
    },
    focusSelf() {
      this.focus(this.$store.state.location);
    },
    zoomIn() {
      this.map.setZoom(this.map.getZoom() + 1);
    },
    zoomOut() {
      this.map.setZoom(this.map.getZoom() - 1);
    }
  },
  computed: {
    google: gmapApi,
    myLocation() {
      if (this.$store.state.location)
        return {
          lat: this.$store.state.location.coords.latitude,
          lng: this.$store.state.location.coords.longitude
        };
      return null;
    },
    vibes() {
      return this.$store.state.vibes;
    }
  },
  watch: {
    myLocation(newLoc, oldLoc) {
      this.focus(newLoc);
    },
    vibes(newVibes, oldVibes) {
      this.circles.forEach(circle => {
        circle.setMap(null);
        circle = null;
      });

      for (var id in newVibes) {
        var circle = new google.maps.Circle({
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          map: this.map,
          center: newVibes[id].location,
          radius: newVibes[id].users.length * 1000
        });
        this.circles.push(circle);
      }
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

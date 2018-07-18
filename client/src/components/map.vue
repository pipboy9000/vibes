<template>
<GmapMap class="map" :center="{lat:10, lng:10}" :zoom="7" map-type-id="terrain" ref="map" :options="{disableDefaultUI: true}">
    <gmap-marker :v-if="myLocation" :position="myLocation" :clickable="true" :icon="myIcon"></gmap-marker>
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
      myIcon: {url: "../assets/user_marker.png"},
      circles: [],
      users: []
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
      if (location) {
        this.map.panTo(location);
        this.map.setZoom(15);
      }
    },
    focusVibe(vibe) {
      this.focus(vibe.location);
    },
    focusSelf() {
      this.focus(this.myLocation);
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
      //development
      return this.$store.getters.myLocation;

      // if (this.$store.state.location) {
      //   return {
      //     lat: this.$store.state.location.coords.latitude,
      //     lng: this.$store.state.location.coords.longitude
      //   };
      // }
      // return null;
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
      var i = 0;
      for (var vibeId in newVibes) {
        var vibe = newVibes[vibeId];
        if (i < this.circles.length) {
          this.circles[i].setCenter(vibe.location);
          this.circles[i].setRadius(vibe.users.length * 50);
        } else {
          console.log(this.map);
          var circle = new google.maps.Circle({
            strokeColor: "#ff13c4",
            strokeOpacity: 0.5,
            strokeWeight: 3,
            fillColor: "#ff6ada",
            fillOpacity: 0.25,
            map: this.map,
            center: vibe.location,
            radius: vibe.users.length * 50
          });
          this.circles.push(circle);
        }
        i++;
      }
      //clear unused circles
      for (i = i; i < this.circles.length; i++) {
        this.circles[i].setMap(null);
        this.circles[i] = null;
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

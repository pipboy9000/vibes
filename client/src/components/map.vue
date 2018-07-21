<template>
<GmapMap class="map" :center="{lat:10, lng:10}" :zoom="7" map-type-id="terrain" ref="map" :options="{disableDefaultUI: true}">
    <gmap-marker :v-if="location" :position="location" :clickable="true" :icon="'./assets/static/user_marker.png'"></gmap-marker>
    <gmap-marker v-for="vibe in vibes" :key="vibe._id" :position="vibe.location"></gmap-marker>
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
      circles: [],
      users: [],
      userInfoWindow: null,
    };
  },
  mounted() {
    this.$refs.map.$mapPromise.then(map => {
      this.map = map;
      EventBus.$on("listItemClicked", this.focusVibe);
      EventBus.$on("zoomIn", this.zoomIn);
      EventBus.$on("zoomOut", this.zoomOut);
      EventBus.$on("focus", this.focusSelf);

      this.userInfoWindow = new google.maps.InfoWindow({
        content: "<p>hello world<//p>" + Date.now()
      });
    });
  },

  methods: {
    focus(location) {
      if (location) {
        this.map.panTo(location);
        // this.map.setZoom(15);
      }
    },
    focusVibe(vibe) {
      this.focus(vibe.location);
    },
    focusSelf() {
      this.focus(this.location);
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
    location() {
      return this.$store.state.location;
    },
    vibes() {
      return this.$store.state.vibes;
    }
  },
  watch: {
    location(newLoc, oldLoc) {
      var self = this;
      if (!this.myMarker) {
        this.myMarker = new google.maps.Marker({
          icon: "./static/user_marker.png",
          map: this.map
        });

        this.myMarker.addListener("click", function() {
          self.userInfoWindow.setContent("hello world " + Date.now());
          self.userInfoWindow.open(self.map, self.myMarker);
        });
      }

      this.myMarker.setPosition(newLoc);
      // this.focus(newLoc);
    },
    vibes(newVibes, oldVibes) {
      var i = 0;
      for (var vibeId in newVibes) {
        var vibe = newVibes[vibeId];
        if (i < this.circles.length) {
          this.circles[i].setCenter(vibe.location);
          this.circles[i].setRadius(vibe.users.length * 50);
        } else {
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
        if (this.circles[i]) {
          this.circles[i].setMap(null);
          this.circles[i] = null;
        }
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

<template>
  <div class="map">
    <gmap-map ref="mapRef" style="height: 100%" :center="location" :zoom="14">
        <gmap-marker
          v-for="(event, index) in vibes"
          :key="'marker'+index"
          :position="event.location"
          :icon="require('../../static/vibe_marker.png')"
          @click="panTo(event.location)"
        ></gmap-marker>

        <gmap-circle
          v-for="(event, index) in vibes"
          :key="'circle'+index"
          :center="event.location"
          :options="{
            strokeColor: '#000',
            strokeOpacity: 0,
            strokeWeight: 0,
            fillColor: '#ff6ada',
            fillOpacity: 0.25,
            radius: 500
            }"
          @click="panTo(event.location)"
        ></gmap-circle>
      
    </gmap-map>
  </div>
</template>

<script>
import { EventBus } from "../../../client/src/event-bus.js";

export default {
  name: "Map",
  data() {
    return {
      google: null,
      map: null,
      myGhost: null, //represents local location
      myMarker: null, //represents server location
      circles: [],
      vibeMarkers: [],
      userMarkers: [],
      mockLocation: {}
    };
  },
  mounted() {
    var self = this;
    EventBus.$on("listItemClicked", this.focusVibe);
    EventBus.$on("zoomIn", this.zoomIn);
    EventBus.$on("zoomOut", this.zoomOut);
    EventBus.$on("focus", this.focusSelf);
    EventBus.$on("focusVibe", this.focusVibe);

    var mockX = 32.090042199999996;
    var mockY = 34.779544399999996;
    this.mockLocation = {
      lat: mockX,
      lng: mockY
    };
    
    this.$refs.mapRef.$mapPromise.then(map => {
      this.map = map;

      // this.map.addListener("click", function(e) {
      //   service.getDetails({
      //       placeId: e.placeId
      //     }, function(place, status) {
      //       if (status === google.maps.places.PlacesServiceStatus.OK) {
      //         EventBus.$emit("mapClicked", {
      //           placeName: place.name,
      //           lat: e.latLng.lat(),
      //           lng: e.latLng.lng()
      //           });
      //       }
      //     });
      // });
    });
  },

  methods: {
    getVibeSize(numUsers) {
      return Math.round(numUsers * 150 * 0.8) + 25;
    },
    focus(location, zoom) {
      if (location) {
        if (zoom) {
          this.map.panTo(location);
          this.map.setZoom(zoom);
        } else {
          this.map.panTo(location);
        }
      }
    },
    focusVibe(vibe) {
      this.focus(vibe.location);
    },
    focusSelf(zoom) {
      this.focus(this.location, zoom);
    },
    zoomIn() {
      this.map.setZoom(this.map.getZoom() + 1);
    },
    zoomOut() {
      this.map.setZoom(this.map.getZoom() - 1);
    },
    getIcon(inVibe) {
      if (inVibe) return "./static/user_marker_in_vibe.png";
      return "./static/user_marker.png";
    },
    getNewVibeMarker(vibe) {
      return new google.maps.Marker({
        icon: "./static/vibe_marker.png",
        map: this.map,
        position: vibe.location
      });
    },
    getNewCircle(vibe) {
      return new google.maps.Circle({
        strokeColor: "#000",
        strokeOpacity: 0,
        strokeWeight: 0,
        fillColor: "#ff6ada",
        fillOpacity: 0.25,
        map: this.map,
        center: vibe.location,
        radius: this.getVibeSize(vibe.users ? vibe.users.length + 2 : 2)
      });
    }
  },
  computed: {
    location() {
      return this.mockLocation;
    },
    vibes() {
      return this.$store.state.vibes;
    },
    users() {
      return {};
    },
    serverLocation() {
      return this.location;
    }
  }
};
</script>


<style scoped="true">
</style>

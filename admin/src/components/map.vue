<template>
  <div ref="map" class="map"></div>
</template>

<script>
import { EventBus } from "../../../client/src/event-bus.js";
import { CustomUserInfoWindow } from "../../../client/src/services/maps.js";

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
      userInfoWindow: null,
      mockLocation: {}
    };
  },
  mounted() {
    var self = this;
    EventBus.$on("listItemClicked", this.focusVibe);
    EventBus.$on("zoomIn", this.zoomIn);
    EventBus.$on("zoomOut", this.zoomOut);
    EventBus.$on("focus", this.focusSelf);

    var mockX = 32.080032199999996;
    var mockY = 34.769544399999996;
    this.mockLocation = { 
        lat: mockX, 
        lng: mockY 
      };
    this.map = new google.maps.Map(this.$refs.map, {
      zoom: 17,
      center: { 
        lat: mockX, 
        lng: mockY 
      },
      disableDefaultUI: true
    });

    this.map.addListener("click", function(e) {
      self.userInfoWindow.close();
      EventBus.$emit("mapClicked", {lat: e.latLng.lat(), lng: e.latLng.lng()});
    });

    //init the custom overlay object to use as an infowindow
    this.userInfoWindow = new CustomUserInfoWindow(this.map);
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
        radius: this.getVibeSize(vibe.users.length + 2)
      });
    },
    
    renderCircles(vibes) {
      var i = 0;
      for (var vibeId in vibes) {
        var vibe = vibes[vibeId];
        if (i < this.circles.length) {
          this.circles[i].setCenter(vibe.location);
          this.circles[i].setRadius(this.getVibeSize(vibe.users.length));
        } else {
          var circle = this.getNewCircle(vibe);
          this.circles.push(circle);
        }
        i++;
      }
      //clear unused circles
      for (i = i; i < this.circles.length; i++) {
        if (this.circles[i]) {
          this.circles[i].setMap(null);
          this.circles[i] = null;
          this.circles.pop();
        }
      }
    },
    renderVibeMarkers(vibes) {
      var self = this;
      var i = 0;
      for (var vibeId in vibes) {
        let vibe = vibes[vibeId];
        if (i < this.vibeMarkers.length) {
          this.vibeMarkers[i].setPosition(vibe.location);
        } else {
          var marker = this.getNewVibeMarker(vibe);
          this.vibeMarkers.push(marker);
        }

        //clear previous click listeners
        google.maps.event.clearInstanceListeners(this.vibeMarkers[i]);
        //set click listeners
        this.vibeMarkers[i].addListener("click", function() {
          // self.$store.commit("setSelectedVibe", vibe);
          // EventBus.$emit("vibeMarkerClicked", vibe);
          var vibeId = self.$route.query.v;
          if (vibeId) {
            self.$router.replace({ path: "", query: { v: vibeId } });
            EventBus.$emit("vibeMarkerClicked", vibe);
          } else {
            vibeId = vibe.id;
            self.$router.push({ path: "", query: { v: vibeId } });
          }
          self.focusVibe(vibe);
        });

        i++;
      }

      //remove unused markers
      var len = Object.keys(vibes).length;
      if (this.vibeMarkers.length > len) {
        for (var i = len; i < this.vibeMarkers.length; i++) {
          this.vibeMarkers[i].setMap(null);
          this.vibeMarkers[i] = null;
        }
        this.vibeMarkers = this.vibeMarkers.slice(0, len);
      }
    }
  },
  computed: {
    location() {
      return this.mockLocation;
    },
    vibes() {
      return {}
    },
    users() {
      return {}
    },
    serverLocation() {
      return this.location;
    }
  },
  watch: {
    location(newLoc, oldLoc) {
      if (!oldLoc) {
        this.focus(newLoc, 17);
      }
    },
    vibes(newVibes) {
      this.renderCircles(newVibes);
      this.renderVibeMarkers(newVibes);
    }
  }
};
</script>


<style scoped="true">
.map {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>

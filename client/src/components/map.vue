<template>
  <div ref="map" class="map"></div>
</template>

<script>
import { EventBus } from "../event-bus.js";
import { CustomUserInfoWindow } from "../services/maps.js";

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
      proj: null //map projection
    };
  },
  mounted() {
    var self = this;
    EventBus.$on("listItemClicked", this.focusVibe);
    EventBus.$on("zoomIn", this.zoomIn);
    EventBus.$on("zoomOut", this.zoomOut);
    EventBus.$on("focus", this.focusSelf);

    this.map = new google.maps.Map(this.$refs.map, {
      zoom: 10,
      center: this.$store.state.location
        ? this.$store.state.location
        : { lat: 0, lng: 0 },
      disableDefaultUI: true
    });

    this.map.addListener("click", function(e) {
      self.userInfoWindow.close();
    });

    this.myGhost = new google.maps.Marker({
      icon: "./static/user_marker.png",
      map: this.map,
      opacity: 0.3
    });

    this.myGhost.addListener("click", function() {
      self.userInfoWindow.setDetails(self.$store.getters.me);
      self.userInfoWindow.open();
    });

    if (this.location) {
      this.myGhost.setPosition(this.location);
    }

    //init the custom overlay object to use as an infowindow
    this.userInfoWindow = new CustomUserInfoWindow(this.map);
  },

  methods: {
    getVibeSize(numUsers) {
      return Math.round(numUsers * 150 * 0.8) + 25;
    },
    focus(location, zoom, offsetX, offsetY) {
      if (offsetX || offsetY) {
        var proj = this.userInfoWindow.getProjection();
        var p = proj.fromLatLngToContainerPixel(
          new google.maps.LatLng(location)
        );
        p.x += offsetX;
        p.y += offsetY;
        location = proj.fromContainerPixelToLatLng(p);
        zoom = false; //we cant zoom after offset
      }

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
      this.focus(vibe.location, false, 0, 80);
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
    getNewUserMarker(user) {
      return new google.maps.Marker({
        icon: this.getIcon(user.inVibe),
        map: this.map,
        position: {
          lat: user.location.lat,
          lng: user.location.lng
        },
        zIndex: 999
      });
    },
    getNewVibeMarker(vibe) {
      return new google.maps.Marker({
        icon: {
          url: "./static/vibe_marker.png",
          anchor: { x: 42, y: 42 }
        },
        map: this.map,
        position: vibe.location
      });
    },
    getNewCircle(vibe) {
      return new google.maps.Circle({
        strokeColor: "#000",
        strokeOpacity: 0,
        strokeWeight: 0,
        fillColor: "#ff00ff",
        fillOpacity: 0.25,
        map: this.map,
        center: vibe.location,
        radius: this.getVibeSize(vibe.users.length + 2)
      });
    },
    renderUsers(users) {
      var self = this;

      users.map((u, idx) => {
        if (idx < self.userMarkers.length) {
          self.userMarkers[idx].setPosition({
            lat: u.location.lat,
            lng: u.location.lng
          });
          self.userMarkers[idx].setIcon(self.getIcon(u.inVibe));
        } else {
          self.userMarkers[idx] = self.getNewUserMarker(u);
        }

        if (u.fbid === self.$store.getters.fbid) {
          self.myMarker = self.userMarkers[idx];
        }

        //clear previous click listeners
        google.maps.event.clearInstanceListeners(self.userMarkers[idx]);

        self.userMarkers[idx].addListener("click", function() {
          self.userInfoWindow.setDetails(u);
          self.userInfoWindow.open();
        });
      });

      //remove unused markers
      if (this.userMarkers.length > users.length) {
        for (var i = users.length; i < this.userMarkers.length; i++) {
          this.userMarkers[i].setMap(null);
          this.userMarkers[i] = null;
        }
        this.userMarkers = this.userMarkers.slice(0, users.length);
      }
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
          debugger;
          this.vibeMarkers.push(marker);
        }

        //clear previous click listeners
        google.maps.event.clearInstanceListeners(this.vibeMarkers[i]);

        //set click listeners
        this.vibeMarkers[i].addListener("click", function() {
          self.focusVibe(vibe);
          if (this.openVibe) {
            this.$store.commit("setSelectedVibe", this.vibe);
            this.$router.replace({ path: "", query: { v: this.vibe.id } });
          } else {
            if (self.selectedVibe !== vibe) {
              self.$store.commit("setSelectedVibe", vibe);
            } else {
              var vibeId = self.$route.query.v;
              if (vibeId) {
                if (this.$store.state.selectedVibe.id === vibe.id) {
                  self.$router.replace({ path: "", query: { v: vibeId } });
                }
              } else {
                vibeId = vibe.id;
                self.$router.push({ path: "", query: { v: vibeId } });
              }
            }
          }
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
      return this.$store.state.location;
    },
    vibes() {
      return this.$store.state.vibes;
    },
    users() {
      return this.$store.state.users;
    },
    inVibe() {
      return this.$store.state.inVibe;
    },
    serverLocation() {
      return this.$store.state.serverLocation;
    },
    selectedVibe() {
      return this.$store.state.selectedVibe;
    },
    openVibe() {
      return this.$store.state.openVibe;
    }
  },
  watch: {
    selectedVibe(vibe) {
      this.focusVibe(vibe);
    },
    location(newLoc, oldLoc) {
      this.myGhost.setPosition(newLoc);
      if (!oldLoc) {
        this.focus(newLoc, 17);
      }
    },
    serverLocation(newLoc, oldLoc) {
      if (!newLoc) return;
      var fbid = this.$store.getters.fbid;
      var me = this.$store.state.users.find(function(u) {
        return u.fbid === fbid;
      });
      if (me) {
        me.location = newLoc;
      } else {
        this.$store.state.users.push(this.$store.getters.me);
      }
      this.renderUsers(this.$store.state.users);
    },
    vibes(newVibes) {
      this.renderCircles(newVibes);
      this.renderVibeMarkers(newVibes);
    },
    users(newUsers) {
      this.renderUsers(newUsers);
    },
    inVibe(newInVibe, oldInVibe) {
      if (newInVibe) {
        this.myGhost.setIcon("./static/user_marker_in_vibe.png");
        this.myMarker.setIcon("./static/user_marker_in_vibe.png");
      } else {
        this.myGhost.setIcon("./static/user_marker.png");
        this.myMarker.setIcon("./static/user_marker.png");
      }
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

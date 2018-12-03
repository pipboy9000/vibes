import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    vibes: [],
  },
  getters: {
    
  },
  mutations: {
    setVibes(state, vibes) {
      state.vibes = vibes;
      if (state.selectedVibe) {
        state.selectedVibe = vibes.find(function (vibe) {
          return vibe.id === state.selectedVibe.id;
        });
      }
    },
  },
  actions: {
    calculateDistances(context, vibesArray) {
      return new Promise(function (res) {
        vibesArray.forEach(vibe => {
          if (context.getters.me) {
            var myLocation = new google.maps.LatLng(
              context.getters.me.location.lat,
              context.getters.me.location.lng
            );
            var vibeLocation = new google.maps.LatLng(
              vibe.location.lat,
              vibe.location.lng
            );
            var distance = google.maps.geometry.spherical.computeDistanceBetween(
              myLocation,
              vibeLocation
            );
            vibe.distance = distance;
          }
        });
        vibesArray.sort(function (a, b) {
          return a.distance - b.distance;
        });
        res(vibesArray);
      })
    },
    setData(context, data) {
      if (data.hasOwnProperty("users")) {
        context.commit("setUsers", data.users);
      }

      if (data.hasOwnProperty("vibes")) {
        context.dispatch("setVibes", data.vibes);
      }
    },
    setVibes(context, vibesArray) {
      context.dispatch("calculateDistances", vibesArray).then(sorted => {
        context.commit("setVibes", sorted);
      });
    },
    setUsers(context, users) {
      context.commit("setUsers", users);
    },
  }
});

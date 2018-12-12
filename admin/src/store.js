import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    vibes: [],
    user: null,
    password: null
  },
  getters: {

  },
  mutations: {
    setVibes(state, vibes) {
      state.vibes = vibes;
      if (state.openVibe) {
        state.openVibe = vibes.find(function (vibe) {
          return vibe.id === state.openVibe.id;
        });
      }
    },
    setCredentials(state, {user, pass}) {
      state.user = user;
      state.password = pass;
    }
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
    setCredentials(context, {user, pass}) {
      context.commit("setCredentials", {user, pass});
    }
  }
});
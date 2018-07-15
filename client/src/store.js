import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fbDetails: null,
    socketConnected: false,
    location: null,
    vibes: {}
  },
  getters: {
    myLocation: state => {
      return state.location
    },
    fbDetails: state => {
      return state.fbDetails
    }
  },
  mutations: {
    setFbDetails: (state, fbDetails) => {
      state.fbDetails = fbDetails;
    },
    updateLocation: (state, location) => {
      console.log(location);
      state.location = location;
    },
    setVibes(state, vibes) {
      state.vibes = vibes;
      console.log(vibes);
    },
    newVibe(state, vibe) {
      debugger;
      this._vm.$set(state.vibes, vibe._id, vibe);
      console.log(state.vibes);
    }
  },
  actions: {
    setVibes(context, vibesArray) {
      new Promise(function (res, rej) {
        var vibes = {};
        vibesArray.forEach(vibe => {
          vibes[vibe._id] = vibe;
        });
        res(vibes);
      }).then(vibes => {
        context.commit('setVibes', vibes);
      });
    }
  }
})

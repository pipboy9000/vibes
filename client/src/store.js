import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fbDetails: null,
    socketConnected: false,
    location: null,
    vibes: null
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
      state.location = location;
    },
    setVibes(state, vibes) {
      state.vibes = vibes;
    },
    SOCKET_CONNECTED: (state, vibes) => {
      console.log('socket connected');
      state.socketConnected = true;
    }
  },
  actions: {}
})

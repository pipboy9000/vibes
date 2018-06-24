import Vue from 'vue';
import Vuex from 'vuex';
import {
  stat
} from 'fs';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    connected: false,
    location: null,
    vibes: null
  },
  getters: {
    myLocation: state => {
      return state.location
    }
  },
  mutations: {
    updateLocation: (state, location) => {
      state.location = location;
    },
    setVibes(state, vibes) {
      state.vibes = vibes;
    },
    SOCKET_CONNECTED: (state, vibes) => {
      console.log('socket connected');
      state.connected = true;
    }
  },
  actions: {}
})

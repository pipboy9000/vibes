import Vue from 'vue';
import Vuex from 'vuex';
import socket from './services/socket';

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
    },
    token: state => {
      if (state.fbDetails)
        return state.fbDetails.authResponse.accessToken
      return null;
    }
  },
  mutations: {
    setFbDetails: (state, fbDetails) => {
      state.fbDetails = fbDetails;
      //update server with location after login
      if (state.location) {
        var me = {
          token: fbDetails.authResponse.accessToken,
          location: state.location
        }
        socket.update(me);
      }
    },
    updateLocation: (state, location) => {
      state.location = location;
      if (state.fbDetails) {
        var me = {
          token: state.fbDetails.authResponse.accessToken,
          location: location
        }
        socket.update(me);
      }
    },
    setVibes(state, vibes) {
      state.vibes = vibes;
    },
    newVibe(state, vibe) {
      this._vm.$set(state.vibes, vibe._id, vibe);
    }
  },
  actions: {
    updateLocation(context, location) {
      if (context.state.fbDetails) {
        var me = {
          token: context.state.fbDetails.authResponse.accessToken,
          location: location
        }
        context.commit('updateLocation', location);
        socket.update(me);
      }
    },
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

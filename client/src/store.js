import Vue from 'vue';
import Vuex from 'vuex';
import socket from './services/socket';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fbDetails: null,
    socketConnected: false,
    location: null,
    vibes: null,
    users: null
  },
  getters: {
    fbDetails: state => {
      return state.fbDetails
    },
    token: state => {
      if (state.fbDetails)
        return state.fbDetails.authResponse.accessToken
      return null;
    },
    fbid: state => {
      if (state.fbDetails)
        return state.fbDetails.authResponse.userID
      return null;
    }
  },
  mutations: {
    setLocation: (state, location) => {
      state.location = location;
    },
    setFbDetails: (state, fbDetails) => {
      state.fbDetails = fbDetails;
    },
    setVibes(state, vibes) {
      state.vibes = vibes;
    },
    newVibe(state, vibe) {
      this._vm.$set(state.vibes, vibe._id, vibe);
    },
    setUsers(state, users) {
      state.users = users;
    }
  },
  actions: {
    setFbDetails: (context, fbDetails) => {
      context.commit('setFbDetails', fbDetails);
      if (context.state.location && fbDetails != null) {
        var me = {
          token: fbDetails.authResponse.accessToken,
          location: context.state.location
        }
        socket.update(me);
      }
    },
    setLocation(context, location) {
      context.commit('setLocation', location);
      if (context.state.fbDetails) {
        var me = {
          token: context.state.fbDetails.authResponse.accessToken,
          location: location
        }
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
    },
    setUsers(context, users) {
      context.commit('setUsers', users);
    }
  }
})

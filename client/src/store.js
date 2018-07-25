import Vue from 'vue';
import Vuex from 'vuex';
import socket from './services/socket';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loginDetails: null,
    userDetails: null,
    location: null,
    vibes: null,
    users: null
  },
  getters: {
    loginDetails: state => {
      return state.loginDetails
    },
    token: state => {
      if (state.loginDetails)
        return state.loginDetails.authResponse.accessToken
      return null;
    },
    fbid: state => {
      if (state.loginDetails)
        return state.loginDetails.authResponse.userID
      return null;
    },
    me: state => {
      if (state.loginDetails && state.location && state.userDetails) {
        return {
          name: state.userDetails.name,
          fbid: state.loginDetails.authResponse.userID,
          token: state.loginDetails.authResponse.accessToken,
          location: state.location
        }
      }
      return null;
    }
  },
  mutations: {
    setLocation: (state, location) => {
      state.location = location;
    },
    setLoginDetails: (state, loginDetails) => {
      state.loginDetails = loginDetails;
    },
    setUserDetails: (state, userDetails) => {
      state.userDetails = userDetails;
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
    setLoginDetails: (context, loginDetails) => {
      context.commit('setLoginDetails', loginDetails);
      if (context.getters.me) {
        socket.update(context.getters.me);
      }
    },
    setUserDetails: (context, userDetails) => {
      context.commit('setUserDetails', userDetails);
      if (context.getters.me) {
        socket.update(context.getters.me);
      }
    },
    setLocation(context, location) {
      context.commit('setLocation', location);
      if (context.getters.me) {
        socket.update(context.getters.me);
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

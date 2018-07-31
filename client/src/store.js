import Vue from 'vue';
import Vuex from 'vuex';
import socket from './services/socket';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    inVibe: null,
    loginDetails: null,
    userDetails: null,
    location: null,
    serverLocation: null, //user location on server
    vibes: {},
    users: []
  },
  getters: {
    serverLocation: state => {
      return state.serverLocation;
    },
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
    inVibe: state => {
      return state.inVibe;
    },
    name: state => {
      if (state.userDetails)
        return state.userDetails.name;
      return null
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
    setServerLocation: (state, user) => {
      state.serverLocation = user.location;
    },
    setLoginDetails: (state, loginDetails) => {
      state.loginDetails = loginDetails;
    },
    setUserDetails: (state, userDetails) => {
      state.userDetails = userDetails;
    },
    setUser: (state, user) => {
      state.inVibe = user.inVibe;
      state.serverLocation = user.location;
    },
    setVibes(state, vibes) {
      state.vibes = vibes;
    },
    newVibe(state, vibe) {
      debugger;
      this._vm.$set(state.vibes, vibe._id, vibe);
      state.inVibe = vibe._id;
    },
    setUsers(state, users) {
      state.users = users;
    },
    setInVibe(id) {
      state.inVibe = id;
    }
  },
  actions: {
    setLoginDetails: (context, loginDetails) => {
      context.commit('setLoginDetails', loginDetails);
    },
    setUserDetails: (context, userDetails) => {
      context.commit('setUserDetails', userDetails);
      if (context.getters.me) {
        socket.login(context.getters.me);
      }
    },
    setUser: (context, user) => {
      context.commit('setUser', user);
    },
    setLocation(context, location) {
      context.commit('setLocation', location);
      if (context.getters.me) {
        socket.updateLocation(context.getters.me);
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

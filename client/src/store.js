import Vue from 'vue';
import Vuex from 'vuex';
import socket from './services/socket';

Vue.use(Vuex);



export default new Vuex.Store({
  state: {
    inVibe: null,
    loginDetails: null,
    userDetails: null,
    selectedVibe: null,
    location: null,
    serverLocation: undefined, //user location on server
    vibes: [],
    users: [],
    loggedIn: false
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
    setSelectedVibe: (state, vibe) => {
      state.selectedVibe = vibe
    },
    setLocation: (state, location) => {
      state.location = location;
      //calculate distances
      for (var id in state.vibes) {
        var vibe = state.vibes[id];
        var myLocation = new google.maps.LatLng(location.lat, location.lng);
        var vibeLocation = new google.maps.LatLng(vibe.location.lat, vibe.location.lng);
        var distance = google.maps.geometry.spherical.computeDistanceBetween(myLocation, vibeLocation);
        vibe.distance = distance;
      }
    },
    setServerLocation: (state, user) => {
      state.serverLocation = user.location;
      state.inVibe = user.inVibe;
    },
    setLoginDetails: (state, loginDetails) => {
      state.loginDetails = loginDetails;
    },
    setUserDetails: (state, userDetails) => {
      state.userDetails = userDetails;
    },
    setUser: (state, user) => {
      state.loggedIn = true;
      state.inVibe = user.inVibe;
      state.serverLocation = user.location;
    },
    setVibes(state, vibes) {
      state.vibes = vibes;
    },
    newVibe(state, vibe) {
      if (state.location) {
        var myLocation = new google.maps.LatLng(state.location.lat, state.location.lng);
        var vibeLocation = new google.maps.LatLng(vibe.location.lat, vibe.location.lng);
        var distance = google.maps.geometry.spherical.computeDistanceBetween(myLocation, vibeLocation);
        vibe.distance = distance;
      }
      state.vibes.push(vibe);
      state.inVibe = vibe._id;
    },
    setUsers(state, users) {
      state.users = users;
    },
    setInVibe(id) {
      state.inVibe = id;
    },
    setComments(state, {
      comments,
      vibeId
    }) {
      state.vibes[vibeId].comments = comments;
      if (state.selectedVibe._id === vibeId)
        state.selectedVibe.comments = comments;
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
      if (context.state.location && context.getters.me) {
        socket.updateLocation({
          location: context.state.location,
          token: context.getters.token
        });
      }
    },
    setLocation(context, location) {
      context.commit('setLocation', location);
      if (context.state.loggedIn && context.getters.me) {
        socket.updateLocation({
          location: context.state.location,
          token: context.getters.token
        });
      }
    },
    setVibes(context, vibesArray) {
      new Promise(function (res, rej) {
        vibesArray.forEach(vibe => {
          if (context.getters.me) {
            var myLocation = new google.maps.LatLng(context.getters.me.location.lat, context.getters.me.location.lng)
            var vibeLocation = new google.maps.LatLng(vibe.location.lat, vibe.location.lng);
            var distance = google.maps.geometry.spherical.computeDistanceBetween(myLocation, vibeLocation);
            vibe.distance = distance;
          }
        });
        vibesArray.sort(function (a, b) {
          return a.distance - b.distance;
        });
        res(vibesArray);
      }).then(vibes => {
        context.commit('setVibes', vibes);
      });
    },
    setUsers(context, users) {
      context.commit('setUsers', users);
    }
  }
})

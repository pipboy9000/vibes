import Vue from "vue";
import Vuex from "vuex";
import socket from "./services/socket";

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
      return state.loginDetails;
    },
    token: state => {
      if (state.loginDetails)
        return state.loginDetails.authResponse.accessToken;
      return null;
    },
    fbid: state => {
      if (state.loginDetails) return state.loginDetails.authResponse.userID;
      return null;
    },
    inVibe: state => {
      return state.inVibe;
    },
    name: state => {
      if (state.userDetails) return state.userDetails.name;
      return null;
    },
    me: state => {
      if (state.loginDetails && state.location && state.userDetails) {
        return {
          name: state.userDetails.name,
          fbid: state.loginDetails.authResponse.userID,
          token: state.loginDetails.authResponse.accessToken,
          location: state.location
        };
      }
      return null;
    }
  },
  mutations: {
    setSelectedVibe: (state, vibe) => {
      state.selectedVibe = vibe;
    },
    setLocation: (state, location) => {
      state.location = location;
      //calculate distances
      for (var id in state.vibes) {
        var vibe = state.vibes[id];
        var myLocation = new google.maps.LatLng(location.lat, location.lng);
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
    },
    setServerLocation: (state, location) => {
      state.serverLocation = location;
    },
    setInVibe(state, id) {
      state.inVibe = id;
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
      if (state.selectedVibe) {
        state.selectedVibe = vibes.find(function (vibe) {
          return vibe.id === state.selectedVibe.id;
        });
      }
    },
    newVibe(state, vibe) {
      if (state.location) {
        var myLocation = new google.maps.LatLng(
          state.location.lat,
          state.location.lng
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
      state.vibes.push(vibe);
      state.vibes.sort(function (a, b) {
        return a.distance - b.distance;
      })
      state.inVibe = vibe.id;
    },
    setUsers(state, users) {
      state.users = users;
    },
    setComments(state, {
      comments,
      vibeId
    }) {
      var v = state.vibes.find(function (vibe) {
        return vibe.id === vibeId;
      });

      if (v) {
        v.comments = comments;
      }

      if (state.selectedVibe.id === vibeId)
        state.selectedVibe.comments = comments;
    },
    setPictures(state, {
      vibeId,
      pictures
    }) {
      var v = state.vibes.find(function (vibe) {
        return vibe.id === vibeId
      });

      if (v)
        v.pictures = pictures;

      if (state.selectedVibe.id === vibeId)
        state.selectedVibe.pictures = pictures;
    },
    addUser(state, {
      vibeId,
      fbid
    }) {
      var vibe = state.vibes.find(function (v) {
        return v.id === vibeId
      });
      vibe.users.push(fbid);
    },
    leaveVibe(state) {
      state.inVibe = "";
    }
  },
  actions: {
    login: (context, data) => {
      context.commit("setUser", data.user);
      context.commit("setUsers", data.users);
      context.dispatch("setVibes", data.vibes);
      if (context.state.location && context.getters.me) {
        socket.updateLocation({
          location: context.state.location,
          token: context.getters.token
        });
      }
    },
    setData(context, data) {
      if (data.hasOwnProperty("users")) {
        context.commit("setUsers", data.users);
      }

      if (data.hasOwnProperty("vibes")) {
        context.dispatch("setVibes", data.vibes);
      }

      if (data.hasOwnProperty("comments")) {
        for (var vibeId in data.comments) {
          context.commit("setComments", {
            vibeId,
            comments: data.comments[vibeId]
          });
        }
      }

      if (data.hasOwnProperty("pictures")) {
        debugger;
        for (var vibeId in data.pictures) {
          context.commit("setPictures", {
            vibeId,
            pictures: data.pictures[vibeId]
          });
        }
      }
    },
    setServerLocation: (context, user) => {
      if (context.state.users.length > 0) {
        var me = context.state.users.find(function (u) {
          return u.fbid === user.fbid
        });
        if (me) {
          me.inVibe = user.inVibe;
          me.location = user.location;
        }
      }

      context.commit('setServerLocation', user.location);
      context.commit('setInVibe', user.inVibe);
    },
    newVibe: (context, vibe) => {
      //remove from old vibe
      if (context.state.inVibe) {
        let vibe = context.state.vibes.find(function (v) {
          return v.id === context.state.inVibe
        });
        if (vibe) {
          var removeIdx = vibe.users.indexOf(context.getters.fbid);
          vibe.users.splice(removeIdx, 1);
        }
      }
      context.commit("newVibe", vibe);
      context.commit("setInVibe", vibe.id);
    },
    setComments: (context, comments) => {
      context.commit("setComments", comments);
    },
    setPictures: (context, pictures) => {
      context.commit("setComments", pictures);
    },
    setLoginDetails: (context, loginDetails) => {
      console.log("in store.js setLoginDetails. printing loginDetails and context:")
      console.dir(loginDetails)
      console.dir(context)
      context.commit("setLoginDetails", loginDetails);
      if (context.getters.me) {
        console.log("calling socket.login. context.getters.me:")
        console.dir(context.getters.me)
        socket.login(context.getters.me);
      } else {
        console.log(context.state)
      }
    },
    setUserDetails: (context, userDetails) => {
      console.log("in store.js setUserDetails. printing userDetails and context:")
      console.dir(userDetails)
      console.dir(context)
      context.commit("setUserDetails", userDetails);

      console.log(context.state.loginDetails);
      console.log(context.state.location);
      console.log(context.state.userDetails);
      if (context.getters.me) {
        console.log("calling socket.login. context.getters.me:")
        console.dir(context.getters.me)
        socket.login(context.getters.me);
      }
    },
    setLocation(context, location) {
      context.commit("setLocation", location);
      if (context.state.loggedIn) {
        if (context.getters.me) {
          socket.updateLocation({
            location: context.state.location,
            token: context.getters.token
          });
        }
      } else if (context.getters.me) {
        socket.login(context.getters.me);
      }

      context.dispatch("calculateDistances", context.state.vibes).then(sorted => {
        context.commit("setVibes", sorted);
      })
    },
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
    setVibes(context, vibesArray) {
      context.dispatch("calculateDistances", vibesArray).then(sorted => {
        context.commit("setVibes", sorted);
      });
    },
    setUsers(context, users) {
      context.commit("setUsers", users);
    },

    joinVibe(context, vibeId) {
      //remove from old vibe
      if (context.state.inVibe) {
        var vibe = context.state.vibes.find(function (v) {
          return v.id === context.state.inVibe
        });
        var removeIdx = vibe.users.indexOf(context.getters.fbid);
        if (removeIdx != -1)
          vibe.users.splice(removeIdx, 1);
      }

      var vibe = context.state.vibes.find(function (v) {
        return v.id === vibeId
      });
      context.commit("addUser", {
        vibeId,
        fbid: context.getters.fbid
      });
      context.commit("setInVibe", vibeId)
    },

    leaveVibe(context) {
      context.commit("leaveVibe");
    }
  }
});

import store from '../store.js';

var watchID;
var mockX = 32.090032199999996;
var mockY = 34.768544399999996;

function getLocation() {
  navigator.geolocation.getCurrentPosition(function (location) {
    store.commit('updateLocation', location);
  }, function (err) {
    console.log(err);
  }, {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  });
}

var count = 0;

function watchLocation() {
  //for development
  if (process.env.NODE_ENV == 'development') {
    store.dispatch('setLocation', {
        lat: mockX,
        lng: mockY
      });
  } else {
    watchID = navigator.geolocation.watchPosition(function (location) {
      var loc = {
        lat: location.coords.latitude,
        lng: location.coords.longitude
      }
      store.dispatch('setLocation', loc);
    }, function (err) {
      console.error(err);
    }, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  }

  // watchID = setInterval(function (idx) {
  //   mockX += Math.random() / 5000;
  //   mockY += Math.random() / 5000;

  //   store.dispatch('setLocation', {
  //     lat: mockX,
  //     lng: mockY
  //   });
  // }, 15000);
};

function stopWatch() {
  if (watchID) navigator.geolocation.clearWatch(watchID);
}

function init() {
  watchLocation();
}

// init();

export default {
  getLocation,
  watchLocation,
  stopWatch,
  init
}

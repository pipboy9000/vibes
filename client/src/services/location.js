import store from '../store.js';

var watchID;
var mockX = 32.090032199999996;
var mockY = 34.768544399999996;

function getLocation() {
  navigator.geolocation.getCurrentPosition(function (location) {
    store.commit('updateLocation', location);
  }, function (err) {
    console.log(err);
  }, null, {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  });
}

var count = 0;

function watchLocation() {
  //for development
  store.dispatch('setLocation', {
    lat: mockX,
    lng: mockY
  });

  watchID = setInterval(function (idx) {
    mockX += Math.random() / 5000;
    mockY += Math.random() / 5000;

    store.dispatch('setLocation', {
      lat: mockX,
      lng: mockY
    });
  }, 7500);

  // watchID = navigator.geolocation.watchPosition(function (location) {
  //   var loc = {
  //     lat: location.coords.latitude,
  //     lng: location.coords.longitude
  //   }
  //   store.dispatch('setLocation', loc);
  // }, function (err) {
  //   console.log(err);
  // }, null, {
  //   enableHighAccuracy: true,
  //   timeout: 5000,
  //   maximumAge: 0
  // });
};

function stopWatch() {
  navigator.geolocation.clearWatch(watchID);
}

function init() {
  watchLocation();
}

init();

export default {
  getLocation,
  watchLocation,
  stopWatch
}

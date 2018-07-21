import store from '../store.js';

var watchID;

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

function watchLocation() {
  //for development
  setTimeout(function () {
    store.dispatch('setLocation', {
      lat: 32.090032199999996 + Math.random(),
      lng: 34.768544399999996 + Math.random()
    })
  }, 1000);
  // watchID = setInterval(function () {
  //   store.dispatch('setLocation', {
  //     lat: 32.090032199999996 + Math.random(),
  //     lng: 34.768544399999996 + Math.random()
  //   });
  // }, 5000);

  // watchID = navigator.geolocation.watchPosition(function (location) {
  //   store.commit('updateLocation', location);
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

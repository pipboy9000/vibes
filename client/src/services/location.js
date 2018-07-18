import store from '../store.js';

var watchID;

function getLocation() {
  navigator.geolocation.getCurrentPosition(function (position) {
    store.commit('updateLocation', position);
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
  watchID = setInterval(function () {
    var position = {
      lat: 32.090032199999996,
      lng: 34.768544399999996
    }
    store.dispatch('updateLocation', position);
  }, 10000);

  // watchID = navigator.geolocation.watchPosition(function (position) {
  //   store.dispatch('updateLocation', position);
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

}

init();

export default {
  getLocation,
  watchLocation,
  stopWatch
}

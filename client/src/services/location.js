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
  watchID = navigator.geolocation.watchPosition(function (position) {
    store.commit('updateLocation', position);
  }, function (err) {
    console.log(err);
  }, null, {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  });
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

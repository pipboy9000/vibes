// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store';
import socketio from 'socket.io-client'
import VueSocketio from 'vue-socket.io';
import * as VueGoogleMaps from 'vue2-google-maps';

Vue.config.productionTip = false;

Vue.use(VueSocketio, socketio('localhost:3000'), store);
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyABHtsig9fZgft0GylpF4Pt3BywI0R_J-c',
    libraries: 'places'
  }
});

new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})

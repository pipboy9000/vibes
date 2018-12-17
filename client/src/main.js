// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store';
import VueCordova from 'vue-cordova'
import VueFire from 'vuefire'
import firebase from 'firebase'
// import * as VueGoogleMaps from 'vue2-google-maps'

// Vue.use(VueGoogleMaps, {
//   load: {
//     key: 'AIzaSyABHtsig9fZgft0GylpF4Pt3BywI0R_J-c',
//     libraries: 'places',
//     disableDefaultUI: true
//   }
// });

//fontawesome
import {
  library
} from '@fortawesome/fontawesome-svg-core'
import {
  faBars
} from '@fortawesome/free-solid-svg-icons'
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'

library.add(faBars);
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false;
Vue.use(VueCordova)
Vue.use(VueCordova, {
  optionTestKey: 'optionTestValue'
})

Vue.use(VueFire)

// TODO: move to config
const fbConfig = {
  apiKey: "AIzaSyBZMsNwP9iJ8UlthPPSQtI7fNgYkl2KH9o",
  authDomain: "agents-802b1.firebaseapp.com",
  databaseURL: "https://agents-802b1.firebaseio.com",
  projectId: "agents-802b1",
  storageBucket: "gs://agents-802b1.appspot.com",
  messagingSenderId: "147558985153",
};

const firebaseApp = firebase.initializeApp(fbConfig)
const firebaseDb = firebaseApp.database()
const firebaseStorage = firebaseApp.storage().ref('/pics')

new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>',
  data: function () {
    return {
      cordova: Vue.cordova,
      firebaseStorage: firebaseStorage,
      firebase: firebase
    }
  }
})

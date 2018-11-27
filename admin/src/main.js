import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueMaterial from 'vue-material'
// import './assets/theme.scss'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.config.productionTip = false

Vue.use(VueMaterial)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
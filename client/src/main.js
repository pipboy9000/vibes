// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store';
import VueCordova from 'vue-cordova'
import VueFire from 'vuefire'
import firebase from 'firebase'

Vue.config.productionTip = false;
Vue.use(VueCordova)
Vue.use(VueCordova, {
  optionTestKey: 'optionTestValue'
})

Vue.use(VueFire)

// TODO: move to config
const config = {
  apiKey: "AIzaSyBZMsNwP9iJ8UlthPPSQtI7fNgYkl2KH9o",
  authDomain: "agents-802b1.firebaseapp.com",
  databaseURL: "https://agents-802b1.firebaseio.com",
  projectId: "agents-802b1",
  storageBucket: "gs://agents-802b1.appspot.com",
  messagingSenderId: "147558985153",
};

const firebaseApp = firebase.initializeApp(config)
const firebaseDb = firebaseApp.database()
const firebaseStorage = firebaseApp.storage().ref('/pics')
// const firestoreDb = firebase.firestore()
// firestoreDb.settings({timestampsInSnapshots: true});

// firebaseDb.ref('chatrooms/-LIRUd7IHbVUZ1aT0uhc/chats').on('value', resp => {
//   chatsArr = [];
//   chatsArr = snapshotToArray(resp);
// });

// var snapshotToArray = snapshot => {
//   let returnArr = [];

//   snapshot.forEach(childSnapshot => {
//       let item = childSnapshot.val();
//       if (item == '') {
//         console.log("empty item");
//       }
//       item.key = childSnapshot.key;
//       returnArr.push(item);
//   });

//   return returnArr;
// };

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
      firebase: firebase,
      // },
      // firestore: {
      //   pics: firestoreDb.collection('pics'),
      //   db: firestoreDb
      //   //currentTodo: firestoreDb.collection('todos').doc('1')
      // }
    }
  }
})

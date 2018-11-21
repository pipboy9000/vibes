<template>
  <div class="hello">
    <div>
      Lng:<input type="text" v-model="lng"><br/>
      Lat:<input type="text" v-model="lat"><br/>
      Vibe title:<input type="text" v-model="title"><br/>
      Date and time:<datetime type="datetime" v-model="date"></datetime><br/>
      <button @click="save">Save</button><br/>

      <div v-if="response">
        <div v-if="operationStatus == 'success'" class="success">
          Operation succeeded.<br/>
          Vibe ID: {{response.data.vibeId}}
        </div>
        <div v-if="operationStatus == 'failure'" class="failure">
          Operation Failed.<br/>
          {{response}}
        </div>
      </div>
      <div v-if="waiting">
        Waiting for server...
      </div>
    </div>
    <Map></Map>
  </div>
</template>

<script>
const axios = require('axios');
import { Datetime } from 'vue-datetime'
import Map from "./map";
import { EventBus } from "../../../client/src/event-bus.js";
import 'vue-datetime/dist/vue-datetime.css'

export default {
  name: 'Dashboard',
  components: {
    Map,
    datetime: Datetime
  },
  data() {
    return {
      title: "Happy Hour in...",
      lng: 0,
      lat: 0,
      date: new Date().toISOString(),
      operationStatus: null,
      response: null,
      waiting: false
    }
  },
  mounted() {
    EventBus.$on("mapClicked", this.locationSelected);
  },
  methods: {
    locationSelected(location) {
      this.lng = location.lng;
      this.lat = location.lat;
    },
    save() {
      this.waiting = true;
      this.response = null;
      axios.get('/save-vibe', {
        params: {
          title: this.title,
          lng: this.lng,
          lat: this.lat,
          date: this.date
        } 
      }).then(response => {
        this.waiting = false;
        if (response.status == 200) {
          this.operationStatus = "success"
          debugger;
        } else {
          this.operationStatus = "failure"
        }
        this.response = response
      }, err => {
        this.waiting = false;
        this.operationStatus = "failure"
        this.response = "Error. Did you run admin/server.js? " + err.toString()
      });
    }
  }
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.success {
  color: green;
}
.failure {
  color: red;
}
</style>

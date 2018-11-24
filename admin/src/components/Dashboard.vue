<template>
  <div class="hello">
    <div>
      Lng:<input type="text" v-model="lng"><br/>
      Lat:<input type="text" v-model="lat"><br/>
      Vibe title:<input type="text" v-model="title"><br/>
      Date and time:<datetime type="datetime" v-model="date"></datetime><br/>
      Recurring:<input type="checkbox" v-model="isRecurring">
      <div v-if="isRecurring">
      <button @click="selectAllDays">Select All</button>
      <button @click="selectNoDays">Select None</button><br/>
      <span v-for="(day, idx) in daysRecurring" :key="idx">
        {{day.name}}:<input type="checkbox" v-model="day.recurring">
      </span>
      </div>
      <br/>
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
      lng: 1,
      lat: 1,
      date: new Date().toISOString(),
      operationStatus: null,
      response: null,
      waiting: false,
      isRecurring: false,
      daysRecurring: [
          {
            name:'Sunday',
            recurring: false
          },
          {
            name:'Monday',
            recurring: false
          },
          {
            name:'Tuesday',
            recurring: false
          },
          {
            name:'Wednesday',
            recurring: false
          },
          {
            name:'Thursday',
            recurring: false
          },
          {
            name:'Friday',
            recurring: false
          },
          {
            name:'Saturday',
            recurring: false
          },
      ]
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
    selectAllDays() {
      this.daysRecurring.forEach(day => day.recurring = true)
    },
    selectNoDays() {
      this.daysRecurring.forEach(day => day.recurring = false)
    },
    save() {
      this.waiting = true;
      this.response = null;
      const serverUrl = process.env.NODE_ENV === 'production' ? '/save-vibe' : 'http://localhost:3030/save-vibe'
      let mappedDays = this.isRecurring ? this.daysRecurring.map(day => day.recurring ? 1 : 0) : null
      axios.get(serverUrl, {
        params: {
          title: this.title,
          lng: this.lng,
          lat: this.lat,
          date: this.date,
          isRecurring: this.isRecurring,
          daysRecurring: mappedDays
        } 
      }).then(response => {
        this.waiting = false;
        if (response.status == 200) {
          this.operationStatus = "success"
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

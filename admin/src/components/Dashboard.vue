<template>
  <div>
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-50 md-small-size-100">
        <md-card-header>
          <div class="md-title">New Vibe</div>
        </md-card-header>

        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('vibeName')">
                <label for="vibe-name">Vibe Title</label>
                <md-input name="vibe-name" id="vibe-name" v-model="form.vibeName" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.vibeName.required">Required</span>
                <span class="md-error" v-else-if="!$v.form.vibeName.minlength">Too short</span>
              </md-field>
            </div>
          </div>

          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('date')">
                <md-icon>event</md-icon>
                <label for="vibe-date">When?</label>
                <md-input name="vibe-date" id="vibe-date" :disabled="true" />
                <datetime type="datetime" v-model="form.date" input-id="vibe-date">
                </datetime>
              </md-field>
            </div>
          </div>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending">Create user</md-button>
        </md-card-actions>
      </md-card>

      <md-snackbar :md-active.sync="userSaved">The user {{ lastUser }} was saved with success!</md-snackbar>
    </form>
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
import { validationMixin } from 'vuelidate'
import {
    required,
    minLength,
    maxLength
} from 'vuelidate/lib/validators'


export default {
  name: 'Dashboard',
  mixins: [validationMixin],
  components: {
    Map,
    datetime: Datetime
  },
  validations: {
      form: {
        vibeName: {
          required,
          minLength: minLength(3)
        },
        lastName: {
          required,
          minLength: minLength(3)
        },
        date: {
          required
        }
      }
    },
  data() {
    return {
      form: {
        vibeName: null,
        lastName: null,
        date: new Date().toISOString(),
      },
      userSaved: false,
      sending: false,
      lastUser: null,
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
    getValidationClass (fieldName) {
        const field = this.$v.form[fieldName]

        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },
      clearForm () {
        this.$v.$reset()
        this.form.vibeName = null
        this.form.lastName = null
        this.form.date = new Date().toISOString()
      },
      saveUser () {
        this.sending = true

        // Instead of this timeout, here you can call your API
        window.setTimeout(() => {
          //this.lastUser = `${this.form.vibeName} ${this.form.lastName}`
          this.userSaved = true
          this.sending = false
          this.clearForm()
        }, 1500)
      },
      validateUser () {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          this.saveUser()
        }
      },
    locationSelected(e) {
      this.title = `Happy Hour in ${e.placeName}`;
      this.lng = e.lng;
      this.lat = e.lat;
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
          title: this.form.vibeName,
          lng: this.lng,
          lat: this.lat,
          date: this.form.date,
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

<style lang="scss" scoped>
  .md-progress-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }
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

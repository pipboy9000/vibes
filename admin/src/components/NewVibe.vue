<template>
  <div>
    <form>
      <v-text-field
        v-model="form.vibeName"
        :error-messages="nameErrors"
        :counter="10"
        label="Vibe Title"
        required
        :disabled="sending"
        @input="$v.form.vibeName.$touch()"
        @blur="$v.form.vibeName.$touch()"
      ></v-text-field>
      <v-text-field
        v-model="form.lat"
        label="Lat"
        required
        :disabled="sending"
        @input="$v.form.lat.$touch()"
        @blur="$v.form.lat.$touch()"
      ></v-text-field>
      <v-text-field
        v-model="form.lng"
        label="Lng"
        required
        :disabled="sending"
        @input="$v.form.lng.$touch()"
        @blur="$v.form.lng.$touch()"
      ></v-text-field>
      <v-layout row wrap>
        
        <v-flex xs12 sm6 md4>
          <v-menu
            ref="dateMenu"
            :close-on-content-click="false"
            v-model="form.dateMenu"
            :nudge-right="40"
            :return-value.sync="form.date"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <v-text-field
              slot="activator"
              v-model="form.date"
              label="Date"
              prepend-icon="event"
              readonly
            ></v-text-field>
            <v-date-picker v-model="form.date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.dateMenu.save(form.date)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-flex>

        <v-flex xs12 sm6 md4>
          <v-menu
            ref="timeMenu"
            :close-on-content-click="false"
            v-model="form.timeMenu"
            :nudge-right="40"
            :return-value.sync="form.time"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            max-width="290px"
            min-width="290px"
          >
            <v-text-field
              slot="activator"
              v-model="form.time"
              label="Time"
              prepend-icon="access_time"
              readonly
            ></v-text-field>
            <v-time-picker
              v-if="form.timeMenu"
              v-model="form.time"
              full-width
              format="24hr"
              @change="$refs.timeMenu.save(form.time)"
            ></v-time-picker>
          </v-menu>
        </v-flex>
      </v-layout>

      <!--
              <div class="md-layout">
                <div class="md-alignment-top-left">
                  <md-checkbox v-model="form.isRecurring">Recurring</md-checkbox>
                </div>
              </div>
              <div v-if="form.isRecurring">
                <div class="md-layout">
                  <md-button class="md-primary" @click="selectAllDays">All</md-button>
                  <md-button class="md-primary" @click="selectNoDays">None</md-button>
                </div>
                <div class="md-layout">
                  <md-button
                    v-for="(day, idx) in form.daysRecurring"
                    :key="idx"
                    class="md-icon-button md-raised"
                    @click="toggleDay(idx)"
                    v-bind:class="{ 'md-primary': day.recurring }"
                  >{{day.name}}</md-button>
                  </div>
      </div>-->
      <v-btn @click="validateVibe()">Save vibe</v-btn>
      <v-btn @click="clearForm">clear</v-btn>
      <v-progress-linear v-if="sending" color="primary" indeterminate></v-progress-linear>
      <v-snackbar v-model="operationReturned" left>{{response}}</v-snackbar>
    </form>
  </div>
</template>

<script>
const axios = require("axios");
import { Datetime } from "vue-datetime";
import { EventBus } from "../../../client/src/event-bus.js";
import "vue-datetime/dist/vue-datetime.css";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
  name: "NewVibe",
  mixins: [validationMixin],
  components: {
    Map,
    datetime: Datetime
  },
  data() {
    return {
      form: {
        time: null,
        dateMenu: false,
        timeMenu: false,
        vibeName: null,
        lastName: null,
        date: new Date().toISOString().substr(0, 10),
        lat: null,
        lng: null,
        isRecurring: false,
        daysRecurring: [
          {
            name: "S",
            recurring: false
          },
          {
            name: "M",
            recurring: false
          },
          {
            name: "T",
            recurring: false
          },
          {
            name: "W",
            recurring: false
          },
          {
            name: "T",
            recurring: false
          },
          {
            name: "F",
            recurring: false
          },
          {
            name: "S",
            recurring: false
          }
        ]
      },
      operationReturned: false,
      sending: false,
      lastUser: null,
      operationStatus: null,
      response: null
    };
  },
  validations: {
    form: {
      vibeName: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(10)
      },
      lat: {
        required
      },
      lng: {
        required
      },
      date: {
        required
      }
    }
  },
  mounted() {
    EventBus.$on("mapClicked", this.locationSelected);
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.form.vibeName.$dirty) return errors;
      !this.$v.form.vibeName.maxLength &&
        errors.push("Title must be at most 10 characters long");
      !this.$v.form.vibeName.required && errors.push("Title is required.");
      return errors;
    }
  },
  methods: {
    toggleDay(idx) {
      this.form.daysRecurring[idx].recurring = !this.form.daysRecurring[idx]
        .recurring;
    },
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.form.vibeName = null;
      this.form.lastName = null;
      this.form.lat = null;
      this.form.lng = null;
      this.form.date = new Date().toISOString();
      this.form.isRecurring = false;
    },
    validateVibe() {
      debugger;
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.saveVibe();
      }
    },
    locationSelected(e) {
      this.form.vibeName = `Happy Hour in ${e.placeName}`;
      this.form.lng = e.lng;
      this.form.lat = e.lat;
    },
    selectAllDays() {
      this.form.daysRecurring.forEach(day => (day.recurring = true));
    },
    selectNoDays() {
      this.form.daysRecurring.forEach(day => (day.recurring = false));
    },
    saveVibe() {
      this.sending = true;
      this.response = null;
      this.operationStatus = null;
      let mappedDays = this.form.isRecurring
        ? this.form.daysRecurring.map(day => (day.recurring ? 1 : 0))
        : null;
      const serverUrl =
        process.env.NODE_ENV === "production"
          ? "/save-vibe"
          : "http://localhost:3030/save-vibe";
      axios
        .get(serverUrl, {
          params: {
            title: this.form.vibeName,
            lng: this.form.lng,
            lat: this.form.lat,
            date: this.form.date,
            isRecurring: this.form.isRecurring,
            daysRecurring: this.form.isRecurring ? mappedDays : []
          }
        })
        .then(
          response => {
            this.sending = false;
            this.operationReturned = true;
            if (response.status == 200) {
              this.operationStatus = "success";
              this.clearForm();
              this.response = `Vibe saved. Vibe ID: ${response.data.vibeId}`;
              debugger;
              EventBus.$emit("refreshVibeList");
            } else {
              this.operationStatus = "failure";
              this.response = response;
            }
          },
          err => {
            this.sending = false;
            this.operationReturned = true;
            this.operationStatus = "failure";
            this.response = `Error. Did you run admin/server.js? ${err.toString()}`;
          }
        );
    }
  }
};
</script>

<style lang="scss" scoped>
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}
</style>

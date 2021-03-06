<template>
  <v-card class="elevation-3">
    <v-card-title primary-title>Create New Vibe
      <v-spacer></v-spacer>
      <v-btn raised icon @click="closeCard()">
        <v-icon>close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="form.valid" lazy-validation>
        <v-text-field
          v-model="form.vibeName"
          label="Vibe Title"
          required
          :rules="[v => !!v || 'Required']"
        ></v-text-field>
        <v-layout row wrap>
          <v-text-field
            v-model="form.lat"
            label="Lat"
            required
            :rules="[v => !!v || 'Required']"
            prepend-icon="place"
          ></v-text-field>
        </v-layout>
        <v-layout row wrap>
          <v-text-field
            v-model="form.lng"
            label="Lng"
            required
            :rules="[v => !!v || 'Required']"
            prepend-icon="place"
          ></v-text-field>
        </v-layout>
        <v-layout row wrap>
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
              required
              :rules="[v => !!v || 'Required']"
            ></v-text-field>
            <v-date-picker v-model="form.date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.dateMenu.save(form.date)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-layout>
        <v-layout row wrap>
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
              required
              :rules="[v => !!v || 'Required']"
            ></v-text-field>
            <v-time-picker
              v-if="form.timeMenu"
              v-model="form.time"
              full-width
              format="24hr"
              @change="$refs.timeMenu.save(form.time)"
            ></v-time-picker>
          </v-menu>
        </v-layout>
        <v-checkbox v-model="form.isRecurring" label="Recurring"></v-checkbox>
        <div v-if="form.isRecurring">
          <v-btn flat @click="selectAllDays">All</v-btn>
          <v-btn flat @click="selectNoDays">None</v-btn>
          <v-btn
            v-for="(day, idx) in form.daysRecurring"
            raised
            icon
            :key="idx"
            @click="toggleDay(idx)"
            v-bind:color="getDayColor(idx)"
          >{{day.name}}</v-btn>
        </div>

        <v-btn @click="validate()">Save vibe</v-btn>
        <v-btn @click="clearForm">clear</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
const axios = require("axios");
import { EventBus } from "../../../client/src/event-bus.js";

export default {
  name: "NewVibe",
  components: {},
  data() {
    return {
      form: {
        valid: true,
        time: null,
        dateMenu: false,
        timeMenu: false,
        vibeName: null,
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
      lastUser: null
    };
  },
  mounted() {
    EventBus.$on("mapClicked", this.locationSelected);
  },
  computed: {},
  methods: {
    closeCard() {
      EventBus.$emit("newVibeFormClosed");
    },
    toggleDay(idx) {
      this.form.daysRecurring[idx].recurring = !this.form.daysRecurring[idx]
        .recurring;
    },
    getDayColor(idx) {
      return this.form.daysRecurring[idx].recurring ? "primary" : "noraml";
    },
    clearForm() {
      this.form.vibeName = null;
      this.form.lat = null;
      this.form.lng = null;
      this.form.date = new Date().toISOString().substr(0, 10);
      this.form.time = null;
      this.form.isRecurring = false;
      this.form.valid = true;
    },
    validate() {
      if (this.$refs.form.validate()) {
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
      let mappedDays = this.form.isRecurring
        ? this.form.daysRecurring.map(day => (day.recurring ? 1 : 0))
        : null;

      EventBus.$emit("saveVibe", {
        title: this.form.vibeName,
        lng: this.form.lng,
        lat: this.form.lat,
        date: this.form.date,
        time: this.form.time,
        isRecurring: this.form.isRecurring,
        daysRecurring: this.form.isRecurring ? mappedDays : []
      });
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

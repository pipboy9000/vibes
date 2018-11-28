<template>
  <div>
    <div class="md-layout">
      <div class="md-layout-item">
        <form novalidate class="md-layout md-size-50" @submit.prevent="validateVibe">
          <md-card class="md-layout-item">
            <md-card-header>
              <div class="md-title">New Vibe</div>
            </md-card-header>

            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('vibeName')">
                    <label for="vibe-name">Vibe Title</label>
                    <md-input
                      name="vibe-name"
                      id="vibe-name"
                      v-model="form.vibeName"
                      :disabled="sending"
                    />
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
                    <md-input name="vibe-date" id="vibe-date" :disabled="true"/>
                    <datetime type="datetime" v-model="form.date" input-id="vibe-date"></datetime>
                  </md-field>
                </div>
              </div>

              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('lat')">
                    <label for="vibe-lat">Lat</label>
                    <md-input name="vibe-lat" id="vibe-lat" v-model="form.lat" :disabled="sending"/>
                    <span class="md-error" v-if="!$v.form.lat.required">Required</span>
                  </md-field>
                </div>

                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('lng')">
                    <label for="vibe-lng">Lng</label>
                    <md-input name="vibe-lng" id="vibe-lng" v-model="form.lng" :disabled="sending"/>
                    <span class="md-error" v-if="!$v.form.lng.required">Required</span>
                  </md-field>
                </div>
              </div>
              <div class="md-layout">
                <div class="md-alignment-top-left">
                  <md-checkbox v-model="form.isRecurring">Recurring</md-checkbox>
                </div>
              </div>
              <div class="md-layout">
                <div class="md-small-size-100 md-alignment-top-left" v-if="form.isRecurring">
                  <md-button class="md-primary" @click="selectAllDays">All</md-button>
                  <md-button class="md-primary" @click="selectNoDays">None</md-button>
                  <md-checkbox v-model="form.daysRecurring" value="0">Sunday</md-checkbox>
                  <md-checkbox v-model="form.daysRecurring" value="1">Monday</md-checkbox>
                  <md-checkbox v-model="form.daysRecurring" value="2">Tuesday</md-checkbox>
                  <md-checkbox v-model="form.daysRecurring" value="3">Wednesday</md-checkbox>
                  <md-checkbox v-model="form.daysRecurring" value="4">Thursday</md-checkbox>
                  <md-checkbox v-model="form.daysRecurring" value="5">Friday</md-checkbox>
                  <md-checkbox v-model="form.daysRecurring" value="6">Saturday</md-checkbox>
                </div>
              </div>
            </md-card-content>

            <md-progress-bar md-mode="indeterminate" v-if="sending"/>

            <md-card-actions>
              <md-button type="submit" class="md-primary" :disabled="sending">create vibe</md-button>
            </md-card-actions>
          </md-card>

          <md-snackbar md-position="left" :md-active.sync="operationReturned">{{response}}</md-snackbar>
        </form>
      </div>
      <div class="md-layout-item">
        <FutureVibeList></FutureVibeList>
      </div>
    </div>
    <Map></Map>
  </div>
</template>

<script>
const axios = require("axios");
import { Datetime } from "vue-datetime";
import Map from "./map";
import FutureVibeList from "@/components/FutureVibeList";
import { EventBus } from "../../../client/src/event-bus.js";
import "vue-datetime/dist/vue-datetime.css";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
  name: "Dashboard",
  mixins: [validationMixin],
  components: {
    Map,
    FutureVibeList,
    datetime: Datetime
  },
  data() {
    return {
      form: {
        vibeName: null,
        lastName: null,
        date: new Date().toISOString(),
        lat: null,
        lng: null,
        isRecurring: false,
        daysRecurring: []
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
        minLength: minLength(3)
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
  computed: {},
  methods: {
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
    },
    validateVibe() {
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
      this.form.daysRecurring = ["0", "1", "2", "3", "4", "5", "6"];
    },
    selectNoDays() {
      this.form.daysRecurring = [];
    },
    saveVibe() {
      this.sending = true;
      this.response = null;
      this.operationStatus = null;
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
            daysRecurring: this.form.isRecurring ? this.form.daysRecurring : []
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

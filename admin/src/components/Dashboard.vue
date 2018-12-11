<template>
  <v-app>
    <v-dialog v-model="deleteConfirmActive" width="500">
      <v-card>
        <v-card-title class="headline">Are you sure you want to delete?</v-card-title>
        <v-card-text>This will stop the vibe from being created again</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click="deleteConfirmActive = false">Cancel</v-btn>
          <v-btn color="green darken-1" flat="flat" @click="deleteFutureVibe">Delete Vibe</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-navigation-drawer
      v-model="drawer"
      width="400"
      floating
      app
      mobile-break-point="1"
      class="scroll-width"
    >
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <component v-bind:is="currentCard"></component>
          </v-flex>
        </v-layout>
      </v-container>
    </v-navigation-drawer>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Ze Dashboard</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height class="pa-0">
        <v-layout justify-center align-center>
          <v-flex fill-height d-flex xs12>
            <Map></Map>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer height="auto" app pa-0>
      <DateSlider></DateSlider>
    </v-footer>
    <v-progress-linear v-if="sending" color="primary" indeterminate></v-progress-linear>
    <v-snackbar v-model="showResponse" left>{{response}}</v-snackbar>
  </v-app>
</template>

<script>
import Map from "@/components/map";
import DateSlider from "@/components/DateSlider";
import NewVibe from "@/components/NewVibe";
import FutureVibeList from "@/components/FutureVibeList";
import PastVibeList from "@/components/PastVibeList";
import { EventBus } from "../../../client/src/event-bus.js";
const axios = require("axios");

export default {
  name: "Dashboard",
  components: {
    Map,
    NewVibe,
    FutureVibeList,
    PastVibeList,
    DateSlider
  },
  data: () => ({
    drawer: null,
    currentCard: "FutureVibeList",
    sending: false,
    response: null,
    operationReturned: false,
    deleteConfirmActive: false,
    vibeToDelete: null,
    showResponse: false
  }),
  mounted() {
    EventBus.$on("mapClicked", () => {
      this.currentCard = "NewVibe";
    });

    EventBus.$on("newVibeFormClosed", () => {
      this.currentCard = "FutureVibeList";
    });

    EventBus.$on("getFutureVibes", this.getFutureVibes);
    EventBus.$on("getPastVibes", this.getPastVibes);
    EventBus.$on("deleteFutureVibe", vibeToDelete => {
      this.deleteConfirmActive = true;
      this.vibeToDelete = vibeToDelete;
    });
    EventBus.$on("saveVibe", this.saveVibe);

    this.getFutureVibes();
  },
  methods: {
    saveVibe(vibe) {
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
            title: vibe.title,
            lng: vibe.lng,
            lat: vibe.lat,
            date: vibe.date,
            time: vibe.time,
            isRecurring: vibe.isRecurring,
            daysRecurring: vibe.daysRecurring
          }
        })
        .then(
          response => {
            this.sending = false;
            this.operationReturned = true;
            if (response.status == 200) {
              this.operationStatus = "success";
              this.response = `Vibe saved. Vibe ID: ${response.data.vibeId}`;
              this.showResponse = true;
              EventBus.$emit("getFutureVibes");
            } else {
              this.showResponse = true;
              this.operationStatus = "failure";
              this.response = response;
            }
          },
          err => {
            this.sending = false;
            this.showResponse = true;
            this.operationReturned = true;
            this.operationStatus = "failure";
            this.response = `Error. Did you run admin/server.js? ${err.toString()}`;
          }
        );
    },
    getVibes(date) {
      this.sending = true;
      this.response = null;
      this.operationStatus = null;
      let serverUrl = "";
      let params = {};
      if (!date) {
        serverUrl =
          process.env.NODE_ENV === "production"
            ? "/get-vibes"
            : "http://localhost:3030/get-vibes";
      } else {
        serverUrl =
          process.env.NODE_ENV === "production"
            ? "/get-past-vibes"
            : "http://localhost:3030/get-past-vibes";
        params = { date };
      }
      axios.get(serverUrl, { params }).then(
        response => {
          this.sending = false;
          this.operationReturned = true;
          if (response.status == 200) {
            this.operationStatus = "success";
            this.vibes = response.data.vibes;
            this.vibes.forEach(
              x =>
                (x.location = {
                  lat: parseFloat(x.location.lat),
                  lng: parseFloat(x.location.lng)
                })
            );
            this.$store.dispatch("setData", { vibes: response.data.vibes });
            //this.response = `Got ${this.vibes.length} vibes from db`;
          } else {
            this.operationStatus = "failure";
            this.showResponse = true;
            this.response = response;
          }
        },
        err => {
          this.sending = false;
          this.operationReturned = true;
          this.showResponse = true;
          this.operationStatus = "failure";
          this.response = `Error. Did you run admin/server.js? ${err.toString()}`;
        }
      );
    },
    getFutureVibes() {
      this.getVibes();
    },
    getPastVibes(date) {
      this.currentCard = "PastVibeList";
      this.getVibes(date);
    },
    deleteFutureVibe() {
      let vibe = this.vibeToDelete;
      this.deleteConfirmActive = false;
      this.sending = true;
      this.response = null;
      this.operationStatus = null;
      const serverUrl =
        process.env.NODE_ENV === "production"
          ? "/delete-vibe"
          : "http://localhost:3030/delete-vibe";

      axios
        .get(serverUrl, {
          params: {
            id: vibe._id
          }
        })
        .then(
          response => {
            this.sending = false;
            this.operationReturned = true;
            if (response.status == 200) {
              this.operationStatus = "success";
              this.response = "Vibe deleted";
              this.showResponse = true;
              this.getFutureVibes();
            } else {
              this.showResponse = true;
              this.operationStatus = "failure";
              this.response = response;
            }
          },
          err => {
            this.showResponse = true;
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
.scroll-width::-webkit-scrollbar {
  width: 6px;
  height: 10px;
}
.scroll-width::-webkit-scrollbar-thumb {
  background-color: #888;
}
.scroll-width::-webkit-scrollbar-track {
  background-color: #f0f0f0;
}
</style>

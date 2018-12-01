<template>
  <div>
    <v-dialog
      v-model="deleteConfirmActive"
      width="500"
    >
    <v-card>
        <v-card-title class="headline">Are you sure you want to delete?</v-card-title>

        <v-card-text>
          This will stop the vibe from being created again
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="deleteConfirmActive = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="deleteFutureVibe()"
          >
            Delete Vibe
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div v-if="vibes.length==0">
    <v-icon>devices_other</v-icon>
    No future vibes loaded.
      <v-btn primary raised @click="getFutureVibes">Get future vibes</v-btn>
    </div>

    <v-list two-line v-if="vibes.length>0">

<v-subheader>Future Vibes</v-subheader>
          <template v-for="(vibe, index) in vibes">
            <v-subheader
              v-if="vibe.title"
              :key="vibe._id"
            >
              {{ vibe.title }}
            </v-subheader>

            <v-list-tile
              :key="vibe.title"
              avatar
              @click=""
            >
<v-icon>location_on</v-icon>
              <v-list-tile-content>
                <v-list-tile-title v-html="vibe.title"></v-list-tile-title>
                <v-list-tile-sub-title v-html="vibe.date"></v-list-tile-sub-title>
              </v-list-tile-content>
              <v-btn raised icon @click="vibeToBeDeleted = vibe; deleteConfirmActive = true;">
                <v-icon>delete</v-icon>
                </v-btn>
            </v-list-tile>
          </template>
        </v-list>
      
      <v-progress-linear v-if="sending" color="primary" indeterminate></v-progress-linear>
      <v-snackbar v-model="operationReturned" left>{{response}}</v-snackbar>
  </div>
</template>

<script>
import { EventBus } from "../../../client/src/event-bus.js";
const axios = require("axios");

export default {
  name: "FutureVibeList",
  components: {},
  data() {
    return {
      vibes: [],
      vibeToBeDeleted: null,
      sending: false,
      response: null,
      operationReturned: false,
      deleteConfirmActive: false
    };
  },
  mounted() {
    this.getFutureVibes();
    EventBus.$on("refreshVibeList", this.getFutureVibes);
  },
  methods: {
    deleteFutureVibe() {
      let vibe = this.vibeToBeDeleted;
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
              this.operationStatus = 'success';
              this.response = 'Vibe deleted';
              this.getFutureVibes();
            } else {
              this.operationStatus = 'failure';
              this.response = response;
            }
          },
          err => {
            this.sending = false;
            this.operationReturned = true;
            this.operationStatus = 'failure';
            this.response = `Error. Did you run admin/server.js? ${err.toString()}`;
          }
        );
    },
    getFutureVibes() {
      this.sending = true;
      this.response = null;
      this.operationStatus = null;
      const serverUrl =
        process.env.NODE_ENV === 'production'
          ? '/get-vibes'
          : 'http://localhost:3030/get-vibes';
      axios.get(serverUrl).then(
        response => {
          this.sending = false;
          this.operationReturned = true;
          if (response.status == 200) {
            this.operationStatus = "success";
            this.vibes = response.data.vibes;
            this.response = `Got ${this.vibes.length} vibes from db`;
          } else {
            this.operationStatus = 'failure';
            this.response = response;
          }
        },
        err => {
          this.sending = false;
          this.operationReturned = true;
          this.operationStatus = 'failure';
          this.response = `Error. Did you run admin/server.js? ${err.toString()}`;
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

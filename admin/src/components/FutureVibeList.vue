<template>
  <div>
    <md-dialog-confirm
      :md-active.sync="deleteConfirmActive"
      md-title="Are you sure you want to delete?"
      md-content="This will stop the vibe from being created again"
      md-confirm-text="Delete"
      md-cancel-text="Cancel"
      @md-confirm="deleteFutureVibe" />

    <md-empty-state
      v-if="vibes.length==0"
      md-icon="devices_other"
      md-label="No future vibes loaded"
      md-description="Try requesting future vibes again"
    >
      <md-button class="md-primary md-raised" @click="getFutureVibes">Get future vibes</md-button>
    </md-empty-state>
    <md-list v-if="vibes.length>0" class="md-double-line">
      <md-subheader>Future Vibes</md-subheader>

      <md-list-item v-for="(vibe, key) in vibes" :key="key" :vibe="vibe">
        <md-icon class="md-primary">location_on</md-icon>
        <div class="md-list-item-text">
          <span>{{vibe.title}}</span>
          <span>{{vibe.date}}</span>
        </div>
        <md-button class="md-icon-button md-list-action" @click="vibeToBeDeleted = vibe; deleteConfirmActive = true;">
          <md-icon>delete</md-icon>
        </md-button>
      </md-list-item>
    </md-list>
    <md-progress-bar md-mode="indeterminate" v-if="sending"/>
    <md-snackbar md-position="left" :md-active.sync="operationReturned">{{response}}</md-snackbar>
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

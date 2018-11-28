<template>
  <div>
    <md-list class="md-double-line">
      <md-subheader>Future Vibes</md-subheader>

      <md-list-item v-for="(vibe, key) in vibes" :key="key" :vibe="vibe">
        <md-icon class="md-primary">location_on</md-icon>
        <div class="md-list-item-text">
          <span>{{vibe.title}}</span>
          <span>{{vibe.date}}</span>
        </div>
        <md-button class="md-icon-button md-list-action">
          <md-icon>delete</md-icon>
        </md-button>
      </md-list-item>
    </md-list>
    <md-progress-bar md-mode="indeterminate" v-if="sending"/>
    <md-snackbar md-position="left" :md-active.sync="operationReturned">{{response}}</md-snackbar>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  name: "FutureVibeList",
  components: {},
  data() {
    return {
      vibes: [],
      sending: false,
      response: null,
      operationReturned: false
    };
  },
  mounted() {
    this.getFutureVibes();
  },
  methods: {
    getFutureVibes() {
      this.sending = true;
      this.response = null;
      this.operationStatus = null;
      const serverUrl =
        process.env.NODE_ENV === "production"
          ? "/get-vibes"
          : "http://localhost:3030/get-vibes";
      axios.get(serverUrl).then(
        response => {
          this.sending = false;
          this.operationReturned = true;
          if (response.status == 200) {
            this.operationStatus = "success";
            this.vibes = response.data.vibes;
            this.response = `Got ${this.vibes.length} vibes from db`;
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
</style>

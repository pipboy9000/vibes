<template>
  <v-card class="elevation-3">
    <v-card-title primary-title>Past Vibes</v-card-title>
    <v-card-text>
      <div v-if="vibes.length==0">
        <v-icon>devices_other</v-icon>No vibes loaded.
      </div>

      <v-list two-line subheader v-if="vibes.length > 0">
        <v-list-tile v-for="(vibe) in vibes" :key="vibe._id" avatar @click="centerMap(vibe)">
          <v-list-tile-avatar>
            <v-icon>location_on</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-html="vibe.title"></v-list-tile-title>
            <v-list-tile-sub-title v-html="vibeDate(vibe)"></v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import { EventBus } from "../../../client/src/event-bus.js";
const axios = require("axios");

export default {
  name: "PastVibeList",
  components: {},
  data() {
    return {};
  },
  methods: {
    vibeDate(vibe) {
      return new Date(vibe.createdAt).toLocaleString();
    },
    centerMap(vibe) {
      EventBus.$emit("focusVibe", vibe);
    }
  },
  computed: {
    vibes() {
      return this.$store.state.vibes;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

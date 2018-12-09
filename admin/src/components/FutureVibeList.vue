<template>
  <v-card class="elevation-3">
    <v-card-title primary-title>Future Vibes</v-card-title>
    <v-card-text>
      <div v-if="vibes.length==0">
        <v-icon>devices_other</v-icon>No future vibes loaded.
        <v-btn primary raised @click="getFutureVibes">Get future vibes</v-btn>
      </div>

      <v-list two-line subheader v-if="vibes.length > 0">
        <v-list-tile v-for="(vibe, index) in vibes" :key="vibe._id" avatar @click="centerMap(vibe)">
          <v-list-tile-avatar>
            <v-icon>location_on</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-html="vibe.title"></v-list-tile-title>
            <v-list-tile-sub-title v-html="vibeDate(vibe)"></v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon ripple @click="deleteFutureVibe(vibe)">
              <v-icon color="grey lighten-1">delete</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import { EventBus } from "../../../client/src/event-bus.js";
const axios = require("axios");

export default {
  name: "FutureVibeList",
  components: {},
  data() {
    return {};
  },
  methods: {
    deleteFutureVibe(vibe) {
      EventBus.$emit("deleteFutureVibe", vibe);
    },
    getFutureVibes() {
      EventBus.$emit("getFutureVibes");
    },
    vibeDate(vibe) {
      return `${vibe.date}, ${vibe.time}`;
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

<template>
  <v-card class="elevation-3">
    <v-card-title primary-title>Future Vibes</v-card-title>
    <v-card-text>
      

      <div v-if="vibes.length==0">
        <v-icon>devices_other</v-icon>No future vibes loaded.
        <v-btn primary raised @click="getFutureVibes">Get future vibes</v-btn>
      </div>

      <v-list two-line v-if="vibes.length>0">
        <template v-for="(vibe, index) in vibes">
          <v-subheader v-if="vibe.title" :key="vibe._id">{{ vibe.title }}</v-subheader>

          <v-list-tile :key="vibe.title+index" avatar>
            <v-icon>location_on</v-icon>
            <v-list-tile-content>
              <v-list-tile-title v-html="vibe.title"></v-list-tile-title>
              <v-list-tile-sub-title v-html="vibe.date"></v-list-tile-sub-title>
            </v-list-tile-content>
            <v-btn raised icon @click="deleteFutureVibe(vibe)">
              <v-icon>delete</v-icon>
            </v-btn>
          </v-list-tile>
        </template>
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
    return {
    };
  },
  methods: {
    deleteFutureVibe(vibe) {
      EventBus.$emit('deleteFutureVibe', vibe);
    },
    getFutureVibes() {
      EventBus.$emit('getFutureVibes');
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

<template>
  <v-container >
    <v-layout>
      <v-flex>
        <v-slider v-model="slider" thumb-label thumb-size="100">
          <template slot="thumb-label" slot-scope="props">
            <v-container>
            <v-layout class="text-xs-center">
              {{ dateThumb(props.value) }}
              {{ timeThumb(props.value) }}
            </v-layout>
            </v-container>
          </template>
        </v-slider>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { EventBus } from "../../../client/src/event-bus.js";

export default {
  name: "DateSlider",
  components: {},
  data: () => ({
    slider: 0,
    ticksLabels: []
  }),
  mounted() {
    let dateNow = new Date();
    let timeStepsBack = 100;
    let timeMult = 1000 * 60 * 60;
    for (let i = 0; i < timeStepsBack; i++) {
      this.ticksLabels.push(dateNow - (timeStepsBack + i) * timeMult);
    }
  },
  methods: {
    dateThumb(val) {
      return new Date(this.ticksLabels[val]).toLocaleDateString("he-IL");
    },
    timeThumb(val) {
      return new Date(this.ticksLabels[val]).toLocaleTimeString("he-IL");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

<template>
  <v-container>
    <v-layout justify-center>
      <v-flex xs10>
        <v-slider 
        v-model="slider" 
        thumb-label 
        thumb-size="100" 
        :max="timeStepsBack"
        :disabled="isFuture"
        @end="changeEnd"
        >
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
      <v-spacer></v-spacer>
      <v-flex>
        <v-checkbox v-model="isFuture" label="Future"></v-checkbox>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { EventBus } from "../../../client/src/event-bus.js";
const axios = require("axios");
const TIME_STEPS_BACK = 1000;

export default {
  name: "DateSlider",
  components: {},
  data: () => ({
    slider: TIME_STEPS_BACK,
    ticksLabels: [],
    timeStepsBack: TIME_STEPS_BACK,
    isFuture: true,
    selectedDate: null
  }),
  mounted() {
    let dateNow = new Date().getTime();
    let timeMult = 1000 * 60 * 60;
    for (let i = 0; i <= this.timeStepsBack; i++) {
      this.ticksLabels.push(new Date(dateNow - ((this.timeStepsBack - i) * timeMult)));
    }
  },
  methods: {
    dateThumb(val) {
      if (this.ticksLabels.length == 0) return '';
      let date = this.ticksLabels[val].toLocaleDateString("he-IL");
      return date;
    },
    timeThumb(val) {
      if (this.ticksLabels.length == 0) return '';
      let time = this.ticksLabels[val].toLocaleTimeString("he-IL");
      return time;
    },
    changeEnd(val) {
      this.selectedDate = this.ticksLabels[val];
      EventBus.$emit('getPastVibes', this.selectedDate);
    }
  },
  watch: {
    isFuture(newVal, oldVal) {
      if (newVal === true) EventBus.$emit("getFutureVibes");
      else if (this.selectedDate) EventBus.$emit('getPastVibes', this.selectedDate);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

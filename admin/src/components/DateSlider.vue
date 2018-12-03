<template>
  <v-container>
    <v-layout>
      <v-flex>
        <v-slider v-model="slider" thumb-label thumb-size="104">
          <template
          slot="thumb-label"
          slot-scope="props"
        >
          <div>
            {{ dateThumb(props.value) }} 
          </div>
          <div>
            {{ timeThumb(props.value) }}
          </div>
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
  components: {
    
  },
  data: () => ({
    slider: 45,
    ticksLabels: []
  }),
  mounted() {
    let dateNow = new Date();
    let timeStepsBack = 100;
    let timeMult = 1000 * 60 * 60;
    for (let i=0; i<timeStepsBack; i++) {
      this.ticksLabels.push(dateNow - (timeStepsBack + i) * timeMult)
    }
  },
  methods: {
    dateThumb (val) {
      return new Date(this.ticksLabels[val]).toDateString()
    },
    timeThumb (val) {
      return new Date(this.ticksLabels[val]).toLocaleTimeString()
    },
  }
};
</script>

<style lang="scss" scoped>

</style>

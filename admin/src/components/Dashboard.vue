<template>
  <v-app>
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
  </v-app>
</template>

<script>
import Map from '@/components/map';
import DateSlider from '@/components/DateSlider';
import NewVibe from '@/components/NewVibe';
import FutureVibeList from '@/components/FutureVibeList';
import { EventBus } from '../../../client/src/event-bus.js';

export default {
  name: 'Dashboard',
  components: {
    Map,
    NewVibe,
    FutureVibeList,
    DateSlider
  },
  data: () => ({
    drawer: null,
    currentCard: 'FutureVibeList'
  }),
  mounted() {
    EventBus.$on('mapClicked', () => {
      this.currentCard = 'NewVibe';
    });
    
    EventBus.$on('newVibeFormClosed', () => {
      this.currentCard = 'FutureVibeList';
    });

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

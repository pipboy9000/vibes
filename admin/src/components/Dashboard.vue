<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      width="400"
      app
      mobile-break-point="1"
      class="scroll-width"
    >
      <!-- <div v-show="inVibeCreationMode"> -->
      <div>
        <v-layout row justify-center>
          <v-flex xs11>
            <v-card class="elevation-3">
              <v-card-title primary-title>Create New Vibe</v-card-title>
              <v-card-text>
                <NewVibe></NewVibe>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </div>
      <div v-show="!inVibeCreationMode">
        <v-layout justify-center>
          <v-flex>
            <FutureVibeList></FutureVibeList>
          </v-flex>
        </v-layout>
      </div>
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
    <v-footer height="auto" app>
      <DateSlider></DateSlider>
    </v-footer>
  </v-app>
</template>

<script>
import Map from "@/components/map";
import DateSlider from "@/components/DateSlider";
import NewVibe from "@/components/NewVibe";
import FutureVibeList from "@/components/FutureVibeList";
import { EventBus } from "../../../client/src/event-bus.js";

export default {
  name: "Dashboard",
  components: {
    Map,
    NewVibe,
    FutureVibeList,
    DateSlider
  },
  data: () => ({
    drawer: null,
    inVibeCreationMode: false
  }),
  mounted() {
    EventBus.$on("mapClicked", () => {
      this.inVibeCreationMode = true;
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

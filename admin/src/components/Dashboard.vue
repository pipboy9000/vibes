<template>
  <div>
    <v-navigation-drawer v-model="drawer" floating app mobile-break-point="1">
      <div v-show="inVibeCreationMode">
      <v-layout justify-center>
        <NewVibe></NewVibe>
      </v-layout>
      </div>
      <div v-show="!inVibeCreationMode">
      <v-layout justify-center>
        <FutureVibeList></FutureVibeList>
      </v-layout>
      </div>
    </v-navigation-drawer>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Application</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container>
        <div class="mapContainer">
          <v-layout justify-center>
            <Map></Map>
          </v-layout>
        </div>
      </v-container>
    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2017</span>
    </v-footer>
  </div>
</template>

<script>
import Map from "./map";
import NewVibe from "@/components/NewVibe";
import FutureVibeList from "@/components/FutureVibeList";
import { EventBus } from "../../../client/src/event-bus.js";

export default {
  name: "Dashboard",
  components: {
    Map,
    NewVibe,
    FutureVibeList
  },
  data: () => ({
    drawer: null,
    inVibeCreationMode: false
  }),
  mounted() {
    EventBus.$on("mapClicked", () => {
      this.inVibeCreationMode = true
    });
  }
};
</script>

<style lang="scss" scoped>

.mapContainer {
  height: 400px;
}
</style>

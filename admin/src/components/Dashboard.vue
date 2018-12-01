<template>
<div>
<v-navigation-drawer
      v-model="drawer"
      floating
      app
      mobile-break-point="1"
    >
      <NewVibe></NewVibe>
    </v-navigation-drawer>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Application</v-toolbar-title>
    </v-toolbar>
    <v-content>
          <div class="mapContainer">

      <v-container fluid>
        
        <v-layout align-space-between justify-space-between row fill-height>
            <Map></Map>
        </v-layout>

      </v-container>
          </div>
    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2017</span>
    </v-footer>
  <!-- 
    <div class="md-layout">
      <div class="md-layout-item">
        <NewVibe></NewVibe>
      </div>
      <div class="md-layout-item">
       
        <FutureVibeList></FutureVibeList> 
      </div>
    </div>
    <Map></Map>-->
  </div> 
</template>

<script>
import Map from "./map";
import NewVibe from '@/components/NewVibe';
import FutureVibeList from "@/components/FutureVibeList";

export default {
  name: "Dashboard",
  components: {
    Map,
    NewVibe,
    FutureVibeList
  },
  data: () => ({
    drawer: null
  })
};
</script>

<style lang="scss" scoped>
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}

.mapContainer {
  height: 400px;
}
</style>

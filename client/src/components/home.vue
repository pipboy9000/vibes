<template>
  <div class="main">
      <Map class="map"></Map>
      <div v-if="!$store.loggedOut">
        <div class="overlay"></div>
        <div class="elements-wrapper">
          <Logo></Logo>
          <FacebookLogin></FacebookLogin>
        </div>
      </div>
  </div>
</template>

<script>
import Map from "./map";
import FacebookLogin from "./facebook-login/facebookLogin";
import Logo from "./logo";

export default {
  name: "home",
  mounted() {
    debugger;
  },
  components: {
    Map,
    FacebookLogin,
    Logo
  }
};
</script>

<style scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.elements-wrapper {
  padding-bottom: 30vh;
}

.logo {
  font-size: 100px;
  color: white;
  stroke: black 5px solid;
}

.map {
  position: absolute;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.15);
}
</style>



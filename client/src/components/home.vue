<template>
  <div class="main">
      <Map></Map>
      <div class="loginDiv" v-show="!loggedIn"> 
        <div class="elements-wrapper">
          <div class="logo"></div>
          <FacebookLogin></FacebookLogin>
        </div>
      </div>
      <div v-if="loggedIn">
        <mapUI></mapUI>
        <vibe-details></vibe-details>
        <NewVibeForm></NewVibeForm>
        <settings></settings>
      </div>
    <div class="preview"></div>
  </div>
</template>

<script>
import Map from "./map";
import FacebookLogin from "./facebook-login/facebookLogin";
import MapUI from "./mapUI";
import NewVibeForm from "./newVibeForm";
import VibeDetails from "./vibeDetails";
import Settings from "./settings";

import { EventBus } from "../event-bus";

export default {
  name: "home",
  components: {
    Map,
    FacebookLogin,
    NewVibeForm,
    VibeDetails,
    MapUI,
    Settings
  },
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn;
    }
  }
};
</script>

<style scoped="true">
.preview {
  position: absolute;
  width: 100%;
  height: -webkit-fill-available;
  background: url("/static/ref.png");
  background-size: contain;
  background-repeat: no-repeat;
  opacity: -0.3;
  pointer-events: none;
}

.main {
  position: absolute;
  width: 100%;
  height: 100%;
}

.elements-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 100px;
  width: 100%;
  position: absolute;
}

.logo {
  background: url("/static/logo.png");
  width: 90%;
  min-height: 120px;
  max-height: 150px;
  padding-bottom: 40px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-bottom: 30px;
}

.map {
  position: absolute;
}

.loginDiv {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>



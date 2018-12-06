<template>
  <div class="main">
      <Map></Map>
        <div class="loginDiv" v-if="$store.state.loginDetails === null"> 
          <div class="overlay"></div>
          <div class="elements-wrapper">
            <Logo class="logo"></Logo>
            <FacebookLogin></FacebookLogin>
          </div>
        </div>
        <mapUI></mapUI>
        <vibe-details></vibe-details>
        <NewVibeForm></NewVibeForm>
        <settings></settings>
        <div class="preview"></div>
  </div>
</template>

<script>
import Map from "./map";
import FacebookLogin from "./facebook-login/facebookLogin";
import Logo from "./logo";
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
    Logo,
    NewVibeForm,
    VibeDetails,
    MapUI,
    Settings
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
}

.logo {
  padding-bottom: 40px;
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

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.35);
}

.logo-small {
  float: left;
  margin-left: 15px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>



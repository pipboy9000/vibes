<template>
  <div class="main">
      <Map class="map"></Map>
        <div class="loginDiv" v-if="$store.state.loginDetails === null"> 
          <div class="overlay"></div>
          <div class="elements-wrapper">
            <Logo :size="200" style="padding-bottom:40px"></Logo>
            <FacebookLogin></FacebookLogin>
          </div>
        </div>
        <div v-else>
          <div class="newVibeBtn" @click="openNewVibeForm">+</div>
          <list class="list"></list>
          <vibe-details></vibe-details>
          <NewVibeForm class="newVibeForm"></NewVibeForm>
          <mapUI></mapUI>
        </div>
  </div>
</template>

<script>
import Map from "./map";
import FacebookLogin from "./facebook-login/facebookLogin";
import Logo from "./logo";
import List from "./list";
import MapUI from "./mapUI";
import NewVibeForm from "./newVibeForm";
import VibeDetails from "./vibeDetails";

import { EventBus } from "../event-bus";

export default {
  name: "home",
  components: {
    Map,
    FacebookLogin,
    Logo,
    NewVibeForm,
    List,
    VibeDetails,
    MapUI
  },
  methods: {
    openNewVibeForm() {
      EventBus.$emit("openNewVibeForm");
    }
  }
};
</script>

<style scoped="true">
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
}

.logo {
  padding-bottom: 15px;
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

.newVibeBtn {
  user-select: none;
  position: absolute;
  width: 80px;
  height: 80px;
  background-color: #22dbe3;
  border: 5px solid white;
  left: 50%;
  -webkit-transform: translateX (-50%);
  transform: translateX (-50%);
  bottom: 50px;
  border-radius: 80px;
  font-family: cursive;
  font-size: 70px;
  line-height: 70px;
  color: white;
  box-shadow: 0px 8px 10px -1px #0004;
}

.newVibeForm {
  width: 100%;
  height: 100%;
}

.list {
  margin: 20px;
}
</style>



<template>
  <div class="main">
      <Map class="map"></Map>
      <!-- v-if="$store.state.fbDetails" -->
      <!-- <transition name="fade"> -->
        <div class="loginDiv"> 
          <div class="overlay"></div>
          <div class="elements-wrapper">
            <Logo :size="200" style="padding-bottom:40px"></Logo>
            <FacebookLogin></FacebookLogin>
          </div>
        </div>
      <div class="newVibeBtn emoji" @click="toggleNewVibe">🏖</div>
      <NewVibeForm class="newVibeForm"></NewVibeForm>
      <Logo :size="50" class="logo-small"></logo>
  </div>
</template>

<script>
import Map from "./map";
import FacebookLogin from "./facebook-login/facebookLogin";
import Logo from "./logo";
import NewVibeForm from "./newVibeForm";

export default {
  name: "home",
  mounted() {},
  components: {
    Map,
    FacebookLogin,
    Logo,
    NewVibeForm
  },
  methods: {
    toggleNewVibe() {
      console.log("new vibe");
    }
  }
};
</script>

<style scoped="true">
.main {
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
  position: absolute;
  width: 80px;
  height: 80px;
  background-color: white;
  border: 5px solid lightblue;
  left: 50%;
  transform: translateX (-50%);
  translate: -50%;
  bottom: 50px;
  border-radius: 80px;
}

.newVibeForm {
  width: 100%;
  height: 100%;
}
</style>



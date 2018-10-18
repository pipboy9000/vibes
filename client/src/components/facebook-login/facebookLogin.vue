<template>
  <div class="container">
    <button @click="buttonClicked">
      <div class="spinner"
        v-if="isWorking"> </div>
      <img :src="icon"
        v-if="!isWorking"> <div class="text"> {{getButtonText}} </div>
    </button>
  </div>
</template>
<script>
import Vue from "vue";

import {
  loadFbSdk,
  getLoginStatus,
  fbLogout,
  fbLogin,
  fbGetUserDetails
} from "./helpers-dev.js";
// } from "./helpers.js";

import icon from "./icon.png";
export default {
  name: "facebook-login",
  data() {
    return {
      isWorking: false,
      isConnected: false,
      icon,
      // appId: "1033690713453013", //prod
      appId: "2192681937654200", //dev
      version: "v2.10",
      logoutLabel: "Logout of Facebook",
      loginLabel: "Login with Facebook",

      loginOptions: function() {
        return {
          scope: "email"
        };
      }
    };
  },
  computed: {
    getButtonText() {
      switch (this.isConnected) {
        case true:
          return this.logoutLabel;
        case false:
          return this.loginLabel;
        default:
          return "this is default";
      }
    }
  },
  methods: {
    buttonClicked() {
      this.$emit("click");
      if (this.isConnected) {
        this.logout();
      } else {
        this.login();
      }
    },
    logout() {
      this.isWorking = true;
      fbLogout().then(response => {
        this.isWorking = false;
        this.isConnected = false;
        this.$store.dispatch("setLoginDetails", null);
      });
    },
    login() {
      this.isWorking = true;
      fbLogin(this.loginOptions).then(response => {
        console.log("back in Vue file. response.status: " + response.status);
        if (response.status === "connected") {
          this.isConnected = true;
          console.log("dispatch setLoginDetails");
          this.$store.dispatch("setLoginDetails", response);
          fbGetUserDetails().then(userDetails => {
            console.log("dispatch setUserDetails");
            this.$store.dispatch("setUserDetails", userDetails);
          });
        } else {
          this.isConnected = false;
        }
        this.isWorking = false;
      });
    }
  },
  created() {
    if (process.env.NODE_ENV == "production") {
      this.appId = "1033690713453013";
    }
  },
  mounted() {
    this.isWorking = true;
    console.log("waiting for device ready");
    this.$root.cordova.on("deviceready", () => {
      console.log("device ready called");
      loadFbSdk(this.appId, this.version)
        .then(loadingResult => {})
        .then(() => getLoginStatus())
        .then(response => {
          console.log("fb getLoginStatus returned:");
          console.dir(response);
          if (response.status === "connected") {
            this.isConnected = true;
            console.log("dispatching setLoginDetails");
            this.$store.dispatch("setLoginDetails", response);
            fbGetUserDetails().then(userDetails => {
              console.log("dispatching setUserDetails");
              this.$store.dispatch("setUserDetails", userDetails);
            });
          }
          this.isWorking = false;
        });
    });
  }
};
</script>

<style scoped="true">
.container {
  display: flex;
  justify-content: center;
  width: min-content;
}

button {
  margin-top: 1px;
  width: 225px;
  position: relative;
  padding: 0 15px 0px 46px;
  border: none;
  line-height: 34px;
  font-size: 16px;
  color: #fff;
  min-width: 245px;
  background-image: linear-gradient(#4c69ba, #3b55a0);
  padding: 3px;
  border-radius: 4px;
  box-shadow: 0px 8px 21px rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  box-sizing: border-box;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  animation: spin 2s linear infinite;
  left: 5px;
}

.text {
  padding-left: 15px;
}

img {
  top: 3px;
  left: 10px;
  width: 22px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

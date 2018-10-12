<template>
  <div id="app">
    <router-view/>
    <emoji-selector></emoji-selector>
  </div>
</template>

<script>
import EmojiSelector from "./components/emojiSelector";
import location from "./services/location.js";
export default {
  name: "App",
  components: {
    EmojiSelector
  },
  mounted() {
    this.$root.cordova.on("deviceready", () => {
      location.init();
    });

    //makes back button work if user opens the app with vibe id link
    var vibeId = this.$route.query.v;
    if (vibeId) {
      this.$router.replace({ path: "", query: {} });
      this.$router.push({ path: "", query: { v: vibeId } });
    } else {
      this.$router.replace({ path: "", query: {} }); //remove all other queries if exist
    }
  }
};
</script>

<style>
#app {
  position: absolute;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

/*fb login button style override*/
#app > div > div.elements-wrapper > div.container.button > button > div {
  display: none;
}

#app > div > div.elements-wrapper > div.container.button > button > img {
  display: none;
}

#app > div > div.elements-wrapper > div.container.button > button {
  padding: 3px;
  border-radius: 4px;
  box-shadow: 0px 8px 21px rgba(0, 0, 0, 0.4);
}

html {
  width: 100%;
  height: 100%;
}

body {
  margin: 0;
  width: 100%;
  height: 100%;
}

.emoji {
  font-family: "Segoe UI Emoji";
}
</style>

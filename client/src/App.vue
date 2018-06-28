<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {

  },
  methods: {
    getUserData: data => {
      console.log(data);
    }
  },
  sockets: {
    setVibes(vibes) {
      console.log(vibes);
      this.$store.commit("setVibes", vibes);
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

/*fb login button style override*/
#app > div > div.elements-wrapper > div.container.button > button  > div {
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

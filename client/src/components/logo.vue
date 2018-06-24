<template>
    <div class="logo-wrapper">
        <div ref="stroke" class="stroke">Vibes</div>
        <div class="logo">Vibes</div>
    </div>
</template>

<script>
export default {
  name: "logo",
  data() {
    return {
      changeColorInterval: null
    };
  },
  mounted() {
    debugger;
    this.changeColorInterval = setInterval(this.changeColors, 2000);
  },
  beforeDestroy() {
    clearInterval(this.changeColorInterval);
  },
  methods: {
    changeColors() {
      this.$refs.stroke.style.webkitTextStrokeColor =
        "hsl(" + Math.floor(Math.random() * 361).toString() + ", 95%, 75%)";
    }
  }
};
</script>

<style scoped>
.logo-wrapper {
  padding-bottom: 20px;
  position: relative;
  height: 310px;
  width: 100%;
}

.logo {
  font-family: "Pacifico", cursive;
  font-size: 210px;
  position: absolute;
  color: white;
  width: 100%;
  left: -13px;
}

.stroke {
  font-family: "Pacifico", cursive;
  font-size: 210px;
  position: absolute;
  -webkit-text-stroke-width: 15px;
  -webkit-text-stroke-color: #3fb7f5;
  width: 100%;
  left: -13px;
  text-shadow: 0px 18px 33px #00000059;
}
</style>



<template>
    <div class="logoWrapper">
      <div ref="stroke" class="stroke">Vibes</div>
      <div ref="logo" class="logoText">Vibes</div>
      <div ref="sizer" class="sizer">Vibes</div> 
    </div>
</template>

<script>
export default {
  name: "logo",
  props: ["size"],
  data() {
    return {
      mySize: 200, //determined by size prop, or calculated by screen width if not defined
      changeColorInterval: null
    };
  },
  mounted() {
    if (this.size) {
      this.mySize = this.size;
    } else {
      this.mySize = window.innerWidth / 800 * 220;
    }

    if (this.mySize > 200) {
      this.mySize = 200;
    }

    this.$refs.stroke.style.fontSize = this.mySize + "px";
    this.$refs.logo.style.fontSize = this.mySize + "px";
    this.$refs.sizer.style.fontSize = this.mySize + "px";

    this.$refs.stroke.style.webkitTextStrokeWidth =
      Math.min(Math.round(this.mySize / 14 + 1), 15).toString() + "px";
    this.$refs.stroke.style.textShadow =
      "0px " +
      (this.mySize / 12 + 1).toString() +
      "px " +
      (this.mySize / 7 + 3).toString() +
      "px #00000040";

    this.changeColorInterval = setInterval(this.changeColors, 2500);
  },
  beforeDestroy() {
    clearInterval(this.changeColorInterval);
  },
  methods: {
    changeColors() {
      this.$refs.stroke.style.webkitTextStrokeColor =
        "hsl(" + Math.floor(Math.random() * 360).toString() + ", 95%, 75%)";
    }
  }
};
</script>

<style scoped="true">
.sizer {
  width: min-content;
  height: min-content;
  font-family: "Pacifico", cursive, sans-serif;
  display: inline-block;
  opacity: 0;
  padding: 10px;
}

.logoText {
  font-family: "Pacifico", cursive, sans-serif;
  position: absolute;
  color: white;
}

.stroke {
  font-family: "Pacifico", cursive, sans-serif;
  position: absolute;
  -webkit-text-stroke-color: #3fb7f5;
}
</style>



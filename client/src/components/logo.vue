<template>
    <div class="logoWrapper">
      <div ref="stroke" class="stroke">Vibes</div>
      <div ref="logo" class="logo">Vibes</div>
      <div ref="sizer" class="sizer">Vibes</div> 
    </div>
</template>

<script>
export default {
  name: "logo",
  props: ["size"],
  data() {
    return {
      changeColorInterval: null
    };
  },
  mounted() {
    this.$refs.stroke.style.fontSize = this.size + "px";
    this.$refs.logo.style.fontSize = this.size + "px";
    this.$refs.sizer.style.fontSize = this.size + "px";

    this.$refs.stroke.style.webkitTextStrokeWidth = Math.min(Math.round(this.size / 14 + 1), 15).toString() + "px";
    this.$refs.stroke.style.textShadow = "0px " + (this.size / 12 + 1).toString() + "px " + (this.size / 7 + 3).toString() + "px #00000040";

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

<style scoped>

.sizer {
  width: min-content;
  height: min-content;
  font-family: "Pacifico", cursive;
  display: inline-block;
  opacity: 0;
  padding: 10px;
}

.logo {
  font-family: "Pacifico", cursive;
  position: absolute;
  color: white;
}

.stroke {
  font-family: "Pacifico", cursive;
  position: absolute;
  -webkit-text-stroke-color: #3fb7f5;
}


</style>



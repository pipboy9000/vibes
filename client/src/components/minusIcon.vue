<template>
  <div class="container">
    <div class="plus" ref="plus">
        <div class="horizontal" ref="hor"></div>
    </div>
    </div>
</template>

<script>
export default {
  props: ["size", "thickness", "color", "radius"],
  mounted() {
    this.$refs.plus.style.width = this.size + "px";
    this.$refs.plus.style.height = this.size + "px";

    this.$refs.hor.style.width = this.size + "px";
    this.$refs.hor.style.height = this.thickness + "px";
    this.$refs.hor.style.borderRadius = this.radius + "px";
    this.$refs.hor.style.background = this.color;
  }
};
</script>

<style scoped="true">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
}

.plus {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
}

.horizontal {
  position: absolute;
}
</style>

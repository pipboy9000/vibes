<template>
    <div class="plus" ref="plus">
        <div class="horizontal" ref="hor"></div>
        <div class="vertical" ref="ver"></div>
    </div>
</template>

<script>
export default {
  props: ["size", "thickness", "color"],
  mounted() {
    this.$refs.plus.style.width = this.size + "px";
    this.$refs.plus.style.height = this.size + "px";

    this.$refs.hor.style.width = this.size + "px";
    this.$refs.hor.style.height = this.thickness + "px";
    this.$refs.hor.style.borderRadius = this.thickness + "px";
    this.$refs.hor.style.background = this.color;

    this.$refs.ver.style.width = this.thickness + "px";
    this.$refs.ver.style.height = this.size + "px";
    this.$refs.ver.style.borderRadius = this.thickness + "px";
    this.$refs.ver.style.background = this.color;
  }
};
</script>

<style scoped="true">
.plus {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
}

.horizontal,
.vertical {
  position: absolute;
}
</style>

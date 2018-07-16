<template>
    <div class="wrapper">
        <div class="focusBtn"></div>
        <div class="zoom">
            <div class="zoomIn">+</div>
            <hr>
            <div class="zoomOut">-</div>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style scoped="true">
.wrapper {
  position: absolute;
  right: 0;
  bottom: 0;
  margin: 20px;
  width: 60px;
  height: 215px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.focusBtn {
  width: 60px;
  height: 60px;
  background: #22dbe3;
  border: 4px solid white;
  border-radius: 60px;
}

hr {
  margin: 0;
}

.zoom {
  width: 60px;
  height: 120px;
  background: #22dbe3;
  border: 4px solid white;
  border-radius: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  line-height: 60px;
  font-size: 39px;
  font-family: cursive;
  color: white;
}
</style>

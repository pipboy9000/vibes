<template>
  <input type="range" min="0" max="15" value="1">
</template>

<script>
export default {};
</script>

<style>
input[type="range"] {
  height: 34px;
  -webkit-appearance: none;
  margin: 10px 0;
  width: 100%;
}
input[type="range"]:focus {
  outline: none;
}
input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 10px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 0px 0px 0px #000000;
  background: #46ceff;
  border-radius: 15px;
  border: 0px solid #000000;
}
input[type="range"]::-webkit-slider-thumb {
  box-shadow: 0px 0px 0px #000000;
  border: 2px solid #46ceff;
  height: 26px;
  width: 26px;
  border-radius: 25px;
  background: #ffffff;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -9px;
}
input[type="range"]:focus::-webkit-slider-runnable-track {
  background: #46ceff;
}
input[type="range"]::-moz-range-track {
  width: 100%;
  height: 10px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 0px 0px 0px #000000;
  background: #46ceff;
  border-radius: 15px;
  border: 0px solid #000000;
}
input[type="range"]::-moz-range-thumb {
  box-shadow: 0px 0px 0px #000000;
  border: 2px solid #46ceff;
  height: 26px;
  width: 26px;
  border-radius: 25px;
  background: #ffffff;
  cursor: pointer;
}
input[type="range"]::-ms-track {
  width: 100%;
  height: 10px;
  cursor: pointer;
  animate: 0.2s;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type="range"]::-ms-fill-lower {
  background: #46ceff;
  border: 0px solid #000000;
  border-radius: 30px;
  box-shadow: 0px 0px 0px #000000;
}
input[type="range"]::-ms-fill-upper {
  background: #46ceff;
  border: 0px solid #000000;
  border-radius: 30px;
  box-shadow: 0px 0px 0px #000000;
}
input[type="range"]::-ms-thumb {
  margin-top: 1px;
  box-shadow: 0px 0px 0px #000000;
  border: 2px solid #46ceff;
  height: 26px;
  width: 26px;
  border-radius: 25px;
  background: #ffffff;
  cursor: pointer;
}
input[type="range"]:focus::-ms-fill-lower {
  background: #46ceff;
}
input[type="range"]:focus::-ms-fill-upper {
  background: #46ceff;
}
</style>

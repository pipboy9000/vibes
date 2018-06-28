<template>
    <div class="overlay">
        <div class="bg">
            <div ref="titleBg" class="titleBg"></div>
            <div ref="titleStroke" class="titleStroke">{{title}}</div>
            <input ref="title" class="title" placeholder="Title" v-model="title" @change="resizeTitle">
        </div>
    </div>
</template>

<script>
export default {
  name: "newVibeForm",
  mounted() {
    this.titleWidth = this.$refs.titleBg.clientWidth;
  },
  data() {
    return {
      title: "",
      titleWidth: null
    };
  },
  methods: {
    resizeTitle: function(e) {
      console.log(this.$refs.titleStroke.clientWidth);
    }
  }
};
</script>

<style scoped="true">
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg {
  position: relative;
  width: 100%;
  max-width: 487px;
  height: 100%;
  max-height: 520px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.titleBg {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  margin: 20px;
  height: 65px;
  border-radius: 10px;
  background: #d5effd;
}

.titleStroke {
  display: inline-block;
  position: absolute;
  transform: translateX(-50%);
  border-radius: 10px;
  background: transparent;
  height: 80px;
  font-size: 57px;
  text-align: center;
  font-family: "Pacifico", cursive;
  position: absolute;
  -webkit-text-stroke-width: 5px;
  -webkit-text-stroke-color: #3fb7f5;
  color: white;
  border: none;
  outline: none;
}

.title {
  position: absolute;
  top: 9px;
  left: 15px;
  width: calc(100% - 30px);
  border-radius: 10px;
  background: transparent;
  height: 80px;
  font-size: 57px;
  text-align: center;
  font-family: "Pacifico", cursive;
  position: absolute;
  color: white;
  border: none;
  outline: none;
}

.title::placeholder {
  color: #747474;
}
</style>



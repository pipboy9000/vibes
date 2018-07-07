<template>
    <div class="overlay">
        <div class="bg">
            <div class="titleWRapper">
                <div ref="titleBg" class="titleBg"></div>
                <div ref="titleStroke" class="titleStroke">{{title}}</div>
                <input ref="titleInput" class="title input" placeholder="Title" v-model="title" @input="resizeTitle" @keydown="resizeTitle" maxlength="50">
            </div>
            <div class="tagsWrapper">
                <div class="addTagBtn">+</div>
                <div class="addTagBtn">+</div>
                <div class="addTagBtn">+</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "newVibeForm",
  mounted() {
    this.titleWidth = this.$refs.titleBg.clientWidth - 30;
  },
  data() {
    return {
      title: "",
      titleWidth: null,
      titlePxSize: 57,
      titlePxSizeBase: 57
    };
  },
  methods: {
    resizeTitle: function(e) {
      if (this.$refs.titleStroke.clientWidth - this.titleWidth > 10) {
        this.titlePxSize--;
        this.$refs.titleStroke.style.fontSize = this.titlePxSize + "px";
        this.$refs.titleInput.style.fontSize = this.titlePxSize + "px";
        this.$nextTick(this.resizeTitle);
      } else if (
        this.$refs.titleStroke.clientWidth - this.titleWidth < -10 &&
        this.titlePxSize < this.titlePxSizeBase
      ) {
        this.titlePxSize++;
        this.$refs.titleStroke.style.fontSize = this.titlePxSize + "px";
        this.$refs.titleInput.style.fontSize = this.titlePxSize + "px";
        this.$nextTick(this.resizeTitle);
      }
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

.titleWRapper {
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
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
  position: absolute;
  border-radius: 10px;
  background: transparent;
  font-size: 57px;
  text-align: center;
  font-family: "Pacifico", cursive;
  -webkit-text-stroke-width: 5px;
  -webkit-text-stroke-color: #3fb7f5;
  color: white;
  border: none;
  outline: none;
  white-space: pre;
  top: auto;
  bottom: auto;
}

.title {
  position: absolute;
  border-radius: 10px;
  background: transparent;
  font-size: 57px;
  text-align: center;
  font-family: "Pacifico", cursive;
  color: white;
  border: none;
  outline: none;
  top: auto;
  bottom: auto;
}

.title::placeholder {
  color: #d0d0d0;
}

.input {
  width: 100%;
}

.tagsWrapper {
  width: 100%;
  padding-bottom: 70%;
}

.addTagBtn {
  width: 30vw;
  height: 30vw;
  background: red;
}
</style>



<template>
    <div class="bg">
        <div class="details">
            <div class="title"> {{vibe.title}} </div>
        </div>
        <div class="emojis">
        </div>
    </div>
</template>

<script>
export default {
  props: ["vibe"]
};
</script>

<style scoped="true">
.bg {
  width: 530px;
  height: 80px;
  margin-bottom: 16px;
  background-color: white;
  border-radius: 10px;
}

.details {
  width: 336px;
  height: 80px;
  float: left;
}

.title {
  color: black;
}

.emojis {
  width: 194px;
  height: 80px;
  float: left;
}
</style>

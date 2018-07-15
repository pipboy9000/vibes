<template>
    <div class="wrapper">
        <listItem v-for="(vibe, key) in $store.state.vibes" :key="key" :vibe="vibe"></listItem>
    </div>
</template>

<script>
import store from "../store";
import listItem from "./listItem";

export default {
  name: "list",
  components: { listItem }
};
</script>

<style scoped="true">
.wrapper{
    position: absolute;
}
</style>


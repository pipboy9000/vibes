<template>
  <div>{{title}}</div>
</template>

<script>
export default {
  name: "albumListItem",
  props: ["creatorId", "title", "createdAt"]
};
</script>

<style>
</style>

<script setup type="ts">
defineProps({
    name: String,
    category: String,
})
</script>

<template>
  <Tag v-if="name" :class="category" :value="name" />
  <Tag v-else class="untagged" value="Untagged" />
</template>

<style scoped>
.need {
  background-color: red;
}
.want {
  background-color: darkgreen;
}
.invest {
  background-color: aqua;
}
.untagged {
  font-style: italic;
  color: grey;
  background-color: aliceblue;
}
</style>

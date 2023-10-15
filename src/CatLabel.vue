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
.income {
  background-color: green;
}
.need {
  background-color: red;
}
.want {
  background-color: orange;
}
.invest {
  background-color: blue;
}
.untagged {
  font-style: italic;
  color: grey;
  background-color: aliceblue;
}
</style>

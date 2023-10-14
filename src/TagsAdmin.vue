<script setup lang="ts">
import { tags, retrieveTags, categories, addNewTag } from './lib/tagstore'
import { ref } from 'vue'
import CatLabel from './CatLabel.vue'
retrieveTags()

const newTag = ref<String>()
const addTag = async () => {
  const tagname = newTag.value
  newTag.value = ''
  await addNewTag(tagname, 'need')
}
</script>

<template>
  <Dropdown v-model="data.category" :options="categories" v-for="data in tags" key="id">
    <template #value="slotProps">
      <CatLabel :name="data.name" :category="data.category" />
    </template>
    <template #option="slotProps">
      <CatLabel :name="slotProps.option" :category="slotProps.option" />
    </template>
  </Dropdown>
  <InputText type="text" v-model="newTag" @keyup.enter="addTag" />
</template>

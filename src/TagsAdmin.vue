<script setup lang="ts">
import { tags, retrieveTags } from './lib/tagstore'
import CatLabel from './CatLabel.vue'
retrieveTags()
</script>

<template>
  <DataTable v-model:value="tags" key="id">
    <Column field="name" header="Name"></Column>
    <Column field="category" header="Category">
      <template #body="{ data }">
        <CatLabel :name="data.name" :category="data.category"/>
      </template>
    </Column>
  </DataTable>
</template>

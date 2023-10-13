<script setup lang="ts">
import { ref } from 'vue'
interface TagCategory {
  name: string
  color: string
}
interface Tag {
  id: number
  name: string
  category: TagCategory
}
const tags = ref<Tag[]>([
  { id: 1, name: 'boodschappen', category: { name: 'need', color: 'red' } },
  { id: 2, name: 'huis', category: { name: 'need', color: 'red' } },
  { id: 3, name: 'uit eten', category: { name: 'want', color: 'darkgreen' } },
  { id: 4, name: 'sparen', category: { name: 'invest', color: 'grey' } }
])
</script>

<template>
  <DataTable v-model:value="tags">
    <Column field="name" header="Name"></Column>
    <Column field="category" header="Category">
      <template #body="{ data }">
        <Tag :style="{ background: data.category.color }" :value="data.category.name" />
      </template>
    </Column>
  </DataTable>
</template>

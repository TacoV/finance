<script setup lang="ts">
import {
  tags,
  retrieveTags,
  categories,
  addNewTag,
  recategorizeTag,
  renameTag,
  deleteTag
} from './lib/tagstore'
import { ref } from 'vue'
import CatLabel from './CatLabel.vue'
import type { DataTableCellEditCompleteEvent } from 'primevue/datatable'

const newTag = ref<string>('')
const addTag = async () => {
  if (newTag.value !== '') {
    await addNewTag(newTag.value, 'need')
  }
  newTag.value = ''
}
const changeCategory = async (data: any) => {
  await recategorizeTag(data.id, data.category)
}
const onCellEditComplete = async (event: DataTableCellEditCompleteEvent) => {
  const { data, newValue } = event
  await renameTag(data.id, newValue)
}

retrieveTags()
</script>

<template>
  <DataTable :value="tags" dataKey="id" editMode="cell" @cell-edit-complete="onCellEditComplete">
    <Column field="name" header="#">
      <template #editor="{ data }">
        <InputText v-model="data.name" autofocus />
      </template>
    </Column>
    <Column header="Soort">
      <template #body="slotProps">
        <Dropdown
          v-model="slotProps.data.category"
          :options="categories"
          @change="changeCategory(slotProps.data)"
        >
          <template #value="slotProps">
            <CatLabel :name="slotProps.value" :category="slotProps.value" />
          </template>
          <template #option="slotProps">
            <CatLabel :name="slotProps.option" :category="slotProps.option" />
          </template>
        </Dropdown>
      </template>
    </Column>
    <Column header="Delete">
      <template #body="slotProps">
        <Button label="x" @click="deleteTag(slotProps.data.id)" /> </template
    ></Column>
  </DataTable>
  <InputText type="text" v-model="newTag" @keyup.enter="addTag" />
</template>

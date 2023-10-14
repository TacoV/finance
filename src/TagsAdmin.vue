<script setup lang="ts">
import {
  tags,
  retrieveTags,
  categories,
  addNewTag,
  recategorizeTag,
  renameTag
} from './lib/tagstore'
import { ref } from 'vue'
import CatLabel from './CatLabel.vue'
import type { DataTableCellEditCompleteEvent } from 'primevue/datatable'

const newTag = ref<string>()
const addTag = async () => {
  const tagname = newTag.value
  newTag.value = ''
  await addNewTag(tagname, 'need')
}
const changeCategory = async (data: Tag) => {
  await recategorizeTag(data.id, newValue)
}
const onCellEditComplete = async (event: DataTableCellEditCompleteEvent) => {
  const { data, newValue } = event
  await renameTag(data.id, newValue)
}

retrieveTags()
</script>

<template>
  <DataTable :value="tags" dataKey="id" editMode="cell" @cell-edit-complete="onCellEditComplete">
    <Column header="#">
      <template #body="slotProps">
        {{ slotProps.data.id }}
      </template>
    </Column>
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
  </DataTable>
  <InputText type="text" v-model="newTag" @keyup.enter="addTag" />
</template>

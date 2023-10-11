<script setup lang="ts">
import { FilterMatchMode } from 'primevue/api'
import { userSession, signInWithGoogle, signOut } from '@/lib/auth'
import { fileList, uploadFile, deleteFile, processFiles } from '@/lib/filestore'

import { supabase } from './lib/supabase'
import { ref } from 'vue'

const transactions = ref()

const filters = ref({
  counter_name: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

async function retrieveTopUntaggedTransactions() {
  const { data, error } = await supabase.from('transactions').select('*')
  if (error) {
    alert('Error retrieving transactions: ' + error.message)
  }
  transactions.value = data
}
</script>

<template>
  <div v-if="userSession === null">
    <Button label="Log in" @click="signInWithGoogle" />
  </div>
  <div v-else>
    <Button :disabled="fileList.length == 0" label="Process" @click="processFiles" />
    <ul>
      <li v-for="file in fileList" v-bind:key="file.name">
        {{ file.name }} -
        <button @click="deleteFile(file.name)">
          <i class="pi pi-trash"></i>
        </button>
      </li>
    </ul>
    <FileUpload
      name="csvfiles[]"
      :multiple="true"
      customUpload
      @uploader="uploadFile"
      :showUploadButton="false"
      :showCancelButton="false"
      :auto="true"
      chooseLabel="Select file(s)"
    >
      <template #empty>
        <p>Drag and drop files to here to upload.</p>
      </template></FileUpload
    >

    <Button label="List top untagged transactions" @click="retrieveTopUntaggedTransactions" />

    <DataTable
      :value="transactions"
      v-model:filters="filters"
      class="p-datatable-sm"
      filterDisplay="row"
      paginator
      :rows="50"
      tableStyle="min-width: 70rem"
    >
      <!-- https://primevue.org/datatable/#basic_filter -->
      <Column field="counter_name" header="Tegenpartij" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.counter_name }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" @input="filterCallback()" />
        </template>
      </Column>
      <Column field="bookdate" header="Datum"></Column>
      <Column field="amount" header="Bedrag"></Column>
    </DataTable>
    <Button :label="'Log out ' + userSession?.user.user_metadata.full_name" @click="signOut" />
  </div>
</template>

<script setup lang="ts">
import FileUpload from 'primevue/fileupload'
import { userSession, signInWithGoogle, signOut } from '@/lib/auth'
import { fileList, uploadFile, deleteFile, processFiles } from '@/lib/filestore'

import { supabase } from './lib/supabase'
import { ref } from 'vue'
const transactions = ref()

async function retrieveTopUntaggedTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('amount', { ascending: false })
    .limit(10)
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
    <DataTable :value="transactions" class="p-datatable-sm" tableStyle="min-width: 50rem">
      <Column field="counter_name" header="Counterparty name"></Column>
      <Column field="bookdate" header="Datum"></Column>
      <Column field="amount" header="Bedrag"></Column>
    </DataTable>
  </div>
  <div v-if="userSession !== null">
    <Button :label="'Log out ' + userSession?.user.user_metadata.full_name" @click="signOut" />
  </div>
</template>

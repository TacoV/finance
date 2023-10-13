<script setup lang="ts">
import { fileList, uploadFile, deleteFile, processFiles } from '@/lib/filestore'
</script>

<template>
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
</template>

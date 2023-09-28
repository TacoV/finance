<script setup lang="ts">
import FileUpload from 'primevue/fileupload'
import { userSession, signInWithGoogle, signOut } from '@/lib/auth'
import { fileList, uploadFile, deleteFile } from '@/lib/filestore'
</script>

<template>
  <div v-if="userSession === null">
    <Button label="Log in" @click="signInWithGoogle" />
  </div>
  <div v-else>
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
      :auto="true"
      chooseLabel="Save to storage"
    >
      <template #empty>
        <p>Drag and drop files to here to upload.</p>
      </template></FileUpload
    >

    <Button :label="'Log out ' + userSession?.user.user_metadata.full_name" @click="signOut" />
  </div>
</template>

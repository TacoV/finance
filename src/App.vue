<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'
import { type Session } from '@supabase/gotrue-js/dist/main/lib/types'
import FileUpload from 'primevue/fileupload'
import { type FileUploadUploaderEvent } from 'primevue/fileupload'

const bucketName = 'dumps'
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const userSession = ref<Session | null>(null)
const fileList = ref<any[]>([])

async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  })
  if (error) {
    alert('Error logging in: ' + error.message)
  }
}

async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    alert('Error logging out: ' + error.message)
  }
}

supabase.auth.onAuthStateChange((event, session) => {
  userSession.value = session
  if (userSession.value?.user.id) {
    retrieveFiles()
  }
})

async function uploadFile(uploadEvent: FileUploadUploaderEvent) {
  const folder = userSession.value?.user.id
  for (const bestand of uploadEvent.files as File[]) {
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(folder + '/' + bestand.name, bestand)
    if (error) {
      alert('Error uploading: ' + error.message)
    }
  }
  await retrieveFiles()
}

async function retrieveFiles() {
  const { data, error } = await supabase.storage.from(bucketName).list(userSession.value?.user.id)
  if (error) {
    alert('Error listing files: ' + error.message)
  }
  if (data) {
    fileList.value = data
  }
}
</script>

<template>
  <div v-if="userSession === null">
    <Button label="Log in" @click="signInWithGoogle" />
  </div>
  <div v-else>
    <ul>
      <li v-for="file in fileList">{{ file.name }}</li>
    </ul>
    <FileUpload mode="basic" name="csvfiles[]" customUpload @uploader="uploadFile" :auto="true" />
    <Button :label="'Log out ' + userSession?.user.user_metadata.full_name" @click="signOut" />
  </div>
</template>

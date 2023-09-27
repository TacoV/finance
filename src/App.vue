<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'
import { type Session } from '@supabase/gotrue-js/dist/main/lib/types'
import FileUpload from 'primevue/fileupload'
import { type FileUploadUploaderEvent } from 'primevue/fileupload'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
const userSession = ref<Session | null>(null)

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
})

async function uploadFile(uploadEvent: FileUploadUploaderEvent) {
  for (const bestand of uploadEvent.files as File[]) {
    const { error } = await supabase.storage.from('dumps').upload(bestand.name, bestand)
    if (error) {
      alert('Error uploading: ' + error.message)
    }
  }
}
</script>

<template>
  <p v-if="userSession === null">
    <Button label="Log in" @click="signInWithGoogle" />
  </p>
  <p v-else>
    <FileUpload mode="basic" name="csvfiles[]" customUpload @uploader="uploadFile" :auto="true" />
    <Button :label="'Log out ' + userSession?.user.user_metadata.full_name" @click="signOut" />
  </p>
</template>

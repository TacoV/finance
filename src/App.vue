<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'
import { type Session } from '@supabase/gotrue-js/dist/main/lib/types'

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
</script>

<template>
  <p v-if="userSession === null">
    <Button label="Log in" @click="signInWithGoogle" />
  </p>
  <p v-else>
    <Button :label="'Log out ' + userSession?.user.user_metadata.full_name" @click="signOut" />
  </p>
</template>

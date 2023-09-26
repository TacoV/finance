<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://my-custom-domain.com', 'public-anon-key')

function signInWithGoogle() {
  // Add login logic
  alert(import.meta.env.MODE)
}

function signOut() {
  // Add logout logic
}
</script>

<template>
  <p><Button label="Log in" @click="signInWithGoogle" /></p>
  <p><Button label="Log out" @click="signOut" /></p>
</template>

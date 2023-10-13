<script setup lang="ts">
import { userSession, signInWithGoogle, signOut } from '@/lib/auth'
</script>

<template>
  <div>
    <div v-if="userSession === null">
      <p>Om je data niet kwijt te raken of met anderen te delen, zul je even in moeten loggen</p>
      <Button label="Log in" @click="signInWithGoogle" />
    </div>
    <Button
      v-else
      :label="'Log out ' + userSession?.user.user_metadata.full_name"
      @click="signOut"
    />
  </div>
</template>

<script setup lang="ts">
import { userSession } from '@/lib/auth'
import AuthHandler from './AuthHandler.vue'
import FileHandler from './FileHandler.vue'
import TagsAdmin from './TagsAdmin.vue'
import AccountsAdmin from './AccountsAdmin.vue'
import TransactionsOverview from './TransactionsOverview.vue'
</script>

<template>
  <div>
    <div v-if="userSession !== null">
      <AccountsAdmin />
      <TagsAdmin />
      <FileHandler />
      <TransactionsOverview />
    </div>
    <AuthHandler />
  </div>
</template>

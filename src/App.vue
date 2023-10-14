<script setup lang="ts">
import { userSession } from '@/lib/auth'
import AuthHandler from './AuthHandler.vue'
import FileHandler from './FileHandler.vue'
import TagsAdmin from './TagsAdmin.vue'
import AccountsAdmin from './AccountsAdmin.vue'
import TransactionsOverview from './TransactionsOverview.vue'
</script>

<template>
  <Accordion :activeIndex="0" style="width: 1280px">
    <AccordionTab header="1 - Log in">
      <AuthHandler />
    </AccordionTab>
    <AccordionTab :disabled="userSession === null" header="2 - Upload je CSV dumps">
      <FileHandler />
    </AccordionTab>
    <AccordionTab :disabled="userSession === null" header="3 - Hernoem je rekeningen">
      <AccountsAdmin />
    </AccordionTab>
    <AccordionTab :disabled="userSession === null" header="4 - Bepaal je categorieen">
      <TagsAdmin />
    </AccordionTab>
    <AccordionTab :disabled="userSession === null" header="5 - Tag alles!">
      <TransactionsOverview />
    </AccordionTab>
    <AccordionTab :disabled="userSession === null" header="6 - Delete">
      Delete je files, je transacties of zelfs je userdata
    </AccordionTab>
  </Accordion>
</template>

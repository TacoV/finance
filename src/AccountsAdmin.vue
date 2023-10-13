<script setup lang="ts">
import { accounts, retrieveAccounts, renameAccount } from './lib/accountstore'
import type { DataTableCellEditCompleteEvent } from 'primevue/datatable'

const onCellEditComplete = async (event: DataTableCellEditCompleteEvent) => {
  const { data, newValue } = event
  await renameAccount(data.id, newValue)
}

retrieveAccounts()
</script>

<template>
  <DataTable
    v-model:value="accounts"
    dataKey="id"
    editMode="cell"
    @cell-edit-complete="onCellEditComplete"
  >
    <Column field="account_no" header="Rekeningnummer"></Column>
    <Column field="account_name" header="Korte naam">
      <template #editor="{ data }">
        <InputText v-model="data.account_name" autofocus />
      </template>
    </Column>
  </DataTable>
</template>

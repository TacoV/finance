<script setup lang="ts">
import { FilterMatchMode } from 'primevue/api'
import { supabase } from './lib/supabase'
import { ref, computed } from 'vue'

const transactions = ref()

const filters = ref({
  counter_name: { value: null, matchMode: FilterMatchMode.CONTAINS }
})
const selectedRows = ref()

interface Stats {
  count: number
  received: number
  sent: number
  total: number
}
const selectedRowsStats = computed(() => {
  const stats: Stats = {
    count: 0,
    received: 0,
    sent: 0,
    total: 0
  }
  if (selectedRows.value === undefined) {
    return stats
  }
  return selectedRows.value.reduce((runningStat: Stats, row) => {
    return {
      count: runningStat.count + 1,
      received: runningStat.received + (row.amount > 0 ? row.amount : 0),
      sent: runningStat.sent + (row.amount < 0 ? row.amount : 0),
      total: runningStat.total + row.amount
    }
  }, stats)
})

async function retrieveTransactions() {
  const { data, error } = await supabase.from('transactions_overview').select('*')
  if (error) {
    alert('Error retrieving transactions: ' + error.message)
  }
  transactions.value = data
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })
}
const categoryStyle = (category: string) => {
  const categoryColorlist = {
    need: 'red',
    want: 'darkgreen',
    invest: 'grey',
    untagged: 'lightgrey'
  }
  return { background: categoryColorlist[category] }
}
</script>

<template>
  <Button label="Retrieve transactions" @click="retrieveTransactions" />

  <div>
    Transactions: {{ selectedRowsStats.count }}<br />
    Received: {{ formatCurrency(selectedRowsStats.received) }}<br />
    Sent: {{ formatCurrency(selectedRowsStats.sent) }}<br />
    Total: {{ formatCurrency(selectedRowsStats.total) }}<br />
  </div>

  <DataTable
    :value="transactions"
    v-model:filters="filters"
    selectionMode="multiple"
    v-model:selection="selectedRows"
    dataKey="id"
    class="p-datatable-sm"
    filterDisplay="row"
    paginator
    :rows="50"
    tableStyle="min-width: 70rem"
  >
    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
    <Column field="account_name" header="Rekening"></Column>
    <Column field="counter_name" header="Tegenpartij" style="min-width: 12rem">
      <template #body="{ data }">
        {{ data.counter_name }}
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" @input="filterCallback()" />
      </template>
    </Column>
    <Column field="bookdate" header="Datum"></Column>
    <Column field="amount" header="Bedrag">
      <template #body="{ data }">
        <span :class="data.amount > 0 ? 'credit' : 'debit'">
          {{ formatCurrency(data.amount) }}
        </span>
      </template>
    </Column>
    <Column field="tag_name" header="Tag">
      <template #body="{ data }">
        <Tag
          :style="categoryStyle(data.tag_category)"
          v-if="data.tag_name"
          :value="data.tag_name"
        />
        <Tag v-else :style="categoryStyle('untagged')" value="Untagged" />
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
span.credit {
  color: darkgreen;
}
span.debit {
  color: red;
}
</style>
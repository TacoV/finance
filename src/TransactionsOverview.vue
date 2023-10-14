<script setup lang="ts">
import { FilterMatchMode } from 'primevue/api'
import { ref, computed } from 'vue'
import { tags, retrieveTags } from './lib/tagstore'
import { transactions, retrieveTransactions } from './lib/transstore'
import CatLabel from './CatLabel.vue'

const filters = ref({
  account_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  counter_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  bookdate: { value: null, matchMode: FilterMatchMode.CONTAINS },
  amount: { value: null, matchMode: FilterMatchMode.CONTAINS },
  tag_name: { value: null, matchMode: FilterMatchMode.CONTAINS }
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


const formatCurrency = (value: number) => {
  return value.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })
}

retrieveTransactions()
retrieveTags()
</script>

<template>
  <!--<Button label="Retrieve transactions" @click="retrieveTransactions" />-->

  <div>
    Transactions: {{ selectedRowsStats.count }}<br />
    Received: {{ formatCurrency(selectedRowsStats.received) }}<br />
    Sent: {{ formatCurrency(selectedRowsStats.sent) }}<br />
    Total: {{ formatCurrency(selectedRowsStats.total) }}<br />
  </div>

  <div>
    Label selection as: 
    <CatLabel v-for="tag in tags" v-bind:key="tag.name" :name="tag.name" :category="tag.category" />
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
    <Column field="account_name" header="Rekening">
      <template #body="{ data }">
        {{ data.account_name }}
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" @input="filterCallback()" />
      </template>
    </Column>
    <Column field="counter_name" header="Tegenpartij" style="min-width: 12rem">
      <template #body="{ data }">
        {{ data.counter_name }}
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" @input="filterCallback()" />
      </template>
    </Column>
    <Column field="bookdate" header="Datum">
      <template #body="{ data }">
        {{ data.bookdate }}
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" @input="filterCallback()" />
      </template>
    </Column>
    <Column field="amount" header="Bedrag">
      <template #body="{ data }">
        <span :class="data.amount > 0 ? 'credit' : 'debit'">
          {{ formatCurrency(data.amount) }}
        </span>
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" @input="filterCallback()" />
      </template>
    </Column>
    <Column field="tag_name" header="Tag">
      <template #body="{ data }">
        <CatLabel :name="data.tag_name" :category="data.tag_category" />
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" @input="filterCallback()" />
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

<script setup lang="ts">
import { FilterOperator, FilterMatchMode } from 'primevue/api'
import { ref, computed } from 'vue'
import { tags, retrieveTags, untaggedTag, type Tag } from './lib/tagstore'
import { transactions, retrieveTransactions, labelTransactions } from './lib/transstore'
import CatLabel from './CatLabel.vue'
import { accounts } from './lib/accountstore'

const filters = ref()
const initFilters = () => {
  filters.value = {
    account_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    counter_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    bookdate: { value: null, matchMode: FilterMatchMode.CONTAINS },
    amount: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    tag_name: { value: null, matchMode: FilterMatchMode.IN }
  }
}

initFilters()

const selectedRows = ref()

interface Stats {
  count: number
  received: number
  sent: number
  total: number
  perStat: any
}
const tag_names = computed<string[]>((): string[] => {
  const names = tags.value.map((tag) => tag.name)
  return ['Untagged', ...names]
})
const tagFromName = (tagname: string): Tag => {
  return tags.value.find((tag) => tag.name == tagname) ?? untaggedTag
}

// Show:
// How many transactions
// How much in, out
// (How much external, internal)
// How much per tag
// Split per month
// Split per account

const amount = () => 100 * Math.floor(Math.random() * 1000)

const transactionsPerMonth = computed(() => {
  const transactions: any[] = []
  const years = [2022, 2023]
  const months = Array.from(new Array(12), (x, i) => i + 1)
  years.forEach((year) => {
    months.forEach((month) => {
      transactions.push({ year: year, month: month, in: amount(), out: amount() })
    })
  })
  return transactions
})

const transactionsPerAccount = computed(() => {
  const transactions: any[] = []
  accounts.value.forEach((account) => {
    transactions.push({ account: account, in: amount(), out: amount() })
  })
  return transactions
})

const transactionsPerTag = computed(() => {
  const transactions: any[] = [{ tag: untaggedTag, in: amount(), out: amount() }]
  tags.value.forEach((tag) => {
    transactions.push({ tag: tag, in: amount(), out: amount() })
  })
  return transactions
})

const aggregatedPerMonth = computed(() => {
  // FOr each month:
  // what come in / went out / shifted internally
  // with what tag
  // in which account
  return [
    {
      year: 2023,
      month: 10,
      in: [
        {
          tag: { id: 1, name: 'Boodschappen', category: 'need' },
          amount: 123,
          account: { id: 2, name: 'Betaal Taco' }
        }
      ]
    }
  ]
})

const selectedRowsStats = computed(() => {
  const stats: Stats = {
    count: 0,
    received: 0,
    sent: 0,
    total: 0,
    perStat: []
  }
  tag_names.value.forEach((el) => {
    stats.perStat.push({ tag: tagFromName(el), sent: 0, received: 0 })
  })
  if (selectedRows.value === undefined) {
    return stats
  }
  return selectedRows.value.reduce((runningStat: Stats, row: any) => {
    const perStat = runningStat.perStat
    const tagStat = perStat.find((el: any) => el.tag.name == row.tag_name)
    if (tagStat) {
      tagStat.received = tagStat.received + (row.amount > 0 ? row.amount : 0)
      tagStat.sent = tagStat.sent + (row.amount < 0 ? row.amount : 0)
    }
    return {
      count: runningStat.count + 1,
      received: runningStat.received + (row.amount > 0 ? row.amount : 0),
      sent: runningStat.sent + (row.amount < 0 ? row.amount : 0),
      total: runningStat.total + row.amount,
      perStat: perStat
    }
  }, stats)
})

const formatCurrency = (value: number) => {
  return value.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })
}

const labelSelectionAs = async (tag_id: number) => {
  const data: Object[] = []
  for (const row of selectedRows.value) {
    data.push({
      transaction_no: row.transaction_no,
      tag_id: tag_id,
      account_id: row.account_id
    })
  }
  const theTag = tags.value.find((el) => el.id == tag_id)
  if (theTag === undefined) {
    throw 'Tag nog found'
  }
  await labelTransactions(data, theTag)
}

const setAccountFilter = (account) => {
  filters.value.account_name.value = account.name
}

const setTagFilter = (tag: Tag) => {
  filters.value.tag_name.value = [tag.name]
}

const setAmountFilter = (min: number, max: number) => {
  filters.value.amount = {
    operator: FilterOperator.AND,
    constraints: [
      { value: min, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
      { value: max, matchMode: FilterMatchMode.LESS_THAN_OR_EQUAL_TO }
    ]
  }
}

const clearFilter = () => {
  initFilters()
}

retrieveTransactions()
retrieveTags()
</script>

<template>
  <!--<Button label="Retrieve transactions" @click="retrieveTransactions" />-->

  <div>
    Transactions: {{ selectedRowsStats.count }}<br />
    <tr v-for="info in transactionsPerAccount">
      <td>
        <span class="credit"> {{ formatCurrency(info.in) }} </span>
      </td>
      <td>
        {{ info.account.account_name }}
      </td>
      <td>
        <span class="debit"> {{ formatCurrency(info.out) }}</span>
      </td>
    </tr>
    <tr v-for="info in transactionsPerTag">
      <td>
        <span class="credit"> {{ formatCurrency(info.in) }} </span>
      </td>
      <td>
        <CatLabel
          :name="info.tag.name"
          :category="info.tag.category"
          @click="setTagFilter(info.tag)"
        />
      </td>
      <td>
        <span class="debit"> {{ formatCurrency(info.out) }}</span>
      </td>
    </tr>
  </div>

  <DataTable
    :value="transactions"
    v-model:filters="filters"
    selectionMode="multiple"
    v-model:selection="selectedRows"
    dataKey="id"
    class="p-datatable-sm"
    filterDisplay="menu"
    paginator
    :rows="50"
    tableStyle="min-width: 70rem"
  >
    <template #header>
      <div class="flex justify-content-between align-items-end">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          outlined
          @click="clearFilter()"
        />
        <span>
          Label as:
          <CatLabel
            v-for="tag in tags"
            v-bind:key="tag.id"
            :name="tag.name"
            :category="tag.category"
            class="ml-2"
            @click="labelSelectionAs(tag.id)"
          />
        </span>
      </div>
    </template>
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
    <Column field="amount" dataType="numeric" header="Bedrag">
      <template #body="{ data }">
        <span :class="data.amount > 0 ? 'credit' : 'debit'">
          {{ formatCurrency(data.amount) }}
        </span>
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" @input="filterCallback()" />
      </template>
    </Column>
    <Column field="tag_name" header="Tag" :showFilterMatchModes="false">
      <template #filter="{ filterModel, filterCallback }">
        <MultiSelect
          v-model="filterModel.value"
          @change="filterCallback()"
          :options="tag_names"
          placeholder="Tag(s)"
        >
          <template #option="slotProps">
            <CatLabel
              :name="tagFromName(slotProps.option).name"
              :category="tagFromName(slotProps.option).category"
            />
          </template>
          <template #value="slotProps">
            <CatLabel
              :name="tagFromName(slotProps.value).name"
              :category="tagFromName(slotProps.value).category"
              v-if="slotProps.value && slotProps.value.length == 1"
            />
            <span v-if="slotProps.value && slotProps.value.length > 1"
              >{{ slotProps.value.length }} tags</span
            >
          </template>
        </MultiSelect>
      </template>
      <template #body="{ data }">
        <CatLabel :name="data.tag_name" :category="data.tag_category" />
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

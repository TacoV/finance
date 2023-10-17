import { supabase } from './supabase'
import { ref } from 'vue'
import type { Tag } from './tagstore'

const transactions = ref()

async function retrieveTransactions() {
  const { data, error } = await supabase.from('transactions_overview').select('*')
  if (error) {
    alert('Error retrieving transactions: ' + error.message)
  }
  data?.map(el => { el.tag_name = el.tag_name ?? 'Untagged'; return el })
  transactions.value = data
}

async function labelTransactions(newinfo: any[], tag: Tag) {
  const { error } = await supabase.from('transactions_tags').upsert(newinfo)
  if (error) {
    alert('Error labeling transactions: ' + error.message)
  } else {
    newinfo.forEach((info) => {
      const myTransaction = transactions.value.find(
        (el: any) => el.transaction_no == info.transaction_no && el.account_id == info.account_id
      )
      myTransaction.tag_category = tag.category
      myTransaction.tag_name = tag.name
    })
  }
}

export { transactions, retrieveTransactions, labelTransactions }

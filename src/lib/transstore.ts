import { supabase } from './supabase'
import { ref } from 'vue'

const transactions = ref()

async function retrieveTransactions() {
  const { data, error } = await supabase.from('transactions_overview').select('*')
  if (error) {
    alert('Error retrieving transactions: ' + error.message)
  }
  transactions.value = data
}

async function labelTransactions(newinfo: any[]) {
  const { error } = await supabase.from('transactions_tags').upsert(newinfo)
  if (error) {
    alert('Error labeling transactions: ' + error.message)
  } else {
    newinfo.forEach((info) => {
      console.log(info)
      transactions.value.find(
        (el: any) => el.transaction_no == info.transaction_no && el.account_id == info.account_id
      ).tag_name = 'Boodschappen' // info.tag_name
    })
  }
}

export { transactions, retrieveTransactions, labelTransactions }

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

export { transactions, retrieveTransactions }

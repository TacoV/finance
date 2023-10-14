import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

const accounts = ref<any[]>([])

async function retrieveAccounts() {
  const { error, data } = await supabase.from('accounts').select().order('account_no')
  if (error) {
    console.log('Error retrieving accounts', error.message)
  }

  if (data) {
    accounts.value = data
  }
}

async function renameAccount(account_id: number, account_name: string) {
  const { error } = await supabase
    .from('accounts')
    .update({ account_name: account_name })
    .eq('id', account_id)
  if (error) {
    console.log('Error renaming account', error.message)
  } else {
    accounts.value.find((el) => el.id === account_id).account_name = account_name
  }
}

export { accounts, retrieveAccounts, renameAccount }

// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { parse } from 'https://esm.sh/csv-parse/sync'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

function parseNumber(unparsed: String): Number {
  return parseFloat(unparsed.replace(',', '.').replace(' ', ''))
}

const knownAccounts = []
async function getAccountIdFromAccountNo(supabase, account_no: string): Promise<number> {
  if (knownAccounts[account_no]) {
    return knownAccounts[account_no]
  }
  await supabase.from('accounts').insert({ account_no: account_no, account_name: account_no })
  const { error, data } = await supabase.from('accounts').select('id').eq('account_no', account_no)
  if (error) {
    console.log('Error retrieving account_id', error.message)
  }
  knownAccounts[account_no] = data[0]?.id
  return knownAccounts[account_no]
}

async function processFilesForAuthenticatedUser(supabase) {
  // Retrieve authenticated user
  const {
    data: { user }
  } = await supabase.auth.getUser()

  // Delete all your transactions
  await supabase
    .from('transactions')
    .delete()
    .eq('owner', user?.id)

  // Retrieve list of all files in the bucket
  const bucketName = 'dumps'
  const { data: uploadedFiles } = await supabase.storage.from(bucketName).list(user?.id)

  // Loop through the files one by one
  for (const uploadedFile of uploadedFiles) {
    const { data: singleFile } = await supabase.storage
      .from(bucketName)
      .download(user?.id + '/' + uploadedFile.name)
    const content = await singleFile.text()
    const info = parse(content, {
      columns: true,
      skip_empty_lines: true
    })

    // Loop through each CSV row
    const rows = [] as Object[]
    for (const record of info) {
      rows.push({
        account_id: await getAccountIdFromAccountNo(supabase, record['IBAN/BBAN']),
        transaction_no: record['Volgnr'],
        owner: user?.id,
        counter_account: record['Tegenrekening IBAN/BBAN'],
        counter_name: record['Naam tegenpartij'],
        amount: parseNumber(record['Bedrag']),
        bookdate: record['Datum'],
        description: record['Transactiereferentie'],
        eventual_name: record['"Naam uiteindelijke partij'],
        initiating_name: record['Naam initiërende partij'],
        book_code: record['Code'],
        description1: record['Omschrijving-1'],
        description2: record['Omschrijving-2'],
        description3: record['Omschrijving-3']
      })
    }
    console.log('rows', rows)

    const { error } = await supabase.from('transactions').insert(rows)
    if (error) {
      console.log('Error inserting records', error.message)
    }
  }
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    processFilesForAuthenticatedUser(supabaseClient)

    return new Response(JSON.stringify({ message: 'Processing started' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})

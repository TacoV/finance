// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

async function processFilesForAuthenticatedUser(supabase: SupabaseClient) {
  // Retrieve authenticated user
  const {
    data: { user }
  } = await supabase.auth.getUser()

  // Delete all transactions optionally

  // Retrieve list of all files in the bucket
  const bucketName = 'dumps'
  const { data, error } = await supabase.storage.from(bucketName).list(user?.id)
  if (error) {
    alert('Error listing files: ' + error.message)
    return
  }

  // Loop through the files one by one
  for (const row of data) {
    console.log(row)
    // Loop through each CSV row one by one
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

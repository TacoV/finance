import { createClient } from '@supabase/supabase-js'
import { type Database } from '../../shared/generated-types'

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Tag = Tables<'tags'>
export type Account = Tables<'accounts'>
export type Transaction = Tables<'transactions'>

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
)

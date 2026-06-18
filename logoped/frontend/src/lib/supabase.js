import { createClient } from '@supabase/supabase-js'

// TODO: add your Supabase values to .env
// VITE_SUPABASE_URL=https://your-project-id.supabase.co
// VITE_SUPABASE_ANON_KEY=your-anon-public-key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const hasRealSupabaseUrl =
  Boolean(supabaseUrl) && !supabaseUrl.includes('your-project-id')

const hasRealSupabaseKey =
  Boolean(supabaseAnonKey) && supabaseAnonKey !== 'your-anon-public-key'

export const isSupabaseConfigured = hasRealSupabaseUrl && hasRealSupabaseKey

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

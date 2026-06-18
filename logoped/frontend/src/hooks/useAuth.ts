import { isSupabaseConfigured, supabase } from '../lib/supabase'

export type AuthResult = {
  ok: boolean
  error?: string
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      ok: false,
      error: 'Supabase ещё не подключён. Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в .env',
    }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { ok: false, error: error.message }
  }

  return { ok: true }
}

export async function signUp(
  email: string,
  password: string,
  username: string,
): Promise<AuthResult> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      ok: false,
      error: 'Supabase ещё не подключён. Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в .env',
    }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  })

  if (error) {
    return { ok: false, error: error.message }
  }

  return { ok: true }
}

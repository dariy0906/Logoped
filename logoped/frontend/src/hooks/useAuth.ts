import { isSupabaseConfigured, supabase } from '../lib/supabase'
import {
  loginBackendUser,
  registerBackendUser,
} from '../features/auth/api/backendAuth'

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

  try {
    await loginBackendUser(email, password)
  } catch {
    return { ok: false, error: 'Backend auth is not available right now' }
  }

  return { ok: true }
}

export async function signUp(
  email: string,
  password: string,
  username: string,
  role: 'child' | 'parent' = 'child',
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
        role,
      },
    },
  })

  if (error) {
    return { ok: false, error: error.message }
  }

  try {
    await registerBackendUser(email, password, username, role)
  } catch {
    return { ok: false, error: 'Backend auth is not available right now' }
  }

  return { ok: true }
}

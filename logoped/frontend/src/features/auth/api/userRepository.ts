import { isSupabaseConfigured, supabase } from '../../../lib/supabase'
import {
  createDefaultProgress,
  createDefaultStatistics,
} from '../model/progress'
import type {
  SpeechAnalysisResult,
  UserProfile,
  UserProgress,
  UserRole,
} from '../model/types'

type SupabaseUser = {
  id: string
  email?: string
  user_metadata?: {
    username?: string
  }
}

function getFallbackUsername(user: SupabaseUser) {
  return user.user_metadata?.username ?? user.email?.split('@')[0] ?? 'Пользователь'
}

function normalizeProfile(user: SupabaseUser, profile: Partial<UserProfile> | null): UserProfile {
  return {
    id: user.id,
    username: profile?.username ?? getFallbackUsername(user),
    email: profile?.email ?? user.email ?? '',
    role: profile?.role ?? null,
    level: profile?.level ?? 1,
    xp: profile?.xp ?? 0,
    created_at: profile?.created_at ?? new Date().toISOString(),
    parent_id: profile?.parent_id ?? null,
    child_id: profile?.child_id ?? null,
  }
}

function normalizeProgress(userId: string, progress: Partial<UserProgress> | null): UserProgress {
  return {
    id: progress?.id,
    user_id: userId,
    level: progress?.level ?? 1,
    xp: progress?.xp ?? 0,
    achievements: progress?.achievements ?? [],
    statistics: progress?.statistics ?? createDefaultStatistics(),
    ai_history: progress?.ai_history ?? [],
    updated_at: progress?.updated_at,
  }
}

export async function ensureUserProfile(user: SupabaseUser): Promise<UserProfile | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null
  }

  const fallbackProfile = normalizeProfile(user, null)

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (existingProfile) {
    return normalizeProfile(user, existingProfile)
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert(fallbackProfile)
    .select('*')
    .single()

  if (error) {
    console.warn('Could not create profile:', error.message)
    return fallbackProfile
  }

  await ensureUserProgress(user.id)
  return normalizeProfile(user, data)
}

export async function getUserProfile(user: SupabaseUser): Promise<UserProfile | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    console.warn('Could not load profile:', error.message)
    return normalizeProfile(user, null)
  }

  return data ? normalizeProfile(user, data) : ensureUserProfile(user)
}

export async function updateUserRole(
  user: SupabaseUser,
  role: UserRole,
): Promise<UserProfile | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        username: getFallbackUsername(user),
        email: user.email ?? '',
        role,
        level: 1,
        xp: 0,
        parent_id: null,
        child_id: null,
      },
      { onConflict: 'id' },
    )
    .select('*')
    .single()

  if (error) {
    console.warn('Could not update role:', error.message)
    return normalizeProfile(user, { role })
  }

  return normalizeProfile(user, data)
}

export async function ensureUserProgress(userId: string): Promise<UserProgress> {
  const fallbackProgress = createDefaultProgress(userId)

  if (!isSupabaseConfigured || !supabase) {
    return fallbackProgress
  }

  const { data: existingProgress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (existingProgress) {
    return normalizeProgress(userId, existingProgress)
  }

  const { data, error } = await supabase
    .from('user_progress')
    .insert(fallbackProgress)
    .select('*')
    .single()

  if (error) {
    console.warn('Could not create progress:', error.message)
    return fallbackProgress
  }

  return normalizeProgress(userId, data)
}

export async function saveUserProgress(progress: UserProgress): Promise<UserProgress> {
  if (!isSupabaseConfigured || !supabase) {
    return progress
  }

  const { data, error } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id: progress.user_id,
        level: progress.level,
        xp: progress.xp,
        achievements: progress.achievements,
        statistics: progress.statistics,
        ai_history: progress.ai_history,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )
    .select('*')
    .single()

  if (error) {
    console.warn('Could not save progress:', error.message)
    return progress
  }

  await supabase
    .from('profiles')
    .update({ level: progress.level, xp: progress.xp })
    .eq('id', progress.user_id)

  return normalizeProgress(progress.user_id, data)
}

export async function saveSpeechAnalysisHistory(
  userId: string,
  text: string,
  result: SpeechAnalysisResult,
) {
  if (!isSupabaseConfigured || !supabase) {
    return
  }

  const { error } = await supabase.from('speech_analysis_history').insert({
    user_id: userId,
    child_id: userId,
    input_text: text,
    score: result.score,
    clarity: result.clarity,
    speech_quality: result.speechQuality,
    effort: result.effort,
    praises: result.praises,
    suggestion: result.suggestion,
  })

  if (error) {
    console.warn('Could not save speech history:', error.message)
  }
}

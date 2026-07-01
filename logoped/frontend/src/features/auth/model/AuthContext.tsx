import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { clearBackendAccessToken, updateBackendUserRole } from '../api/backendAuth'
import { isSupabaseConfigured, supabase } from '../../../lib/supabase'
import {
  ensureUserProfile,
  ensureUserProgress,
  getUserProfile,
  saveSpeechAnalysisHistory,
  saveUserProgress,
  updateUserRole,
} from '../api/userRepository'
import { applySpeechResultToProgress, createDefaultProgress } from './progress'
import type { SpeechAnalysisResult, UserProfile, UserProgress, UserRole } from './types'

type AuthUser = {
  id: string
  email?: string
  user_metadata?: {
    username?: string
  }
}

type AuthContextValue = {
  user: AuthUser | null
  profile: UserProfile | null
  progress: UserProgress | null
  isLoading: boolean
  isAuthenticated: boolean
  refreshUserData: () => Promise<void>
  selectRole: (role: UserRole) => Promise<void>
  saveTrainingResult: (text: string, result: SpeechAnalysisResult) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

type AuthProviderProps = {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  async function loadUserData(nextUser: AuthUser | null) {
    if (!nextUser) {
      setProfile(null)
      setProgress(null)
      return
    }

    const nextProfile = await getUserProfile(nextUser)
    const nextProgress = await ensureUserProgress(nextUser.id)

    setProfile(nextProfile)
    setProgress(nextProgress)
  }

  async function refreshUserData() {
    await loadUserData(user)
  }

  useEffect(() => {
    let isMounted = true

    async function restoreSession() {
      if (!isSupabaseConfigured || !supabase) {
        setIsLoading(false)
        return
      }

      const { data } = await supabase.auth.getSession()
      const sessionUser = data.session?.user ?? null

      if (!isMounted) {
        return
      }

      setUser(sessionUser)
      await loadUserData(sessionUser)
      setIsLoading(false)
    }

    restoreSession()

    if (!isSupabaseConfigured || !supabase) {
      return () => {
        isMounted = false
      }
    }

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = session?.user ?? null

      setUser(nextUser)

      if (nextUser) {
        await ensureUserProfile(nextUser)
      }

      await loadUserData(nextUser)
    })

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  async function selectRole(role: UserRole) {
    if (!user) {
      return
    }

    try {
      await updateBackendUserRole(role)
    } catch (error) {
      console.warn('Could not update backend role:', error)
      throw error
    }

    const nextProfile = await updateUserRole(user, role)
    setProfile(nextProfile)

    if (!progress) {
      setProgress(createDefaultProgress(user.id))
    }
  }

  async function saveTrainingResult(text: string, result: SpeechAnalysisResult) {
    if (!user) {
      return
    }

    const currentProgress = progress ?? createDefaultProgress(user.id)
    const nextProgress = applySpeechResultToProgress(currentProgress, result)
    setProgress(nextProgress)

    const savedProgress = await saveUserProgress(nextProgress)
    setProgress(savedProgress)
    await saveSpeechAnalysisHistory(user.id, text, result)
    await refreshUserData()
  }

  async function logout() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut()
    }

    clearBackendAccessToken()

    setUser(null)
    setProfile(null)
    setProgress(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      progress,
      isLoading,
      isAuthenticated: Boolean(user),
      refreshUserData,
      selectRole,
      saveTrainingResult,
      logout,
    }),
    [user, profile, progress, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthSession() {
  const value = useContext(AuthContext)

  if (!value) {
    throw new Error('useAuthSession must be used inside AuthProvider')
  }

  return value
}

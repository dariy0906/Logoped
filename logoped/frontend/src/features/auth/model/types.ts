export type UserRole = 'child' | 'parent'

export type UserProfile = {
  id: string
  username: string
  email: string
  role: UserRole | null
  level: number
  xp: number
  created_at: string
  parent_id: string | null
  child_id: string | null
}

export type UserStatistics = {
  trainingsCompleted: number
  bestScore: number
  averageScore: number
  totalScore: number
  aiAnalysesCompleted: number
}

export type SpeechAnalysisResult = {
  score: number
  level: number
  clarity: number
  speechQuality: number
  effort: number
  praises: [string, string]
  suggestion: string
}

export type UserProgress = {
  id?: string
  user_id: string
  level: number
  xp: number
  achievements: string[]
  statistics: UserStatistics
  ai_history: SpeechAnalysisResult[]
  updated_at?: string
}

import { isSupabaseConfigured, supabase } from '../../../lib/supabase'
import type { SpeechAnalysisResult } from '../../auth/model/types'
import { getLevelFromXp } from '../../auth/model/progress'

function clampScore(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)))
}

function createLocalFallbackAnalysis(text: string): SpeechAnalysisResult {
  const lengthBonus = Math.min(20, text.trim().length)
  const score = clampScore(72 + lengthBonus)

  return {
    score,
    level: getLevelFromXp(score),
    clarity: clampScore(score - 3),
    speechQuality: clampScore(score),
    effort: clampScore(score + 5),
    praises: ['Ты отлично постарался!', 'У тебя становится всё лучше!'],
    suggestion: 'Попробуй говорить чуть медленнее ❤️',
  }
}

function normalizeAnalysisResult(data: Partial<SpeechAnalysisResult>, text: string) {
  const fallback = createLocalFallbackAnalysis(text)

  return {
    score: clampScore(data.score ?? fallback.score),
    level: data.level ?? fallback.level,
    clarity: clampScore(data.clarity ?? fallback.clarity),
    speechQuality: clampScore(data.speechQuality ?? fallback.speechQuality),
    effort: clampScore(data.effort ?? fallback.effort),
    praises:
      Array.isArray(data.praises) && data.praises.length >= 2
        ? [data.praises[0], data.praises[1]]
        : fallback.praises,
    suggestion: data.suggestion ?? fallback.suggestion,
  } satisfies SpeechAnalysisResult
}

export async function analyzeChildSpeech(text: string): Promise<SpeechAnalysisResult> {
  const cleanText = text.trim()

  if (!cleanText) {
    throw new Error('Введите текст для анализа')
  }

  if (!isSupabaseConfigured || !supabase) {
    return createLocalFallbackAnalysis(cleanText)
  }

  const { data, error } = await supabase.functions.invoke('analyze-child-speech', {
    body: { text: cleanText },
  })

  if (error) {
    console.warn('AI speech analysis fallback:', error.message)
    return createLocalFallbackAnalysis(cleanText)
  }

  return normalizeAnalysisResult(data, cleanText)
}

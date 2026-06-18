import type { SpeechAnalysisResult, UserProgress, UserStatistics } from './types'

export const XP_PER_LEVEL = 100

export function createDefaultStatistics(): UserStatistics {
  return {
    trainingsCompleted: 0,
    bestScore: 0,
    averageScore: 0,
    totalScore: 0,
    aiAnalysesCompleted: 0,
  }
}

export function createDefaultProgress(userId: string): UserProgress {
  return {
    user_id: userId,
    level: 1,
    xp: 0,
    achievements: [],
    statistics: createDefaultStatistics(),
    ai_history: [],
  }
}

export function getLevelFromXp(xp: number) {
  return Math.max(1, Math.floor(xp / XP_PER_LEVEL) + 1)
}

export function getXpReward(score: number) {
  return Math.max(10, Math.round(score / 2))
}

export function applySpeechResultToProgress(
  progress: UserProgress,
  result: SpeechAnalysisResult,
): UserProgress {
  const earnedXp = getXpReward(result.score)
  const nextXp = progress.xp + earnedXp
  const trainingsCompleted = progress.statistics.trainingsCompleted + 1
  const totalScore = progress.statistics.totalScore + result.score
  const achievements = new Set(progress.achievements)

  if (result.score >= 80) {
    achievements.add('Сильный старт')
  }

  if (trainingsCompleted >= 5) {
    achievements.add('Пять тренировок')
  }

  return {
    ...progress,
    level: getLevelFromXp(nextXp),
    xp: nextXp,
    achievements: Array.from(achievements),
    statistics: {
      trainingsCompleted,
      bestScore: Math.max(progress.statistics.bestScore, result.score),
      averageScore: Math.round(totalScore / trainingsCompleted),
      totalScore,
      aiAnalysesCompleted: progress.statistics.aiAnalysesCompleted + 1,
    },
    ai_history: [result, ...progress.ai_history].slice(0, 20),
  }
}

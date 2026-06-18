import type { FeedItem } from '../model/types'

type FeedCardResponse = {
  id?: unknown
  character?: unknown
  trend?: unknown
  phrase?: unknown
  voiceType?: unknown
  voiceEmotion?: unknown
  image?: unknown
  video?: unknown
  audio?: unknown
  color?: unknown
  difficulty?: unknown
}

const DEFAULT_API_URL = 'http://localhost:3000'

function getApiUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL ?? DEFAULT_API_URL
  return configuredUrl.replace(/\/$/, '')
}

function optionalString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : undefined
}

function normalizeFeedCard(card: FeedCardResponse): FeedItem {
  return {
    id: Number(card.id),
    character: String(card.character ?? ''),
    trend: String(card.trend ?? ''),
    phrase: String(card.phrase ?? ''),
    voiceType: optionalString(card.voiceType),
    voiceEmotion: optionalString(card.voiceEmotion),
    image: optionalString(card.image),
    video: optionalString(card.video),
    audio: optionalString(card.audio),
    color: optionalString(card.color) ?? '#22d3ee',
    difficulty: Number(card.difficulty ?? 1),
  }
}

export async function fetchFeedCards(signal?: AbortSignal): Promise<FeedItem[]> {
  const response = await fetch(`${getApiUrl()}/cards`, {
    signal,
  })

  if (!response.ok) {
    throw new Error(`Cards request failed with ${response.status}`)
  }

  const data: unknown = await response.json()

  if (!Array.isArray(data)) {
    throw new Error('Cards response should be an array')
  }

  return data.map(normalizeFeedCard).filter((card) => {
    return Number.isFinite(card.id) && card.character && card.phrase
  })
}

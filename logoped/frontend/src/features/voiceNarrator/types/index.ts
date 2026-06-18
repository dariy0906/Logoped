export type VoiceProvider = 'fake' | 'xtts-v2' | 'melo-tts' | 'huggingface-inference'

export type VoicePlaybackStatus = 'idle' | 'loading' | 'playing' | 'finished' | 'error'

export type VoiceNarrationRequest = {
  id: string
  text: string
  character?: string
  voiceType?: string
  voiceEmotion?: string
  audio?: string
  provider?: VoiceProvider
}

export type VoiceNarration = {
  id: string
  text: string
  character?: string
  voiceType: string
  voiceEmotion: string
  audio?: string
  provider: VoiceProvider
  durationMs: number
}

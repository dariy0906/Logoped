import type { VoiceProvider } from '../types'

export const DEFAULT_VOICE_TYPE = 'friendly-child-coach'
export const DEFAULT_VOICE_EMOTION = 'playful'

export const VOICE_PROVIDERS: Record<
  VoiceProvider,
  {
    label: string
    supportsCharacterVoices: boolean
    supportsEmotion: boolean
  }
> = {
  fake: {
    label: 'Fake local narration',
    supportsCharacterVoices: true,
    supportsEmotion: true,
  },
  'xtts-v2': {
    label: 'XTTS v2',
    supportsCharacterVoices: true,
    supportsEmotion: true,
  },
  'melo-tts': {
    label: 'MeloTTS',
    supportsCharacterVoices: false,
    supportsEmotion: true,
  },
  'huggingface-inference': {
    label: 'HuggingFace Inference',
    supportsCharacterVoices: true,
    supportsEmotion: true,
  },
}

export function resolveVoiceType(voiceType?: string) {
  return voiceType ?? DEFAULT_VOICE_TYPE
}

export function resolveVoiceEmotion(voiceEmotion?: string) {
  return voiceEmotion ?? DEFAULT_VOICE_EMOTION
}

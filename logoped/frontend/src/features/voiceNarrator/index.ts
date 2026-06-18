export { createFeedNarrationText, createResultNarrationText } from './lib/createNarrationText'
export { VOICE_PROVIDERS } from './model/voicePresets'
export { generateVoiceNarration } from './services/generateVoiceNarration'
export { useVoiceNarration } from './hooks/useVoiceNarration'
export type {
  VoiceNarration,
  VoiceNarrationRequest,
  VoicePlaybackStatus,
  VoiceProvider,
} from './types'

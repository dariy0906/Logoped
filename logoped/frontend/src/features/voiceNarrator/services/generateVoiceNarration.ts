import {
  resolveVoiceEmotion,
  resolveVoiceType,
} from '../model/voicePresets'
import type { VoiceNarration, VoiceNarrationRequest } from '../types'

const MIN_FAKE_DURATION_MS = 900
const WORD_DURATION_MS = 150

function getFakeDurationMs(text: string) {
  return Math.max(MIN_FAKE_DURATION_MS, text.split(/\s+/).length * WORD_DURATION_MS)
}

export async function generateVoiceNarration(
  request: VoiceNarrationRequest,
): Promise<VoiceNarration> {
  return {
    id: request.id,
    text: request.text,
    character: request.character,
    voiceType: resolveVoiceType(request.voiceType),
    voiceEmotion: resolveVoiceEmotion(request.voiceEmotion),
    audio: request.audio,
    provider: request.provider ?? 'fake',
    durationMs: getFakeDurationMs(request.text),
  }
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { generateVoiceNarration } from '../services/generateVoiceNarration'
import type {
  VoiceNarration,
  VoicePlaybackStatus,
  VoiceProvider,
} from '../types'

type UseVoiceNarrationOptions = {
  id: string
  text: string
  character?: string
  voiceType?: string
  voiceEmotion?: string
  audio?: string
  provider?: VoiceProvider
  autoplay?: boolean
  enabled?: boolean
}

export function useVoiceNarration({
  id,
  text,
  character,
  voiceType,
  voiceEmotion,
  audio,
  provider,
  autoplay = false,
  enabled = true,
}: UseVoiceNarrationOptions) {
  const [status, setStatus] = useState<VoicePlaybackStatus>('idle')
  const [narration, setNarration] = useState<VoiceNarration | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playbackIdRef = useRef(0)
  const timeoutRef = useRef<number | null>(null)

  const clearPlayback = useCallback(() => {
    playbackIdRef.current += 1

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
  }, [])

  const stop = useCallback(() => {
    clearPlayback()
    setStatus('idle')
  }, [clearPlayback])

  const play = useCallback(async () => {
    if (!enabled || !text.trim()) return

    clearPlayback()
    const playbackId = playbackIdRef.current
    setStatus('loading')

    try {
      const nextNarration = await generateVoiceNarration({
        id,
        text,
        character,
        voiceType,
        voiceEmotion,
        audio,
        provider,
      })

      if (playbackId !== playbackIdRef.current) return

      setNarration(nextNarration)
      setStatus('playing')

      if (nextNarration.audio) {
        const audioElement = new Audio(nextNarration.audio)
        audioRef.current = audioElement
        audioElement.onended = () => {
          if (playbackId === playbackIdRef.current) {
            setStatus('finished')
          }
        }
        audioElement.onerror = () => {
          if (playbackId === playbackIdRef.current) {
            setStatus('error')
          }
        }
        await audioElement.play()
        return
      }

      timeoutRef.current = window.setTimeout(() => {
        if (playbackId === playbackIdRef.current) {
          setStatus('finished')
        }
      }, nextNarration.durationMs)
    } catch {
      if (playbackId === playbackIdRef.current) {
        setStatus('error')
      }
    }
  }, [
    audio,
    character,
    clearPlayback,
    enabled,
    id,
    provider,
    text,
    voiceEmotion,
    voiceType,
  ])

  useEffect(() => {
    if (!enabled) {
      stop()
    }
  }, [enabled, stop])

  useEffect(() => {
    if (!autoplay || !enabled) return

    void play()

    return () => {
      clearPlayback()
    }
  }, [autoplay, clearPlayback, enabled, play])

  useEffect(() => {
    return () => {
      clearPlayback()
    }
  }, [clearPlayback])

  return {
    status,
    narration,
    isPlaying: status === 'playing',
    play,
    replay: play,
    stop,
  }
}

import { motion } from 'framer-motion'
import type { FeedItem } from '../model/types'
import {
  createFeedNarrationText,
  useVoiceNarration,
} from '../../voiceNarrator'

type PhotoFeedCardProps = {
  item: FeedItem
  isActive: boolean
}

export function PhotoFeedCard({ item, isActive }: PhotoFeedCardProps) {
  const voice = useVoiceNarration({
    id: `photo-feed-card-${item.id}`,
    text: createFeedNarrationText(item),
    character: item.character,
    voiceType: item.voiceType,
    voiceEmotion: item.voiceEmotion,
    audio: item.audio,
    autoplay: isActive,
    enabled: isActive,
  })

  return (
    <article className="relative h-svh w-full overflow-hidden bg-zinc-950 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: item.image ? `url(${item.image})` : undefined,
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            `radial-gradient(circle at 52% 28%, ${item.color}66, transparent 18rem), ` +
            'linear-gradient(180deg, rgba(9,9,11,0.12) 0%, rgba(9,9,11,0.25) 38%, rgba(9,9,11,0.94) 100%)',
        }}
      />

      <motion.div
        className="absolute inset-x-5 bottom-8 z-10 grid gap-5"
        initial={false}
        animate={{
          opacity: isActive ? 1 : 0.45,
          y: isActive ? 0 : 20,
        }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="grid h-14 w-14 place-items-center rounded-2xl text-xl font-black text-zinc-950 shadow-xl shadow-black/30"
            style={{ backgroundColor: item.color }}
          >
            {item.character.slice(0, 1)}
          </div>
          <div>
            <h2 className="text-xl font-black leading-tight">{item.character}</h2>
            <p className="text-sm font-bold text-white/70">#{item.trend}</p>
          </div>
        </div>

        <p className="max-w-80 text-4xl font-black leading-[0.98] tracking-normal">
          {item.phrase}
        </p>

        <div className="flex items-center gap-3 text-xs font-black uppercase tracking-normal text-white/70">
          <span className="rounded-full bg-white/12 px-3 py-2 backdrop-blur-xl">
            Фото
          </span>
          <span className="rounded-full bg-white/12 px-3 py-2 backdrop-blur-xl">
            Level {item.difficulty}
          </span>
          <button
            type="button"
            className="ml-auto grid h-11 w-11 place-items-center rounded-full bg-white text-sm font-black text-zinc-950 shadow-xl shadow-black/30 transition hover:bg-zinc-200 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-cyan-300 disabled:cursor-wait disabled:opacity-70"
            onClick={voice.replay}
            disabled={voice.status === 'loading'}
            aria-label="Повторить озвучку карточки"
            title="Повторить озвучку"
          >
            <span aria-hidden="true">{voice.isPlaying ? 'II' : '▶'}</span>
          </button>
        </div>
      </motion.div>
    </article>
  )
}

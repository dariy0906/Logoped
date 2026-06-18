import type { FeedItem } from '../model/types'
import {
  createFeedNarrationText,
  useVoiceNarration,
} from '../../voiceNarrator'
import './FeedCard.css'

type FeedCardProps = {
  item: FeedItem
  onRepeat: () => void
  autoplayNarration?: boolean
}

export function FeedCard({
  item,
  onRepeat,
  autoplayNarration = true,
}: FeedCardProps) {
  const voice = useVoiceNarration({
    id: `feed-card-${item.id}`,
    text: createFeedNarrationText(item),
    character: item.character,
    voiceType: item.voiceType,
    voiceEmotion: item.voiceEmotion,
    audio: item.audio,
    autoplay: autoplayNarration,
  })

  return (
    <article className="feed-card" aria-labelledby={`feed-card-${item.id}`}>
      {item.video && (
        <video
          className="feed-card__media"
          src={item.video}
          autoPlay
          loop
          muted
          playsInline
        />
      )}

      {!item.video && item.image && (
        <img className="feed-card__media" src={item.image} alt="" />
      )}

      <div className="feed-card__visual" aria-hidden="true">
        <span>{item.character.slice(0, 2)}</span>
      </div>

      <div className="feed-card__overlay" />

      <div className="feed-card__content">
        <div className="feed-card__meta">
          <span className="feed-card__trend">{item.trend}</span>
          <span className="feed-card__difficulty">Level {item.difficulty}</span>
        </div>

        <div className="feed-card__body">
          <h2 className="feed-card__character" id={`feed-card-${item.id}`}>
            {item.character}
          </h2>
          <p className="feed-card__phrase">{item.phrase}</p>
        </div>

        <div className="feed-card__actions">
          <button className="feed-card__repeat" type="button" onClick={onRepeat}>
            Повтори
          </button>
          <button
            className="feed-card__voice"
            type="button"
            onClick={voice.replay}
            aria-label="Повторить озвучку карточки"
            title="Повторить озвучку"
          >
            <span aria-hidden="true">{voice.isPlaying ? 'II' : '▶'}</span>
          </button>
        </div>
      </div>
    </article>
  )
}

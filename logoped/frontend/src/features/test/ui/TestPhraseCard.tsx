import type { FeedItem } from '../../feed/model/types'
import './TestPhraseCard.css'

type TestPhraseCardProps = {
  item: FeedItem
  index: number
  isActive: boolean
  isDone: boolean
}

export function TestPhraseCard({
  item,
  index,
  isActive,
  isDone,
}: TestPhraseCardProps) {
  return (
    <article
      className={[
        'test-phrase-card',
        isActive ? 'test-phrase-card--active' : '',
        isDone ? 'test-phrase-card--done' : '',
      ].join(' ')}
    >
      <span className="test-phrase-card__number">{index + 1}</span>
      <div>
        <p className="test-phrase-card__character">{item.character}</p>
        <p className="test-phrase-card__phrase">{item.phrase}</p>
      </div>
    </article>
  )
}

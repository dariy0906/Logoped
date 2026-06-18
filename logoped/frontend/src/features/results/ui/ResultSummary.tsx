import {
  createResultNarrationText,
  useVoiceNarration,
} from '../../voiceNarrator'
import './ResultSummary.css'

type ResultSummaryProps = {
  score: number
  level: number
  clarity: number
  speechQuality: number
  effort: number
  praise: string[]
  suggestion: string
  onRestart: () => void
}

export function ResultSummary({
  score,
  level,
  clarity,
  speechQuality,
  effort,
  praise,
  suggestion,
  onRestart,
}: ResultSummaryProps) {
  const resultVoice = useVoiceNarration({
    id: `result-summary-${score}-${level}`,
    text: createResultNarrationText({ score, praise, suggestion }),
    character: 'AI тренер',
    voiceType: 'friendly-child-coach',
    voiceEmotion: score >= 80 ? 'celebratory' : 'supportive',
    autoplay: true,
  })

  return (
    <section className="result-summary" aria-label="Результаты тренировки">
      <div className="result-summary__score">
        <span>{score}</span>
        <small>/100</small>
      </div>

      <div className="result-summary__level">
        <p>Уровень {level}</p>
        <div>
          <span style={{ width: `${score}%` }} />
        </div>
      </div>

      <div className="result-summary__metrics">
        <p>
          <span>Понятность</span>
          <strong>{clarity}</strong>
        </p>
        <p>
          <span>Качество речи</span>
          <strong>{speechQuality}</strong>
        </p>
        <p>
          <span>Старание</span>
          <strong>{effort}</strong>
        </p>
      </div>

      <div className="result-summary__messages">
        {praise.map((message) => (
          <p key={message}>{message}</p>
        ))}
        <p>{suggestion}</p>
      </div>

      <div className="result-summary__actions">
        <button
          className="result-summary__voice"
          type="button"
          onClick={resultVoice.replay}
          disabled={resultVoice.status === 'loading'}
        >
          <span aria-hidden="true">{resultVoice.isPlaying ? 'II' : '▶'}</span>
          Озвучить
        </button>
        <button className="result-summary__button" type="button" onClick={onRestart}>
          Ещё раз
        </button>
      </div>
    </section>
  )
}

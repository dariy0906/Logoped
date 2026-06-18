import { useMemo, useState } from 'react'
import type { SpeechAnalysisResult } from '../features/auth/model/types'
import type { FeedItem } from '../features/feed/model/types'
import { analyzeChildSpeech } from '../features/speech/api/analyzeChildSpeech'
import { createTestItems } from '../features/test/model/createTestItems'
import { TestPhraseCard } from '../features/test/ui/TestPhraseCard'
import './TestPage.css'

type TestPageProps = {
  viewedItems: FeedItem[]
  onComplete: (result: {
    score: number
    speechText: string
    analysis: SpeechAnalysisResult
  }) => void
}

export function TestPage({ viewedItems, onComplete }: TestPageProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [scores, setScores] = useState<number[]>([])
  const [speechText, setSpeechText] = useState('')
  const [error, setError] = useState('')
  const [isListening, setIsListening] = useState(false)

  const testItems = useMemo(() => createTestItems(viewedItems, 4), [viewedItems])
  const activeItem = testItems[activeIndex]

  async function handleRepeat() {
    if (isListening) return

    const textToAnalyze = speechText.trim() || activeItem?.phrase || ''

    if (!textToAnalyze) {
      setError('Введите фразу для анализа')
      return
    }

    setError('')
    setIsListening(true)
    const analysis = await analyzeChildSpeech(textToAnalyze)
    const score = analysis.score
    const nextScores = [...scores, score]
    setScores(nextScores)
    setSpeechText('')
    setIsListening(false)

    if (activeIndex >= testItems.length - 1) {
      const averageScore = Math.round(
        nextScores.reduce((sum, itemScore) => sum + itemScore, 0) / nextScores.length,
      )
      onComplete({
        score: averageScore,
        speechText: textToAnalyze,
        analysis: {
          ...analysis,
          score: averageScore,
        },
      })
      return
    }

    setActiveIndex((index) => index + 1)
  }

  return (
    <main className="test-page">
      <section className="test-page__panel">
        <header className="test-page__header">
          <p>Мини-тест</p>
          <h1>Повтори фразы из ленты</h1>
        </header>

        <div className="test-page__list">
          {testItems.map((item, index) => (
            <TestPhraseCard
              key={item.id}
              item={item}
              index={index}
              isActive={index === activeIndex}
              isDone={index < scores.length}
            />
          ))}
        </div>

        <div className="test-page__action">
          <p>{activeItem?.phrase}</p>
          <textarea
            value={speechText}
            onChange={(event) => setSpeechText(event.target.value)}
            placeholder="Если есть распознанный текст ребенка, вставьте его сюда"
            rows={3}
          />
          {error ? <span>{error}</span> : null}
          <button type="button" onClick={handleRepeat} disabled={isListening}>
            {isListening ? 'Анализируем...' : 'Я повторил'}
          </button>
        </div>
      </section>
    </main>
  )
}

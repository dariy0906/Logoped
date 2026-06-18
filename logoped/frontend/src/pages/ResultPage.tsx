import type { SpeechAnalysisResult } from '../features/auth/model/types'
import { ResultSummary } from '../features/results/ui/ResultSummary'
import './ResultPage.css'

type ResultPageProps = {
  score: number
  level: number
  analysis: SpeechAnalysisResult
  onRestart: () => void
}

export function ResultPage({ score, level, analysis, onRestart }: ResultPageProps) {
  return (
    <main className="result-page">
      <div className="result-page__shell">
        <p className="result-page__eyebrow">Готово</p>
        <h1>Твоя оценка</h1>
        <ResultSummary
          score={score}
          level={level}
          clarity={analysis.clarity}
          speechQuality={analysis.speechQuality}
          effort={analysis.effort}
          praise={analysis.praises}
          suggestion={analysis.suggestion}
          onRestart={onRestart}
        />
      </div>
    </main>
  )
}

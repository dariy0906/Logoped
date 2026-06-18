import { useState } from 'react'
import { useAuthSession } from '../features/auth/model/AuthContext'
import type { FeedItem } from '../features/feed/model/types'
import type { FeedTab } from '../features/tabs/model/types'
import { AppLoadingPage } from '../pages/AppLoadingPage'
import { FeedPage } from '../pages/FeedPage'
import { ParentDashboard } from '../pages/ParentDashboard'
import { ResultPage } from '../pages/ResultPage'
import { RoleSelectionPage } from '../pages/RoleSelectionPage'
import { SettingsPage } from '../pages/SettingsPage'
import { TestPage } from '../pages/TestPage'
import type { SpeechAnalysisResult } from '../features/auth/model/types'

type AppPage = 'feed' | 'settings' | 'test' | 'result'

type TestResult = {
  score: number
  speechText: string
  analysis: SpeechAnalysisResult
}

export function AppFlow() {
  const { isLoading, profile, progress, selectRole, saveTrainingResult } = useAuthSession()
  const [page, setPage] = useState<AppPage>('feed')
  const [activeTab, setActiveTab] = useState<FeedTab>('photo')
  const [viewedItems, setViewedItems] = useState<FeedItem[]>([])
  const [result, setResult] = useState<TestResult | null>(null)

  if (isLoading) {
    return <AppLoadingPage />
  }

  if (profile && !profile.role) {
    return <RoleSelectionPage onSelectRole={selectRole} />
  }

  if (profile?.role === 'parent') {
    return <ParentDashboard />
  }

  function handleFeedComplete(items: FeedItem[]) {
    setViewedItems(items)
    setPage('test')
  }

  async function handleTestComplete(nextResult: TestResult) {
    setResult(nextResult)
    await saveTrainingResult(nextResult.speechText, nextResult.analysis)
    setPage('result')
  }

  function handleRestart() {
    setViewedItems([])
    setResult(null)
    setActiveTab('photo')
    setPage('feed')
  }

  if (page === 'settings') {
    return <SettingsPage onBack={() => setPage('feed')} />
  }

  if (page === 'test') {
    return <TestPage viewedItems={viewedItems} onComplete={handleTestComplete} />
  }

  if (page === 'result' && result) {
    return (
      <ResultPage
        score={result.score}
        level={progress?.level ?? result.analysis.level}
        analysis={result.analysis}
        onRestart={handleRestart}
      />
    )
  }

  return (
    <FeedPage
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onSettingsClick={() => setPage('settings')}
      onFeedComplete={handleFeedComplete}
    />
  )
}

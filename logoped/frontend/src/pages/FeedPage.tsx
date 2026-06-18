import { EmptyVideoFeed } from '../features/feed/ui/EmptyVideoFeed'
import { VerticalSwipeFeed } from '../features/feed/ui/VerticalSwipeFeed'
import type { FeedItem } from '../features/feed/model/types'
import type { FeedTab } from '../features/tabs/model/types'
import { AppTopBar } from '../widgets/AppTopBar'

type FeedPageProps = {
  activeTab: FeedTab
  onTabChange: (tab: FeedTab) => void
  onSettingsClick: () => void
  onFeedComplete: (viewedItems: FeedItem[]) => void
}

export function FeedPage({
  activeTab,
  onTabChange,
  onSettingsClick,
  onFeedComplete,
}: FeedPageProps) {
  return (
    <main className="relative h-svh overflow-hidden bg-zinc-950">
      <AppTopBar
        activeTab={activeTab}
        onTabChange={onTabChange}
        onSettingsClick={onSettingsClick}
      />

      {activeTab === 'photo' ? (
        <VerticalSwipeFeed onComplete={onFeedComplete} />
      ) : (
        <EmptyVideoFeed />
      )}
    </main>
  )
}

import type { FeedTab } from '../features/tabs/model/types'
import { TopTabs } from '../features/tabs/ui/TopTabs'
import { IconButton } from '../shared/ui/IconButton'
import { SettingsIcon } from '../shared/ui/SettingsIcon'

type AppTopBarProps = {
  activeTab: FeedTab
  onTabChange: (tab: FeedTab) => void
  onSettingsClick: () => void
}

export function AppTopBar({
  activeTab,
  onTabChange,
  onSettingsClick,
}: AppTopBarProps) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-center px-4 pt-4">
      <div className="pointer-events-auto absolute left-4 top-4">
        <IconButton label="Открыть настройки" onClick={onSettingsClick}>
          <SettingsIcon />
        </IconButton>
      </div>

      <div className="pointer-events-auto">
        <TopTabs activeTab={activeTab} onChange={onTabChange} />
      </div>
    </header>
  )
}

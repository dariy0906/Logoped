import { motion } from 'framer-motion'
import type { FeedTab } from '../model/types'

const tabs: { id: FeedTab; label: string }[] = [
  { id: 'video', label: 'Видео' },
  { id: 'photo', label: 'Фото' },
]

type TopTabsProps = {
  activeTab: FeedTab
  onChange: (tab: FeedTab) => void
}

export function TopTabs({ activeTab, onChange }: TopTabsProps) {
  return (
    <div className="flex items-center rounded-full bg-white/10 p-1 backdrop-blur-xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className="relative h-9 min-w-20 rounded-full px-4 text-sm font-black text-white"
          onClick={() => onChange(tab.id)}
        >
          {activeTab === tab.id && (
            <motion.span
              layoutId="active-feed-tab"
              className="absolute inset-0 rounded-full bg-white"
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            />
          )}
          <span
            className={`relative z-10 ${
              activeTab === tab.id ? 'text-zinc-950' : 'text-white/70'
            }`}
          >
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  )
}

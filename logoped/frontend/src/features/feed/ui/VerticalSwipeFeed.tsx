import { useEffect, useRef, useState } from 'react'
import { fetchFeedCards } from '../api/fetchFeedCards'
import type { FeedItem } from '../model/types'
import { useVerticalFeed } from '../model/useVerticalFeed'
import { PhotoFeedCard } from './PhotoFeedCard'

const TEST_AFTER_ITEMS = 10

type VerticalSwipeFeedProps = {
  onComplete: (viewedItems: FeedItem[]) => void
}

export function VerticalSwipeFeed({ onComplete }: VerticalSwipeFeedProps) {
  const [items, setItems] = useState<FeedItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const { containerRef, currentIndex, setItemRef } = useVerticalFeed(items.length)
  const hasCompletedRef = useRef(false)

  useEffect(() => {
    const controller = new AbortController()

    setIsLoading(true)
    setError('')
    hasCompletedRef.current = false

    fetchFeedCards(controller.signal)
      .then((cards) => {
        setItems(cards)
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') {
          return
        }

        setError('Не получилось загрузить карточки')
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => {
      controller.abort()
    }
  }, [])

  useEffect(() => {
    if (!items.length || hasCompletedRef.current) return

    const completionIndex = Math.min(TEST_AFTER_ITEMS, items.length - 1)
    if (currentIndex < completionIndex) return

    hasCompletedRef.current = true
    onComplete(items.slice(0, TEST_AFTER_ITEMS))
  }, [currentIndex, items, onComplete])

  if (isLoading) {
    return (
      <div className="grid h-svh place-items-center bg-zinc-950 px-6 text-center text-lg font-black text-white">
        Загружаем карточки...
      </div>
    )
  }

  if (error || !items.length) {
    return (
      <div className="grid h-svh place-items-center bg-zinc-950 px-6 text-center text-lg font-black text-white">
        {error || 'Карточек пока нет'}
      </div>
    )
  }

  return (
    <div className="relative h-svh bg-zinc-950">
      <section
        ref={containerRef}
        className="h-svh overflow-y-auto overscroll-contain scroll-smooth snap-y snap-mandatory bg-zinc-950"
        aria-label="Фото лента"
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            ref={setItemRef(index)}
            data-index={index}
            className="h-svh snap-start snap-always"
          >
            <PhotoFeedCard item={item} isActive={index === currentIndex} />
          </div>
        ))}
      </section>

      <div className="pointer-events-none absolute right-3 top-1/2 z-20 grid -translate-y-1/2 gap-2">
        {items.map((item, index) => (
          <span
            key={item.id}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex ? 'w-7 bg-white' : 'w-1.5 bg-white/35'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

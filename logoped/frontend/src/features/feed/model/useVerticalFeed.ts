import { useEffect, useRef, useState } from 'react'

export function useVerticalFeed(itemCount: number) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (!visibleEntry) return

        const nextIndex = Number(visibleEntry.target.getAttribute('data-index'))
        if (!Number.isNaN(nextIndex)) {
          setCurrentIndex(nextIndex)
        }
      },
      {
        root: container,
        threshold: [0.62],
      },
    )

    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item)
    })

    return () => observer.disconnect()
  }, [itemCount])

  function setItemRef(index: number) {
    return (node: HTMLDivElement | null) => {
      itemRefs.current[index] = node
    }
  }

  function scrollToIndex(index: number) {
    itemRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return {
    containerRef,
    currentIndex,
    setItemRef,
    scrollToIndex,
  }
}

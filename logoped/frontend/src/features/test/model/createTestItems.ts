import type { FeedItem } from '../../feed/model/types'

export function createTestItems(items: FeedItem[], limit = 4) {
  return items.slice(0, limit)
}

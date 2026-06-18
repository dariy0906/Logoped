type FeedNarrationSource = {
  character: string
  phrase: string
}

type ResultNarrationSource = {
  score: number
  praise: string[]
  suggestion: string
}

export function createFeedNarrationText({ character, phrase }: FeedNarrationSource) {
  return `${character} говорит: ${phrase}`
}

export function createResultNarrationText({
  score,
  praise,
  suggestion,
}: ResultNarrationSource) {
  return [
    `Твой результат ${score} из 100.`,
    ...praise,
    suggestion,
  ].join(' ')
}

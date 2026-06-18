export function getFakeSpeechScore(): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.floor(Math.random() * 4) + 7)
    }, 2000)
  })
}

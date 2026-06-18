import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const { Pool } = pg

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required for seeding')
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
})

const cards = [
  {
    character: 'Машинка Биби',
    trend: 'brainrot talking cars',
    phrase: 'Повтори цифры от 60 до 67.',
    voiceType: 'robot-car',
    voiceEmotion: 'energetic',
    image: '/images/hero.png',
    color: '#22d3ee',
    difficulty: 2,
  },
  {
    character: 'Кот Мемыч',
    trend: 'funny meme animals',
    phrase: 'Скажи: рыжий кот роняет робот.',
    voiceType: 'meme-cat',
    voiceEmotion: 'playful',
    image: '/images/hero.png',
    color: '#fb7185',
    difficulty: 3,
  },
  {
    character: 'Герой 67',
    trend: 'trend "67"',
    phrase: 'Скажи громко: шестьдесят семь!',
    voiceType: 'meme-hero',
    voiceEmotion: 'energetic',
    image: '/images/hero.png',
    color: '#bef264',
    difficulty: 2,
  },
  {
    character: 'Чашка Чача',
    trend: 'talking objects',
    phrase: 'Чайная чашка чётко чокается.',
    voiceType: 'talking-object',
    voiceEmotion: 'playful',
    image: '/images/hero.png',
    color: '#a78bfa',
    difficulty: 4,
  },
  {
    character: 'AI Робо-Лёва',
    trend: 'AI meme characters',
    phrase: 'Лёва ловко ловит лунный луч.',
    voiceType: 'robot-character',
    voiceEmotion: 'robotic',
    image: '/images/hero.png',
    color: '#facc15',
    difficulty: 3,
  },
  {
    character: 'Пёс Бум',
    trend: 'funny meme animals',
    phrase: 'Повтори фразу героя: бум-бум, барабан!',
    voiceType: 'meme-dog',
    voiceEmotion: 'energetic',
    image: '/images/hero.png',
    color: '#38bdf8',
    difficulty: 2,
  },
  {
    character: 'Телефон Тони',
    trend: 'talking objects',
    phrase: 'Тони тихо тянет тонкий трек.',
    voiceType: 'digital-assistant',
    voiceEmotion: 'rhythmic',
    image: '/images/hero.png',
    color: '#34d399',
    difficulty: 4,
  },
  {
    character: 'Машинка Р-р-р',
    trend: 'brainrot talking cars',
    phrase: 'Скажи скороговорку как машинка: р-р-р, дорога ровная.',
    voiceType: 'engine-car',
    voiceEmotion: 'energetic',
    image: '/images/hero.png',
    color: '#fb923c',
    difficulty: 3,
  },
  {
    character: 'Банан Босс',
    trend: 'AI meme characters',
    phrase: 'Банан бодро болтает: ба-бо-бу.',
    voiceType: 'meme-boss',
    voiceEmotion: 'playful',
    image: '/images/hero.png',
    color: '#fde047',
    difficulty: 2,
  },
  {
    character: 'Супер Шарик',
    trend: 'funny meme animals',
    phrase: 'Шарик шустро шепчет: ш-ш-ш.',
    voiceType: 'soft-character',
    voiceEmotion: 'whisper',
    image: '/images/hero.png',
    color: '#f472b6',
    difficulty: 3,
  },
  {
    character: 'Лампа Лулу',
    trend: 'talking objects',
    phrase: 'Лулу любит лёгкие леденцы.',
    voiceType: 'kind-object',
    voiceEmotion: 'warm',
    image: '/images/hero.png',
    color: '#60a5fa',
    difficulty: 2,
  },
  {
    character: 'Кибер Утка',
    trend: 'AI meme characters',
    phrase: 'Повтори фразу героя быстро и чётко.',
    voiceType: 'cyber-meme',
    voiceEmotion: 'energetic',
    image: '/images/hero.png',
    color: '#c084fc',
    difficulty: 5,
  },
]

async function main() {
  await prisma.exerciseCard.deleteMany()
  await prisma.exerciseCard.createMany({
    data: cards,
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  })

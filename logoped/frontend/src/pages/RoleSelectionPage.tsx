import { motion } from 'framer-motion'
import type { UserRole } from '../features/auth/model/types'

type RoleSelectionPageProps = {
  onSelectRole: (role: UserRole) => Promise<void>
}

const roles: Array<{
  role: UserRole
  icon: string
  title: string
  description: string
}> = [
  {
    role: 'child',
    icon: '👦',
    title: 'Ребенок',
    description: 'Мемы, карточки, уровни и веселая практика речи.',
  },
  {
    role: 'parent',
    icon: '👨',
    title: 'Родитель',
    description: 'Контроль прогресса и будущая привязка ребенка.',
  },
]

export function RoleSelectionPage({ onSelectRole }: RoleSelectionPageProps) {
  return (
    <main className="grid min-h-svh place-items-center bg-zinc-950 px-5 py-8 text-white">
      <motion.section
        className="grid w-full max-w-md gap-7"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: 'easeOut' }}
      >
        <div className="grid gap-3 text-center">
          <p className="text-sm font-black uppercase text-cyan-200">Первый шаг</p>
          <h1 className="text-4xl font-black leading-none">Кто вы?</h1>
          <p className="text-base font-semibold text-white/50">
            Выберите роль, чтобы настроить приложение под ваш сценарий.
          </p>
        </div>

        <div className="grid gap-4">
          {roles.map((item, index) => (
            <motion.button
              key={item.role}
              className="grid min-h-36 gap-3 rounded-[2rem] border border-white/10 bg-white/8 p-6 text-left shadow-xl shadow-black/20 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-200/35 hover:bg-white/12 active:translate-y-0"
              type="button"
              onClick={() => {
                void onSelectRole(item.role).catch((error) => {
                  console.error('Failed to select role:', error)
                })
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.22, ease: 'easeOut' }}
            >
              <span className="text-5xl" aria-hidden="true">
                {item.icon}
              </span>
              <span className="text-2xl font-black">{item.title}</span>
              <span className="text-sm font-semibold text-white/55">{item.description}</span>
            </motion.button>
          ))}
        </div>
      </motion.section>
    </main>
  )
}

import { motion } from 'framer-motion'
import { useAuthSession } from '../features/auth/model/AuthContext'

export function ParentDashboard() {
  const { profile, logout } = useAuthSession()

  return (
    <main className="min-h-svh bg-zinc-950 px-5 py-6 text-white">
      <div className="mx-auto grid w-full max-w-3xl gap-6">
        <header className="flex items-center justify-between gap-4">
          <div className="grid gap-1">
            <p className="text-sm font-black uppercase text-cyan-200">Parent Dashboard</p>
            <h1 className="text-3xl font-black leading-none">Здравствуйте, {profile?.username}</h1>
          </div>

          <button
            className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/15"
            type="button"
            onClick={logout}
          >
            Выйти
          </button>
        </header>

        <motion.section
          className="grid gap-5 rounded-[2rem] border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
        >
          <div className="grid gap-3">
            <span className="text-5xl" aria-hidden="true">
              👨
            </span>
            <h2 className="text-3xl font-black leading-tight">
              Функции родительского контроля скоро появятся
            </h2>
            <p className="max-w-xl text-base font-semibold text-white/55">
              Архитектура уже подготовлена для связки parent_id и child_id. Позже здесь появятся
              прогресс ребенка, история тренировок и рекомендации.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {['Прогресс ребенка', 'История AI оценок', 'Связка аккаунтов'].map((item) => (
              <div
                key={item}
                className="min-h-28 rounded-3xl border border-white/8 bg-zinc-950/45 p-4"
              >
                <p className="text-sm font-black text-white">{item}</p>
                <p className="mt-2 text-xs font-bold text-white/40">Скоро</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </main>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AuthModal } from '../components/AuthModal'
import { useAuthSession } from '../features/auth/model/AuthContext'
import { SettingsMenu } from '../features/settings/ui/SettingsMenu'
import { ArrowLeftIcon } from '../shared/ui/ArrowLeftIcon'
import { IconButton } from '../shared/ui/IconButton'

type SettingsPageProps = {
  onBack: () => void
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const { isAuthenticated, profile, progress, logout } = useAuthSession()
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  return (
    <>
      <main className="min-h-svh bg-zinc-950 px-5 pb-8 pt-4 text-white">
        <div className="mx-auto grid w-full max-w-md gap-8">
          <header className="flex items-center justify-between">
            <IconButton label="Назад" onClick={onBack}>
              <ArrowLeftIcon />
            </IconButton>
            <p className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white/75 backdrop-blur-xl">
              Settings
            </p>
          </header>

          <motion.section
            className="grid gap-6 pt-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className="grid gap-2">
              <h1 className="text-4xl font-black leading-none">Настройки</h1>
              <p className="text-base font-semibold text-white/48">
                {isAuthenticated
                  ? `${profile?.username ?? 'Пользователь'} · уровень ${progress?.level ?? 1}`
                  : 'Войдите, чтобы сохранить прогресс'}
              </p>
            </div>

            <SettingsMenu
              isAuthenticated={isAuthenticated}
              onLoginClick={() => setIsAuthOpen(true)}
              onLogoutClick={logout}
            />
          </motion.section>
        </div>
      </main>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  )
}

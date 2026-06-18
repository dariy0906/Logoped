import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LoginForm } from '../LoginForm/LoginForm'
import { RegisterForm } from '../RegisterForm/RegisterForm'

type AuthMode = 'login' | 'register'

type AuthModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login')

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      setMode('login')
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-zinc-950/78 px-4 py-6 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.section
            className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/12 bg-zinc-950/92 p-5 shadow-2xl shadow-black/45 sm:p-7"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="pointer-events-none absolute inset-x-8 top-0 h-28 rounded-full bg-cyan-300/12 blur-3xl" />
            <div className="relative grid gap-6">
              <div className="flex items-center justify-between">
                <div className="flex rounded-2xl bg-white/8 p-1">
                  <button
                    className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                      mode === 'login' ? 'bg-white text-zinc-950' : 'text-white/55 hover:text-white'
                    }`}
                    type="button"
                    onClick={() => setMode('login')}
                  >
                    Вход
                  </button>
                  <button
                    className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                      mode === 'register'
                        ? 'bg-white text-zinc-950'
                        : 'text-white/55 hover:text-white'
                    }`}
                    type="button"
                    onClick={() => setMode('register')}
                  >
                    Регистрация
                  </button>
                </div>

                <button
                  className="grid h-10 w-10 place-items-center rounded-2xl bg-white/8 text-xl font-black text-white/65 transition hover:bg-white/14 hover:text-white"
                  type="button"
                  onClick={onClose}
                  aria-label="Закрыть"
                >
                  ×
                </button>
              </div>

              <AnimatePresence mode="wait">
                {mode === 'login' ? (
                  <LoginForm
                    onRegisterClick={() => setMode('register')}
                    onSuccess={onClose}
                  />
                ) : (
                  <RegisterForm
                    onLoginClick={() => setMode('login')}
                    onSuccess={onClose}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

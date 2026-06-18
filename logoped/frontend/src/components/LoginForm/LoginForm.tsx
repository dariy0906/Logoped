import { useState } from 'react'
import { motion } from 'framer-motion'
import { signIn } from '../../hooks/useAuth'

type LoginFormProps = {
  onRegisterClick: () => void
  onSuccess?: () => void
}

type LoginErrors = {
  email?: string
  password?: string
  form?: string
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function LoginForm({ onRegisterClick, onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<LoginErrors>({})

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: LoginErrors = {}

    if (!validateEmail(email)) {
      nextErrors.email = 'Введите корректный email'
    }

    if (password.length < 6) {
      nextErrors.password = 'Минимум 6 символов'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setLoading(true)

    try {
      const result = await signIn(email, password)

      if (!result.ok) {
        setErrors({ form: result.error ?? 'Не удалось войти' })
        return
      }

      onSuccess?.()
    } catch {
      setErrors({ form: 'Что-то пошло не так. Попробуйте ещё раз.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      key="login"
      className="grid gap-5"
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 18 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2">
        <h2 className="text-3xl font-black tracking-normal text-white sm:text-4xl">
          С возвращением
        </h2>
        <p className="text-sm font-semibold text-white/45">
          Войдите, чтобы продолжить работу с приложением.
        </p>
      </div>

      {errors.form ? (
        <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
          {errors.form}
        </p>
      ) : null}

      <label className="grid gap-2 text-sm font-bold text-white/70">
        Email
        <input
          className="h-13 rounded-2xl border border-white/10 bg-white/8 px-4 text-base font-semibold text-white outline-none transition placeholder:text-white/28 focus:border-cyan-300/55 focus:bg-white/12 focus:ring-4 focus:ring-cyan-300/10"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
        {errors.email ? <span className="text-xs text-red-200">{errors.email}</span> : null}
      </label>

      <label className="grid gap-2 text-sm font-bold text-white/70">
        Password
        <div className="relative">
          <input
            className="h-13 w-full rounded-2xl border border-white/10 bg-white/8 px-4 pr-16 text-base font-semibold text-white outline-none transition placeholder:text-white/28 focus:border-cyan-300/55 focus:bg-white/12 focus:ring-4 focus:ring-cyan-300/10"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <button
            className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-xl px-3 text-xs font-black text-white/55 transition hover:bg-white/10 hover:text-white"
            type="button"
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.password ? <span className="text-xs text-red-200">{errors.password}</span> : null}
      </label>

      <label className="flex items-center gap-3 text-sm font-bold text-white/58">
        <input
          className="h-4 w-4 accent-cyan-300"
          type="checkbox"
          checked={rememberMe}
          onChange={(event) => setRememberMe(event.target.checked)}
        />
        Remember me
      </label>

      <button
        className="h-13 rounded-2xl bg-white text-base font-black text-zinc-950 shadow-xl shadow-cyan-950/20 transition hover:-translate-y-0.5 hover:bg-cyan-100 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Входим...' : 'Войти'}
      </button>

      <p className="text-center text-sm font-semibold text-white/45">
        Нет аккаунта?{' '}
        <button
          className="font-black text-cyan-200 transition hover:text-white"
          type="button"
          onClick={onRegisterClick}
        >
          Регистрация
        </button>
      </p>
    </motion.form>
  )
}

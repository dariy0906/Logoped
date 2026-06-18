import type { ReactNode } from 'react'

type IconButtonProps = {
  label: string
  children: ReactNode
  onClick?: () => void
}

export function IconButton({ label, children, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white shadow-lg shadow-black/20 backdrop-blur-xl transition hover:bg-white/15 active:scale-95"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

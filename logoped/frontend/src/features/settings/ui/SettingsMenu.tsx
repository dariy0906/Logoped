const settingsItems = ['Вход', 'Центр активности', 'Скаченные']

type SettingsMenuProps = {
  onLoginClick: () => void
  onLogoutClick: () => void
  isAuthenticated: boolean
}

export function SettingsMenu({
  onLoginClick,
  onLogoutClick,
  isAuthenticated,
}: SettingsMenuProps) {
  const items = isAuthenticated ? ['Выйти', ...settingsItems.slice(1)] : settingsItems

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={
            item === 'Вход' ? onLoginClick : item === 'Выйти' ? onLogoutClick : undefined
          }
          className="flex min-h-16 items-center justify-between rounded-3xl bg-white/8 px-5 text-left text-base font-black text-white shadow-lg shadow-black/10 backdrop-blur-xl transition hover:bg-white/12 active:scale-[0.99]"
        >
          {item}
          <span className="text-xl text-white/35">›</span>
        </button>
      ))}
    </div>
  )
}

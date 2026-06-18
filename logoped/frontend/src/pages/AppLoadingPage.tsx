export function AppLoadingPage() {
  return (
    <main className="grid min-h-svh place-items-center bg-zinc-950 px-5 text-white">
      <div className="grid justify-items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-cyan-200" />
        <p className="text-sm font-black uppercase text-white/55">Загрузка профиля</p>
      </div>
    </main>
  )
}

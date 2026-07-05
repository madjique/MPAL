import { ThemeProvider } from './context/ThemeContext'
import { Dashboard } from './components/Dashboard'
import { AppViewer } from './components/AppViewer'
import { useAppStore } from './store/useAppStore'

function LoadingScreen() {
  return (
    <div className="bg-mesh flex min-h-screen items-center justify-center text-sm text-slate-500 dark:text-slate-400">
      Loading MPAL…
    </div>
  )
}

function AppRoot() {
  const hasHydrated = useAppStore((state) => state.hasHydrated)
  const activeAppId = useAppStore((state) => state.activeAppId)

  if (!hasHydrated) return <LoadingScreen />

  return (
    <>
      <Dashboard />
      {activeAppId && <AppViewer />}
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppRoot />
    </ThemeProvider>
  )
}

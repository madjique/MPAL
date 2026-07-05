import { useEffect, useRef } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { Dashboard } from './components/Dashboard'
import { AppViewer } from './components/AppViewer'
import { useAppStore } from './store/useAppStore'
import { APP_ICON_REFRESH_INTERVAL, resolveAppIconUrl } from './utils/favicon'

function LoadingScreen() {
  return (
    <div className="bg-mesh flex min-h-screen items-center justify-center text-sm text-slate-500 dark:text-slate-400">
      Loading MPAL…
    </div>
  )
}

function AppRoot() {
  const hasHydrated = useAppStore((state) => state.hasHydrated)
  const apps = useAppStore((state) => state.apps)
  const activeAppId = useAppStore((state) => state.activeAppId)
  const updateAppIcon = useAppStore((state) => state.updateAppIcon)
  const appsRef = useRef(apps)

  useEffect(() => {
    appsRef.current = apps
  }, [apps])

  useEffect(() => {
    if (!hasHydrated) return

    let active = true
    let refreshing = false

    const refreshIcons = async () => {
      if (refreshing) return
      refreshing = true

      const now = Date.now()

      try {
        await Promise.all(
          appsRef.current.map(async (app) => {
            const nextIcon = await resolveAppIconUrl(app.url)
            if (!active || !nextIcon) return

            const lastUpdatedAt = app.iconUpdatedAt ?? app.addedAt
            if (app.icon !== nextIcon || now - lastUpdatedAt >= APP_ICON_REFRESH_INTERVAL) {
              updateAppIcon(app.id, nextIcon)
            }
          }),
        )
      } finally {
        refreshing = false
      }
    }

    const handleRefresh = () => {
      void refreshIcons()
    }

    handleRefresh()

    window.addEventListener('focus', handleRefresh)
    const intervalId = window.setInterval(handleRefresh, APP_ICON_REFRESH_INTERVAL)

    return () => {
      active = false
      window.removeEventListener('focus', handleRefresh)
      window.clearInterval(intervalId)
    }
  }, [hasHydrated, updateAppIcon])

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

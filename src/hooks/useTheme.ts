import { useEffect, useMemo, useState } from 'react'
import { useAppStore, type ThemeMode } from '../store/useAppStore'

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const theme = useAppStore((state) => state.theme)
  const setTheme = useAppStore((state) => state.setTheme)
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(getSystemTheme)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const resolvedTheme = useMemo(
    () => (theme === 'system' ? systemTheme : theme),
    [systemTheme, theme],
  )

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', resolvedTheme === 'dark')
    root.style.colorScheme = resolvedTheme
  }, [resolvedTheme])

  const cycleTheme = () => {
    const cycle: ThemeMode[] = ['light', 'dark', 'system']
    const next = cycle[(cycle.indexOf(theme) + 1) % cycle.length]
    setTheme(next)
  }

  return { theme, resolvedTheme, setTheme, cycleTheme }
}

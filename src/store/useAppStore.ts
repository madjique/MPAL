import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface PwaApp {
  id: string
  name: string
  url: string
  /** Favicon URL – derived at add time */
  icon: string
  addedAt: number
}

interface AppState {
  apps: PwaApp[]
  activeAppId: string | null
  theme: ThemeMode
  hasHydrated: boolean

  addApp: (app: Omit<PwaApp, 'id' | 'addedAt'>) => void
  removeApp: (id: string) => void
  setActiveApp: (id: string | null) => void
  setTheme: (theme: ThemeMode) => void
  setHasHydrated: (value: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      apps: [],
      activeAppId: null,
      theme: 'system',
      hasHydrated: false,

      addApp: (app) =>
        set((state) => ({
          apps: [
            ...state.apps,
            {
              ...app,
              id: crypto.randomUUID(),
              addedAt: Date.now(),
            },
          ],
        })),

      removeApp: (id) =>
        set((state) => ({
          apps: state.apps.filter((a) => a.id !== id),
          activeAppId: state.activeAppId === id ? null : state.activeAppId,
        })),

      setActiveApp: (activeAppId) => set({ activeAppId }),
      setTheme: (theme) => set({ theme }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'mpal-store',
      partialize: (state) => ({
        apps: state.apps,
        theme: state.theme,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)

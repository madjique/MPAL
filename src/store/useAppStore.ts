import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface PwaApp {
  id: string
  name: string
  url: string
  /** Best-known PWA/app icon URL */
  icon: string
  iconUpdatedAt?: number
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
  updateAppIcon: (id: string, icon: string) => void
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
              iconUpdatedAt: Date.now(),
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
      updateAppIcon: (id, icon) =>
        set((state) => ({
          apps: state.apps.map((app) =>
            app.id === id
              ? {
                  ...app,
                  icon,
                  iconUpdatedAt: Date.now(),
                }
              : app,
          ),
        })),
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

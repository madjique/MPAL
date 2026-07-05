import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Moon, Sun, Monitor, AppWindowMac } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useThemeContext } from '../context/ThemeContext'
import { AppIcon } from './AppIcon'
import { AddAppModal } from './AddAppModal'
import { cn } from '../utils/cn'

const themeIcons = { light: Sun, dark: Moon, system: Monitor }
const themeLabels = { light: 'Light', dark: 'Dark', system: 'System' }

export function Dashboard() {
  const apps = useAppStore((state) => state.apps)
  const removeApp = useAppStore((state) => state.removeApp)
  const setActiveApp = useAppStore((state) => state.setActiveApp)
  const { theme, cycleTheme } = useThemeContext()
  const [addOpen, setAddOpen] = useState(false)

  const ThemeIcon = themeIcons[theme]

  return (
    <div className="flex min-h-screen flex-col bg-mesh">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pb-4 pt-[calc(env(safe-area-inset-top,0px)+16px)]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-sm">
            <AppWindowMac className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary/70">
              My Personal
            </p>
            <h1 className="text-lg font-bold leading-none text-slate-900 dark:text-white">
              App Library
            </h1>
          </div>
        </div>
        <button
          onClick={cycleTheme}
          className="flex items-center gap-1.5 rounded-full border border-white/40 bg-white/50 px-3 py-1.5 text-xs font-medium text-slate-600 backdrop-blur-sm transition hover:bg-white/70 dark:border-white/10 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15"
        >
          <ThemeIcon className="h-3.5 w-3.5" />
          {themeLabels[theme]}
        </button>
      </header>

      {/* App Grid */}
      <main className="flex-1 overflow-y-auto px-4 pb-32">
        {apps.length === 0 ? (
          <EmptyState onAdd={() => setAddOpen(true)} />
        ) : (
          <motion.div
            className="grid grid-cols-4 gap-x-2 gap-y-6 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.04 } },
            }}
          >
            {apps.map((app) => (
              <motion.div
                key={app.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 },
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="flex justify-center"
              >
                <AppIcon
                  app={app}
                  onOpen={setActiveApp}
                  onDelete={removeApp}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* FAB – Add app */}
      <AnimatePresence>
        <motion.button
          key="fab"
          className={cn(
            'fixed bottom-[calc(env(safe-area-inset-bottom,0px)+24px)] right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/30',
          )}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => setAddOpen(true)}
          aria-label="Add app"
        >
          <Plus className="h-6 w-6 text-white" />
        </motion.button>
      </AnimatePresence>

      <AddAppModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-24 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20">
        <AppWindowMac className="h-10 w-10 text-primary" />
      </div>
      <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
        No apps yet
      </h2>
      <p className="mb-6 max-w-xs text-sm text-slate-500 dark:text-slate-400">
        Add your favourite PWAs to access them all from one place.
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
      >
        <Plus className="h-4 w-4" />
        Add your first app
      </button>
    </motion.div>
  )
}

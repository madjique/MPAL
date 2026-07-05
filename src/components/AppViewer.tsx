import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { usePinchClose } from '../hooks/usePinchClose'
import { cn } from '../utils/cn'
import { getDisplayIconUrl } from '../utils/favicon'

export function AppViewer() {
  const apps = useAppStore((state) => state.apps)
  const activeAppId = useAppStore((state) => state.activeAppId)
  const setActiveApp = useAppStore((state) => state.setActiveApp)

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const activeApp = apps.find((a) => a.id === activeAppId)
  const otherApps = apps.filter((a) => a.id !== activeAppId)

  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleClose = () => setActiveApp(null)

  // Pinch-down gesture on mobile to close the current app
  usePinchClose(handleClose, !!activeAppId)

  if (!activeApp) return null

  return (
    <AnimatePresence>
      <motion.div
        key={activeApp.id}
        className="fixed inset-0 z-40 flex bg-slate-950"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      >
        {/* iframe */}
        <iframe
          ref={iframeRef}
          src={activeApp.url}
          title={activeApp.name}
          className="flex-1 border-none"
          allow="camera; microphone; geolocation; payment; clipboard-read; clipboard-write"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-top-navigation-by-user-activation"
        />

        {/* ── Desktop right sidebar ── */}
        <aside
          className={cn(
            'hidden md:flex flex-col shrink-0 transition-all duration-300',
            sidebarCollapsed ? 'w-12' : 'w-16',
            'bg-white/10 backdrop-blur-2xl border-l border-white/10',
          )}
        >
          {/* Collapse toggle */}
          <button
            className="mt-[calc(env(safe-area-inset-top,0px)+8px)] flex h-8 w-full items-center justify-center text-white/50 hover:text-white/90 transition"
            onClick={() => setSidebarCollapsed((v) => !v)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {/* Other app icons */}
          <div className="flex flex-1 flex-col items-center gap-3 overflow-y-auto py-3 scrollbar-none">
            {otherApps.map((app) => (
              <button
                key={app.id}
                onClick={() => setActiveApp(app.id)}
                title={app.name}
                className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white/10 transition hover:bg-white/20 active:scale-95"
              >
                {app.icon ? (
                  <img
                    src={getDisplayIconUrl(app.icon, app.iconUpdatedAt ?? app.addedAt)}
                    alt={app.name}
                    className="h-7 w-7 object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none'
                    }}
                  />
                ) : (
                  <span className="text-sm font-bold text-white">
                    {app.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Close button */}
          <button
            className="mb-[calc(env(safe-area-inset-bottom,0px)+16px)] mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-red-500 hover:text-white"
            onClick={handleClose}
            aria-label="Close app"
          >
            <X className="h-5 w-5" />
          </button>
        </aside>

        {/* ── Mobile top-right close button ── */}
        <MobileCloseButton onClose={handleClose} />
      </motion.div>

    </AnimatePresence>
  )
}

/**
 * Mobile-only floating close button positioned at top-right
 * respecting device safe area insets.
 */
function MobileCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <motion.button
      className="fixed right-[calc(env(safe-area-inset-right,0px)+12px)] top-[calc(env(safe-area-inset-top,0px)+12px)] z-50 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md md:hidden"
      onClick={onClose}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 400, damping: 25 }}
      aria-label="Close app"
    >
      <X className="h-4 w-4" />
    </motion.button>
  )
}

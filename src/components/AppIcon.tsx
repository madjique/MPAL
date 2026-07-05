import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { useLongPress } from '../hooks/useLongPress'
import { type PwaApp } from '../store/useAppStore'
import { cn } from '../utils/cn'
import { getDisplayIconUrl } from '../utils/favicon'

interface AppIconProps {
  app: PwaApp
  onOpen: (id: string) => void
  onDelete: (id: string) => void
  /** When true only the icon is shown (sidebar mode) */
  compact?: boolean
}

export function AppIcon({ app, onOpen, onDelete, compact = false }: AppIconProps) {
  const [showDelete, setShowDelete] = useState(false)
  const iconSrc = getDisplayIconUrl(app.icon, app.iconUpdatedAt ?? app.addedAt)

  const longPress = useLongPress(() => setShowDelete(true))

  const handleClick = () => {
    if (longPress.didFire.current) {
      longPress.resetDidFire()
      return
    }
    if (showDelete) {
      setShowDelete(false)
      return
    }
    onOpen(app.id)
  }

  // Close delete badge when clicking elsewhere
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className={cn('relative flex flex-col items-center', compact ? 'w-10' : 'w-20')}
      onClick={handleClick}
      {...longPress}
    >
      <AnimatePresence>
        {showDelete && (
          <motion.button
            key="delete"
            className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={(e) => {
              e.stopPropagation()
              onDelete(app.id)
            }}
          >
            <Trash2 className="h-3 w-3" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        className={cn(
          'flex items-center justify-center overflow-hidden rounded-2xl border border-white/30 bg-white/60 shadow-sm dark:border-white/10 dark:bg-white/10',
          compact ? 'h-10 w-10' : 'h-16 w-16',
          showDelete && 'ring-2 ring-red-400',
        )}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        {app.icon ? (
          <img
            src={iconSrc}
            alt={app.name}
            className={cn('object-contain', compact ? 'h-6 w-6' : 'h-10 w-10')}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <span className={cn('font-bold text-primary', compact ? 'text-sm' : 'text-xl')}>
            {app.name.charAt(0).toUpperCase()}
          </span>
        )}
      </motion.div>

      {!compact && (
        <p className="mt-1.5 max-w-full truncate text-center text-xs font-medium text-slate-700 dark:text-slate-300">
          {app.name}
        </p>
      )}
    </div>
  )
}

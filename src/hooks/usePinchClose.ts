import { useEffect, useRef } from 'react'

/**
 * Detects a "pinch-down" (two-finger downward drag) gesture and calls onClose.
 * Works by monitoring multi-touch vertical distance from the initial touch centre.
 */
export function usePinchClose(onClose: () => void, enabled = true) {
  const initialCentreY = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) return

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        initialCentreY.current = (e.touches[0].clientY + e.touches[1].clientY) / 2
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialCentreY.current !== null) {
        const currentCentreY = (e.touches[0].clientY + e.touches[1].clientY) / 2
        const delta = currentCentreY - initialCentreY.current
        if (delta > 120) {
          initialCentreY.current = null
          onClose()
        }
      }
    }

    const handleTouchEnd = () => {
      initialCentreY.current = null
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onClose, enabled])
}

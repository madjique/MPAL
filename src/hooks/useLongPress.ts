import { useRef, useCallback } from 'react'

const LONG_PRESS_DELAY = 600

export function useLongPress(onLongPress: () => void) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const didFire = useRef(false)

  const start = useCallback(() => {
    didFire.current = false
    timerRef.current = setTimeout(() => {
      didFire.current = true
      onLongPress()
    }, LONG_PRESS_DELAY)
  }, [onLongPress])

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const resetDidFire = useCallback(() => {
    didFire.current = false
  }, [])

  return {
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: cancel,
    onTouchMove: cancel,
    /** true after long-press fired – use this to suppress onClick */
    didFire,
    resetDidFire,
  }
}

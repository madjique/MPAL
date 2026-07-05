import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// @ts-expect-error - Virtual module registered by vite-plugin-pwa
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import './index.css'

// Register PWA service worker
const updateSW = registerSW({
  onNeedRefresh() {
    window.location.reload()
  },
  onOfflineReady() {
    console.log('[PWA] App is ready for offline use')
  },
})

if (typeof window !== 'undefined') {
  window.addEventListener('focus', () => void updateSW())
  setInterval(() => void updateSW(), 10 * 60 * 1000)

  // Prevent iOS swipe-back gesture in standalone PWA mode
  const isStandalone =
    ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true) ||
    window.matchMedia('(display-mode: standalone)').matches

  if (isStandalone) {
    document.addEventListener(
      'touchstart',
      (e: TouchEvent) => {
        const touch = e.touches[0]
        if (touch && touch.clientX < 30) e.preventDefault()
      },
      { passive: false },
    )
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

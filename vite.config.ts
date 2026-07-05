import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

<<<<<<< HEAD
const APP_BASE = '/mpal/'
const THEME_COLOR = '#2563eb'

export default defineConfig({
  base: APP_BASE,
=======
// https://vite.dev/config/
export default defineConfig({
  base: '/MPAL/',
>>>>>>> origin/main
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
<<<<<<< HEAD
      injectRegister: null,
      registerType: 'autoUpdate',
      manifest: {
        name: 'MPAL – My Personal App Library',
        short_name: 'MPAL',
        description: 'A PWA launcher that gives access to all your favourite PWAs.',
        theme_color: THEME_COLOR,
        background_color: '#ffffff',
        display: 'standalone',
        scope: APP_BASE,
        start_url: APP_BASE,
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ]
=======
      registerType: 'autoUpdate',
      manifest: {
        name: 'MPAL',
        short_name: 'MPAL',
        description: 'My Personal PWA Library',
        theme_color: '#aa3bff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
>>>>>>> origin/main
})

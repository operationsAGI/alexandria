import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        join: resolve(__dirname, 'join/index.html'),
        eventScifi: resolve(__dirname, 'events/fantasy-to-reality/index.html'),
      },
    },
  },
})

import { defineConfig } from 'vite'
import { NgmiPolyfill } from 'vite-plugin-ngmi-polyfill'

export default defineConfig({
  plugins: [
    NgmiPolyfill({
      globals: {
        Buffer: true,
        process: true,
      },
      polyfills: {
        buffer: true,
        stream: true,
      },
    }),
  ],
  build: {
    rollupOptions: {
      treeshake: true,
    },
  },
})
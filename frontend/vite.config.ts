import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    minify: 'oxc',
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              debugName: 'vendor-chunks',
              name(moduleId) {
                if (moduleId.includes('node_modules')) {
                  if (
                    moduleId.includes('react/') ||
                    moduleId.includes('react-dom/') ||
                    moduleId.includes('react-router')
                  )
                    return 'vendor-core'
                  if (moduleId.includes('@tanstack')) return 'vendor-data'
                  if (moduleId.includes('zod') || moduleId.includes('react-hook-form'))
                    return 'vendor-forms'
                  if (
                    moduleId.includes('@base-ui') ||
                    moduleId.includes('@floating-ui') ||
                    moduleId.includes('tailwind-merge') ||
                    moduleId.includes('lucide-react')
                  )
                    return 'vendor-ui'
                  return 'vendor-other'
                }
              },
            },
          ],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    restoreMocks: true,
  },
})

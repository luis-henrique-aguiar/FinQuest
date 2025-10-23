import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { configDefaults } from 'vitest/config'
import type { UserConfig } from 'vite'

export default defineConfig({
  plugins: [react()],

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    exclude: [
      ...configDefaults.exclude,
      'node_modules/**',
      'dist/**',
      '.git/**',
    ],
  },
} as UserConfig)

import { defineConfig } from 'vite'
import type { UserConfig } from 'vite'
import type { InlineConfig } from 'vitest'
import react from '@vitejs/plugin-react'

interface VitestConfig extends UserConfig {
  test?: InlineConfig
}

const config: VitestConfig = {
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
}

export default defineConfig(config)

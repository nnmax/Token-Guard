import optimizeLocales from '@react-aria/optimize-locales-plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), {
    ...optimizeLocales.vite({
      locales: ['en-US', 'zh-CN'],
    }),
    enforce: 'pre',
  }],
})

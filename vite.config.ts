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
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'https://xpmzgpess2hxh6hjvfxqatpkwu0nqnyv.lambda-url.us-west-2.on.aws',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})

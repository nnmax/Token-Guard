import type { Config } from 'tailwindcss'
import { addDynamicIconSelectors } from '@iconify/tailwind'
import animate from 'tailwindcss-animate'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [addDynamicIconSelectors(), animate],
} satisfies Config

import type { Config } from 'tailwindcss'
import { addDynamicIconSelectors } from '@iconify/tailwind'
import animate from 'tailwindcss-animate'
import plugin from 'tailwindcss/plugin'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    addDynamicIconSelectors(),
    animate,
    // eslint-disable-next-line ts/unbound-method
    plugin(({ addUtilities }) => {
      addUtilities({
        '.loading': {
          pointerEvents: 'none',
          display: 'inline-block',
          aspectRatio: '1 / 1',
          width: '1em',
          backgroundColor: 'currentColor',
          maskSize: '100%',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
          maskImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjQnIGhlaWdodD0nMjQnIHN0cm9rZT0nIzAwMCcgdmlld0JveD0nMCAwIDI0IDI0JyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxzdHlsZT4uc3Bpbm5lcl9WOG0xe3RyYW5zZm9ybS1vcmlnaW46Y2VudGVyO2FuaW1hdGlvbjpzcGlubmVyX3pLb2EgMnMgbGluZWFyIGluZmluaXRlfS5zcGlubmVyX1Y4bTEgY2lyY2xle3N0cm9rZS1saW5lY2FwOnJvdW5kO2FuaW1hdGlvbjpzcGlubmVyX1lwWlMgMS41cyBlYXNlLW91dCBpbmZpbml0ZX1Aa2V5ZnJhbWVzIHNwaW5uZXJfektvYXsxMDAle3RyYW5zZm9ybTpyb3RhdGUoMzYwZGVnKX19QGtleWZyYW1lcyBzcGlubmVyX1lwWlN7MCV7c3Ryb2tlLWRhc2hhcnJheTowIDE1MDtzdHJva2UtZGFzaG9mZnNldDowfTQ3LjUle3N0cm9rZS1kYXNoYXJyYXk6NDIgMTUwO3N0cm9rZS1kYXNob2Zmc2V0Oi0xNn05NSUsMTAwJXtzdHJva2UtZGFzaGFycmF5OjQyIDE1MDtzdHJva2UtZGFzaG9mZnNldDotNTl9fTwvc3R5bGU+PGcgY2xhc3M9J3NwaW5uZXJfVjhtMSc+PGNpcmNsZSBjeD0nMTInIGN5PScxMicgcj0nOS41JyBmaWxsPSdub25lJyBzdHJva2Utd2lkdGg9JzMnPjwvY2lyY2xlPjwvZz48L3N2Zz4=")`,
        },
      })
    }),
  ],
} satisfies Config

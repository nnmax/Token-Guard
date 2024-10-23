import antfu from '@antfu/eslint-config'
import tailwind from 'eslint-plugin-tailwindcss'

export default antfu({
  react: true,
  lessOpinionated: true,
  ignores: ['dist', '.yarn'],
}, ...tailwind.configs['flat/recommended'])

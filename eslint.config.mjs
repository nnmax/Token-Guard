import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  lessOpinionated: true,
  ignores: ['dist', '.yarn'],
})

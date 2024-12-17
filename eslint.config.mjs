import antfu, {
  react as reactConfig,
} from '@antfu/eslint-config'
import pluginQuery from '@tanstack/eslint-plugin-query'
import reactCompiler from 'eslint-plugin-react-compiler'
import tailwind from 'eslint-plugin-tailwindcss'

export default antfu(
  {
    react: false,
    typescript: {
      tsconfigPath: './tsconfig.json',
    },
    lessOpinionated: false,
    ignores: ['dist', '.yarn', '.eslintcache', 'node_modules', 'public', 'yarn.lock', 'tsconfig.app.tsbuildinfo', 'tsconfig.node.json', '.dockerignore', 'Dockerfile', 'nginx.config.template'],
    stylistic: {
      overrides: {
        'antfu/if-newline': 'off',
      },
    },
  },
  reactConfig({
    files: ['**/*.tsx'],
    tsconfigPath: './tsconfig.json',
    overrides: {
      'react/no-leaked-conditional-rendering': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks-extra/no-direct-set-state-in-use-effect': 'error',
      'react-hooks-extra/no-direct-set-state-in-use-layout-effect': 'error',
      'react-hooks-extra/no-redundant-custom-hook': 'error',
      'react-hooks-extra/no-unnecessary-use-callback': 'error',
      'react-hooks-extra/no-unnecessary-use-memo': 'error',
      'react-hooks-extra/prefer-use-state-lazy-initialization': 'error',
      'react-hooks-extra/ensure-custom-hooks-using-other-hooks': 'error',
      'react-hooks-extra/ensure-use-memo-has-non-empty-deps': 'error',
      'react-naming-convention/component-name': 'error',
      'react-naming-convention/use-state': 'error',
    },
  }),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'ts/strict-boolean-expressions': 'off',
      'react-compiler/react-compiler': 'error',
    },
  },
  ...tailwind.configs['flat/recommended'],
  ...pluginQuery.configs['flat/recommended'],
)

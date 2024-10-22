import type { DEFAULT_NS, resources } from '.'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof DEFAULT_NS
    resources: typeof resources['en-US']
  }
}

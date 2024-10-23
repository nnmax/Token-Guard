import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enUS from './locales/en-US.json'
import zhCN from './locales/zh-CN.json'

export const DEFAULT_NS = 'translation'
export const resources = {
  'en-US': {
    [DEFAULT_NS]: enUS,
  },
  'zh-CN': {
    [DEFAULT_NS]: zhCN,
  },
} as const

export default i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources,
    lng: 'zh-CN',
    fallbackLng: 'zh-CN',
    defaultNS: DEFAULT_NS,
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  })

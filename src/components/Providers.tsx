import { I18nProvider, RouterProvider as ReactAriaRouterProvider } from 'react-aria-components'
import { useTranslation } from 'react-i18next'
import { useHref, useNavigate } from 'react-router-dom'

export default function Providers({ children }: { children?: React.ReactNode }) {
  const navigate = useNavigate()
  const [, { language }] = useTranslation()

  return (
    <I18nProvider locale={language}>
      <ReactAriaRouterProvider navigate={navigate} useHref={useHref}>
        {children}
      </ReactAriaRouterProvider>
    </I18nProvider>
  )
}

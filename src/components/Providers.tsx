import { I18nProvider, RouterProvider as ReactAriaRouterProvider } from 'react-aria-components'
import { RouterProvider, useHref, useNavigate } from 'react-router-dom'
import router from '../router'

export default function Providers({ children }: { children?: React.ReactNode }) {
  const navigate = useNavigate()
  return (
    <I18nProvider locale="en-US">
      <ReactAriaRouterProvider navigate={navigate} useHref={useHref}>
        <RouterProvider router={router} />
        {children}
      </ReactAriaRouterProvider>
    </I18nProvider>
  )
}

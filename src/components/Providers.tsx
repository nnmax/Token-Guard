import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nProvider, RouterProvider as ReactAriaRouterProvider } from 'react-aria-components'
import { useTranslation } from 'react-i18next'
import { useHref, useNavigate } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import wagmiConfig from '../wagmiConfig'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

export default function Providers({ children }: { children?: React.ReactNode }) {
  const navigate = useNavigate()
  const [, { language }] = useTranslation()

  return (
    <I18nProvider locale={language}>
      <ReactAriaRouterProvider navigate={navigate} useHref={useHref}>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </WagmiProvider>
      </ReactAriaRouterProvider>
    </I18nProvider>
  )
}

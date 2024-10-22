import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { type NavigateOptions, RouterProvider } from 'react-router-dom'
import router from './router'
import './index.css'
import './i18n'

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: NavigateOptions
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

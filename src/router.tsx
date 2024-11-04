import { createBrowserRouter } from 'react-router-dom'
import Root from './components/Root'
import Home from './pages/Home'
import LegacyPage from './pages/Legacy'
import PensionPage from './pages/Pension'
import TrustPage from './pages/Trust'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: 'legacy', element: <LegacyPage /> },
      { path: 'pension', element: <PensionPage /> },
      { path: 'trust', element: <TrustPage /> },
    ],
  },
])

export default router

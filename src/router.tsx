import { createBrowserRouter } from 'react-router-dom'
import Root from './components/Root'
import Home from './pages/Home'
import LegacyPage from './pages/Legacy'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Root />
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'legacy',
        element: <LegacyPage />,
      },
    ],
  },
])

export default router

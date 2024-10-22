import { createBrowserRouter } from 'react-router-dom'
import Providers from './components/Providers'
import Home from './pages/Home'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Providers>
        <Home />
      </Providers>
    ),
  },
])

export default router

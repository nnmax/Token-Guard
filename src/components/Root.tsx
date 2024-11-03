import { Outlet } from 'react-router-dom'
import Providers from './Providers'

export default function Root() {
  return (
    <Providers>
      <div className="min-h-screen w-screen bg-[#eee]">
        <div className="mx-auto h-full max-w-[1440px]">
          <Outlet />
        </div>
      </div>
    </Providers>
  )
}

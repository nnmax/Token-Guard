import { Outlet } from 'react-router-dom'
import Providers from './Providers'
import WalletModal from './WalletModal'

export default function Root() {
  return (
    <Providers>
      <div className="min-h-screen w-screen bg-[#eee]">
        <div className="mx-auto h-full max-w-[1440px]">
          <Outlet />
          <WalletModal />
        </div>
      </div>
    </Providers>
  )
}

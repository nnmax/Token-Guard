import BackHomeLink from './BackHomeLink'
import WalletModal from './WalletModal'

export default function Layout(props: {
  children: React.ReactNode
}) {
  const { children } = props
  return (
    <div className="px-[68px] py-[90px]">
      <BackHomeLink />
      <div className="relative mt-2 px-28">
        {children}
        <WalletModal />
      </div>
    </div>
  )
}

import { t } from 'i18next'
import { Button, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components'
import { useAccount, useDisconnect } from 'wagmi'
import DisconnectSvg from '../assets/images/disconnect.svg'
import { AUTHORIZATION_KEY } from '../constants'
import { useConnectedAndAuthorized } from '../store/hooks'

export default function ConnectedMenu() {
  const { disconnect } = useDisconnect()
  const { address } = useAccount()
  const { data: connectedAndAuthorized } = useConnectedAndAuthorized()

  const handleDisconnect = () => {
    disconnect()
    window.localStorage.removeItem(AUTHORIZATION_KEY)
  }

  if (!address || !connectedAndAuthorized) {
    return null
  }

  return (
    <MenuTrigger>
      <Button className="absolute right-28 top-1 flex h-8 items-center gap-2 rounded-[5px] border border-[#807A86A5] px-4 text-sm font-medium text-[#7A86A5]">
        <span className="icon-[mingcute--wallet-fill] text-xl text-[#3255AC]"></span>
        <span>
          {address.slice(2, 6)}
          ...
          {address.slice(-4)}
        </span>
        <span className="icon-[lsicon--down-filled] text-xl text-[#576FAA]"></span>
      </Button>

      <Popover>
        <Menu className="min-w-[174px] rounded-[5px] bg-[#7A86A5]/80 text-sm font-medium text-white">
          <MenuItem
            className="flex h-9 cursor-pointer items-center gap-2 rounded-[5px] px-4"
            onAction={handleDisconnect}
          >
            <img src={DisconnectSvg} alt="" className="" />
            <span>{t('common.disconnect')}</span>
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  )
}

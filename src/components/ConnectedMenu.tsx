import { t } from 'i18next'
import { Button, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components'
import { twMerge } from 'tailwind-merge'
import DisconnectSvg from '../assets/images/disconnect.svg'

export default function ConnectedMenu(props: {
  className?: string
}) {
  const { className } = props

  return (
    <MenuTrigger>
      <Button className={twMerge('flex h-8 items-center gap-2 rounded-[5px] border border-[#807A86A5] px-4 text-sm font-medium text-[#7A86A5]', className)}>
        <span className="icon-[mingcute--wallet-fill] text-xl text-[#3255AC]"></span>
        <span>JSLK...KASX</span>
        <span className="icon-[lsicon--down-filled] text-xl text-[#576FAA]"></span>
      </Button>

      <Popover>
        <Menu className="min-w-[174px] rounded-[5px] bg-[#7A86A5]/80 text-sm font-medium text-white">
          <MenuItem
            className="flex h-9 cursor-pointer items-center gap-2 rounded-[5px] px-4"
          >
            <img src={DisconnectSvg} alt="" className="" />
            <span>{t('common.disconnect')}</span>
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  )
}

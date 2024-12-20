import type { ButtonProps } from 'react-aria-components'
import { t } from 'i18next'
import { Button } from 'react-aria-components'
import { twMerge } from 'tailwind-merge'
import { useWalletModalOpen } from '../globalState'

export default function ConnectButton(props: Omit<ButtonProps, 'className'> & {
  className?: string
}) {
  const { className, onPress, ...otherProps } = props
  const { setData } = useWalletModalOpen()

  return (
    <Button
      className={twMerge('inline-flex gap-x-2 h-8 w-[168px] items-center justify-center rounded-[5px] bg-[#3255AC] text-sm font-medium text-white', className)}
      onPress={(e) => {
        setData(true)
        if (onPress) {
          onPress(e)
        }
      }}
      {...otherProps}
    >
      <span className="icon-[mingcute--wallet-fill] text-xl"></span>
      <span>{t('common.connectWallet')}</span>
    </Button>
  )
}

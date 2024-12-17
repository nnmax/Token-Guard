import type { Hex } from 'viem'
import type { ButtonProps } from './Button'
import { t } from 'i18next'
import { Button as AriaButton } from 'react-aria-components'
import { useSendTransaction } from 'wagmi'
import $api from '../api/fetchClient'
import IncreaseSvg from '../assets/images/increase.svg'
import SearchSvg from '../assets/images/search.svg'
import ShieldSvg from '../assets/images/shield.svg'
import { CONTRACT_ADDRESS, PRODUCT_TYPE } from '../constants'
import Button from './Button'

export interface RecordDataType {
  value?: number
  wbtc?: number
  weth?: number
  usdt?: number
  usdc?: number
}

export default function MyRecord(props: {
  title: React.ReactNode
  onClickShowDetails: () => void
  data: RecordDataType | null
  isInsured?: boolean
  productType: PRODUCT_TYPE
  depositButtonProps?: ButtonProps
  withdrawButtonProps?: ButtonProps
}) {
  const { title, onClickShowDetails, data, isInsured, productType, depositButtonProps, withdrawButtonProps } = props
  const legacyBoxItemClasses = 'flex-[120px] flex flex-col gap-[18px]'
  const { sendTransactionAsync } = useSendTransaction()

  const endInsuredApis = {
    [PRODUCT_TYPE.WILL]: $api.useMutation('post', '/set-will-insurance'),
    [PRODUCT_TYPE.PENSION]: $api.useMutation('post', '/set-social-security-insurance'),
    [PRODUCT_TYPE.TRUST]: $api.useMutation('post', '/set-trust-insurance'),
  }

  const api = endInsuredApis[productType]

  const handleEndInsure = async () => {
    const { calldata } = await api.mutateAsync({ body: { is_insured: false } })
    await sendTransactionAsync({
      data: calldata as Hex,
      to: CONTRACT_ADDRESS,
    })
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <h2 className="font-bold text-[#525A70]">{title}</h2>
          <AriaButton aria-label="Show Details" onPress={onClickShowDetails}><img src={SearchSvg} alt="Search" aria-hidden /></AriaButton>
        </div>
        <div className="flex gap-4">
          <Button className="w-[108px]" isDisabled={!data?.value}>
            <img src={IncreaseSvg} alt="" aria-hidden />
            <span>{t('common.financing')}</span>
          </Button>
          {isInsured
            ? (
                <Button
                  className="w-[148px]"
                  variant="outline"
                  onPress={() => {
                    handleEndInsure().catch(console.error)
                  }}
                >
                  <span className="icon-[ant-design--stop-outlined]" />
                  <span>{t('common.endInsure')}</span>
                </Button>
              )
            : (
                <Button className="w-[108px]" isDisabled={!data?.value}>
                  <img src={ShieldSvg} alt="" aria-hidden />
                  <span>{t('common.insure')}</span>
                </Button>
              )}
        </div>
      </div>
      <dl className="mt-7 flex items-center justify-between border-b border-[#6E86C2]/40 pb-[18px] text-center font-medium text-[#1A1A1A] [&_dd]:text-sm/6 [&_dt]:text-xs/6">
        <div className={legacyBoxItemClasses}>
          <dt>VALUE</dt>
          <dd>{typeof data?.value === 'number' ? `$ ${data.value}` : '-'}</dd>
        </div>
        <div className={legacyBoxItemClasses}>
          <dt>WBTC</dt>
          <dd>{data?.wbtc ?? '-'}</dd>
        </div>
        <div className={legacyBoxItemClasses}>
          <dt>WETH</dt>
          <dd>{data?.weth ?? '-'}</dd>
        </div>
        <div className={legacyBoxItemClasses}>
          <dt>USDT</dt>
          <dd>{data?.usdt ?? '-'}</dd>
        </div>
        <div className={legacyBoxItemClasses}>
          <dt>USDC</dt>
          <dd>{data?.usdc ?? '-'}</dd>
        </div>
        <div className={legacyBoxItemClasses}>
          <dt aria-label="Handle" aria-hidden>&nbsp;</dt>
          <dd className="flex gap-4">
            {!!depositButtonProps && (
              <Button
                size="small"
                className="w-[72px]"
                {...depositButtonProps}

              >
                {t('common.deposit')}
              </Button>
            )}
            {!!withdrawButtonProps && (
              <Button
                size="small"
                variant="outline"
                className="w-[72px]"
                isDisabled={!data?.value}
                {...withdrawButtonProps}
              >
                {t('common.withdraw')}
              </Button>
            )}
          </dd>
        </div>
      </dl>
    </section>
  )
}

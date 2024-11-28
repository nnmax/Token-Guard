import { t } from 'i18next'
import { Button as AriaButton } from 'react-aria-components'
import IncreaseSvg from '../assets/images/increase.svg'
import SearchSvg from '../assets/images/search.svg'
import ShieldSvg from '../assets/images/shield.svg'
import Button from './Button'

export default function MyRecord(props: {
  title: React.ReactNode
  onClickShowDetails: () => void
  handleNode: React.ReactNode
  data: {
    value?: number
    wbtc?: number
    weth?: number
    usdt?: number
    usdc?: number
  } | null
}) {
  const { title, onClickShowDetails, handleNode, data } = props

  const legacyBoxItemClasses = 'flex-[120px] flex flex-col gap-[18px]'

  return (
    <section>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <h2 className="font-bold text-[#525A70]">{title}</h2>
          <AriaButton aria-label="Show Details" onPress={onClickShowDetails}><img src={SearchSvg} alt="Search" aria-hidden /></AriaButton>
        </div>
        <div className="flex gap-4">
          <Button className="w-[108px]">
            <img src={IncreaseSvg} alt="" aria-hidden />
            <span>{t('common.financing')}</span>
          </Button>
          <Button className="w-[108px]">
            <img src={ShieldSvg} alt="" aria-hidden />
            <span>{t('common.insure')}</span>
          </Button>
        </div>
      </div>
      <dl className="mt-7 flex items-center justify-between border-b border-[#6E86C2]/40 pb-[18px] text-center font-medium text-[#1A1A1A] [&_dd]:text-sm/6 [&_dt]:text-xs/6">
        <div className={legacyBoxItemClasses}>
          <dt>VALUE</dt>
          <dd>{data?.value ? `$ ${data.value}` : '-'}</dd>
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
            {handleNode}
          </dd>
        </div>
      </dl>
    </section>
  )
}

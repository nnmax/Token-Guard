import { t } from 'i18next'
import { useState } from 'react'
import { flushSync } from 'react-dom'
import { Trans } from 'react-i18next'
import { toast } from 'react-toastify'
import $api from '../../api/fetchClient'
import ActivityTable from '../ActivityTable'
import Button from '../Button'
import DepositAndWithdrawModal, { type FormValues as DepositModalFormValues } from '../DepositAndWithdrawModal'
import MyRecord from '../MyRecord'
import FormModal from './FormModal'

export default function MainContent() {
  const { data: willData } = $api.useQuery('get', '/get-will', undefined, {
    initialData: {
      code: 0,
      isInsured: Date.now() % 2 === 0,
      releaseTime: Date.now(),
      totalValueUSD: 123456,
      lastPremiumTime: Date.now(),
      assets: [
        {
          token: 'WBTC',
          amount: 123.321,
        },
        {
          token: 'WETH',
          amount: 123.321,
        },
        {
          token: 'USDT',
          amount: 123.321,
        },
        {
          token: 'USDC',
          amount: 123.321,
        },
      ],
      beneficiaries: [
        {
          benAddr: '0x1234567890sadf',
          percent: 50,
        },
        {
          benAddr: '0x123456789032',
          percent: 50,
        },
      ],
    },
  })
  const { mutateAsync: depositWill, isPending: depositing } = $api.useMutation('post', '/deposit-will')
  const { mutateAsync: withdrawWill, isPending: withdrawing } = $api.useMutation('post', '/withdraw-will')
  const [depositModalOpen, setDepositModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'deposit' | 'withdraw'>('deposit')

  const handleSubmit = async (values: DepositModalFormValues) => {
    const api = modalType === 'deposit' ? depositWill : withdrawWill
    const successfulMessage = modalType === 'deposit' ? t('common.depositSuccessful') : t('common.withdrawSuccessful')
    const failureMessage = modalType === 'deposit' ? t('common.depositFailure') : t('common.withdrawFailure')

    await api({ body: values }).then(() => {
      toast.success(successfulMessage)
    }).catch((error) => {
      console.error(error)
      toast.error(failureMessage)
    })
  }

  return (
    <>
      <FormModal />
      <p className="mt-[26px] text-center text-xs/5 font-medium text-[#6E86C2]">
        <Trans i18nKey="legacy.createTips" />
      </p>
      <MyRecord
        title={t('legacy.myLegacy')}
        onClickShowDetails={() => {}}
        data={willData && willData.assets
          ? willData.assets.reduce(
            (acc, { token, amount }) => {
              acc[token.toLowerCase()] = amount
              return acc
            },
            {
              value: willData.totalValueUSD,
            } as Record<string, number>,
          )
          : null}
        handleNode={(
          <>
            <Button
              size="small"
              className="w-[72px]"
              onPress={() => {
                flushSync(() => {
                  setModalType('deposit')
                })
                setDepositModalOpen(true)
              }}
            >
              {t('common.deposit')}
            </Button>
            <Button
              size="small"
              variant="outline"
              className="w-[72px]"
              onPress={() => {
                flushSync(() => {
                  setModalType('withdraw')
                })
                setDepositModalOpen(true)
              }}
            >
              {t('common.withdraw')}

            </Button>
          </>
        )}
      />
      <DepositAndWithdrawModal
        type={modalType}
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={modalType === 'deposit' ? depositing : withdrawing}
      />
      <ActivityTable assetMode={0} />
    </>
  )
}

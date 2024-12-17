import type { Hex } from 'viem'
import { fromAbsolute, getLocalTimeZone, toCalendarDate } from '@internationalized/date'
import { t } from 'i18next'
import { useState } from 'react'
import { flushSync } from 'react-dom'
import { Trans } from 'react-i18next'
import { toast } from 'react-toastify'
import { useSendTransaction } from 'wagmi'
import $api from '../../api/fetchClient'
import { CONTRACT_ADDRESS, PRODUCT_TYPE } from '../../constants'
import ActivityTable from '../ActivityTable'
import Button from '../Button'
import DepositAndWithdrawModal, { type FormValues as DepositModalFormValues } from '../DepositAndWithdrawModal'
import MyRecord from '../MyRecord'
import FormModal from './FormModal'

export default function MainContent() {
  const { data: trustData } = $api.useQuery('get', '/get-trust', undefined, {
    select() {
      const fakeData = {
        assets: [
          { token: 'wbtc', amount: 100 },
          { token: 'weth', amount: 10 },
          { token: 'usdt', amount: 10 },
          { token: 'usdc', amount: 10 },
        ],
        totalValueUSD: 130,
        isInsured: true,
        ReleaseTime: Date.now(),
        lastPremiumTime: Date.now(),
        releasePercent: 10,
        code: 100,
        beneficiaries: [{
          benAddr: '0x1234567890123456789012345678901234567890',
          percent: 100,
        }],
      }
      return fakeData
    },
  })
  const { mutateAsync: depositWill, isPending: depositing } = $api.useMutation('post', '/deposit-trust')
  const { mutateAsync: withdrawWill, isPending: withdrawing } = $api.useMutation('post', '/withdraw-trust')
  const [depositModalOpen, setDepositModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [readonly, setReadonly] = useState(true)
  const [modalType, setModalType] = useState<'deposit' | 'withdraw'>('deposit')
  const { sendTransactionAsync: approve, isPending: approving } = useSendTransaction()
  const { sendTransactionAsync: transfer, isPending: transfering } = useSendTransaction()

  const handleSubmit = async (values: DepositModalFormValues) => {
    const api = modalType === 'deposit' ? depositWill : withdrawWill
    const successfulMessage = modalType === 'deposit' ? t('common.depositSuccessful') : t('common.withdrawSuccessful')
    const failureMessage = modalType === 'deposit' ? t('common.depositFailure') : t('common.withdrawFailure')

    const { approveCalldata, transferCalldata } = await api({ body: values }).then((res) => {
      let approveCalldata: Hex | undefined
      let transferCalldata: Hex | undefined
      if ('calldata' in res)
        transferCalldata = res.calldata as Hex
      if ('multiCalldata' in res) {
        res.multiCalldata.forEach((item) => {
          if (item.type === 'approve')
            approveCalldata = item.calldata as Hex
          if (item.type === 'transfer')
            transferCalldata = item.calldata as Hex
        })
      }
      return { approveCalldata, transferCalldata }
    }).catch((error) => {
      console.error(error)
      toast.error(failureMessage)
      throw new Error('error')
    })
    if (approveCalldata) {
      await approve({
        data: approveCalldata,
        to: CONTRACT_ADDRESS,
      })
    }
    if (transferCalldata) {
      await transfer({
        data: transferCalldata,
        to: CONTRACT_ADDRESS,
      })
    }
    toast.success(successfulMessage)
  }

  const data = trustData && Array.isArray(trustData.assets)
    ? trustData.assets.reduce(
        (acc, { token, amount }) => {
          acc[token.toLowerCase()] = amount
          return acc
        },
        {
          value: trustData.totalValueUSD,
        } as Record<string, number>,
      )
    : null

  return (
    <>
      {
        (!trustData?.beneficiaries || !trustData.beneficiaries.length) && (
          <>
            <Button className="mx-auto mt-[120px] w-[248px]" onPress={() => setCreateModalOpen(true)}>
              <span className="icon-[ic--baseline-plus] text-base"></span>
              <span>{t('trust.create')}</span>
            </Button>
            <FormModal open={createModalOpen} setOpen={setCreateModalOpen} />
          </>
        )
      }
      {
        (!!trustData?.ReleaseTime) && (
          <FormModal
            open={viewModalOpen}
            setOpen={setViewModalOpen}
            readonly={readonly}
            totalValue={trustData.totalValueUSD}
            setReadonly={setReadonly}
            defaultValues={{
              startingTime: trustData?.ReleaseTime ? toCalendarDate(fromAbsolute(trustData.ReleaseTime, getLocalTimeZone())) : null,
              wallets: trustData?.beneficiaries.map(({ benAddr, percent }) => ({
                address: benAddr,
                percentage: percent,
              })) ?? [],
            }}
          />
        )
      }
      <p className="mt-[26px] text-center text-xs/5 font-medium text-[#6E86C2]">
        <Trans i18nKey="trust.createTips" />
      </p>
      <MyRecord
        title={t('trust.myTrust')}
        onClickShowDetails={() => {}}
        data={data}
        depositButtonProps={{
          onPress: () => {
            flushSync(() => {
              setModalType('deposit')
            })
            setDepositModalOpen(true)
          },
        }}
        withdrawButtonProps={{
          onPress: () => {
            flushSync(() => {
              setModalType('withdraw')
            })
            setDepositModalOpen(true)
          },
        }}
        isInsured={trustData?.isInsured}
        productType={PRODUCT_TYPE.TRUST}
      />
      <DepositAndWithdrawModal
        type={modalType}
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={(modalType === 'deposit' ? depositing : withdrawing) || approving || transfering}
      />
      <ActivityTable productType={PRODUCT_TYPE.TRUST} />
    </>
  )
}

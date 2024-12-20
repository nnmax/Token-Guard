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
  const { data: willData } = $api.useQuery('get', '/get-will')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const { mutateAsync: depositWill, isPending: depositing } = $api.useMutation('post', '/deposit-will')
  const { mutateAsync: withdrawWill, isPending: withdrawing } = $api.useMutation('post', '/withdraw-will')
  const [depositModalOpen, setDepositModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'deposit' | 'withdraw'>('deposit')
  const [readonly, setReadonly] = useState(true)
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

  const { mutate } = $api.useMutation('post', '/withdraw-will-all')

  const data = willData && Array.isArray(willData.assets)
    ? willData.assets.reduce(
        (acc, { token, amount }) => {
          acc[token.toLowerCase()] = amount
          return acc
        },
        {
          value: willData.totalValueUSD,
        } as Record<string, number>,
      )
    : null

  return (
    <>
      {
        willData
          ? willData.releaseTime
            ? null
            : (
                <>
                  <Button className="mx-auto mt-[120px] w-[248px]" onPress={() => setCreateModalOpen(true)}>
                    <span className="icon-[ic--baseline-plus] text-base"></span>
                    <span>{t('legacy.create')}</span>
                  </Button>
                  <FormModal open={createModalOpen} setOpen={setCreateModalOpen} />
                </>
              )
          : null
      }
      {!!willData?.releaseTime && (
        <FormModal
          open={viewModalOpen}
          setOpen={setViewModalOpen}
          readonly={readonly}
          totalValue={willData.totalValueUSD}
          setReadonly={setReadonly}
          defaultValues={{
            startingTime: willData?.releaseTime ? toCalendarDate(fromAbsolute(willData.releaseTime, getLocalTimeZone())) : null,
            wallets: willData?.beneficiaries.map(({ benAddr, percent }) => ({
              address: benAddr,
              percentage: percent,
            })) ?? [],
          }}
        />
      )}
      <p className="mt-[26px] text-center text-xs/5 font-medium text-[#6E86C2]">
        <Trans i18nKey="legacy.createTips" />
      </p>
      <MyRecord
        title={t('legacy.myLegacy')}
        onClickShowDetails={() => {
          if (willData?.releaseTime) {
            setReadonly(true)
            setViewModalOpen(true)
          }
        }}
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
        isInsured={willData?.isInsured}
        productType={PRODUCT_TYPE.WILL}
      />
      <DepositAndWithdrawModal
        type={modalType}
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={(modalType === 'deposit' ? depositing : withdrawing) || approving || transfering}
      />
      <ActivityTable productType={PRODUCT_TYPE.WILL} />
      <Button onPress={() => {
        mutate({})
      }}
      >
        Withdraw All

      </Button>
    </>
  )
}

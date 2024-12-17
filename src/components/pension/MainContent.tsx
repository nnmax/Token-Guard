import type { Hex } from 'viem'
import { fromAbsolute, getLocalTimeZone, toCalendarDate } from '@internationalized/date'
import { t } from 'i18next'
import { useState } from 'react'
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
  const { data: pensionData } = $api.useQuery('get', '/get-social-security', undefined, {
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
        code: 100,
        ReleaseTime: Date.now(),
        lastPremiumTime: Date.now(),
        releaseMonths: 12,
      }
      return fakeData
    },
  })
  const { mutateAsync: depositPension, isPending: depositing } = $api.useMutation('post', '/deposit-social-security')
  const [depositModalOpen, setDepositModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const { sendTransactionAsync: approve, isPending: approving } = useSendTransaction()
  const { sendTransactionAsync: transfer, isPending: transfering } = useSendTransaction()

  const handleSubmit = async (values: DepositModalFormValues) => {
    const successfulMessage = t('common.depositSuccessful')
    const failureMessage = t('common.depositFailure')

    const { approveCalldata, transferCalldata } = await depositPension({ body: values }).then((res) => {
      let approveCalldata: Hex | undefined
      let transferCalldata: Hex | undefined
      res.multiCalldata.forEach((item) => {
        if (item.type === 'approve')
          approveCalldata = item.calldata as Hex
        if (item.type === 'transfer')
          transferCalldata = item.calldata as Hex
      })
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

  const data = pensionData && Array.isArray(pensionData.assets)
    ? pensionData.assets.reduce(
        (acc, { token, amount }) => {
          acc[token.toLowerCase()] = amount
          return acc
        },
        {
          value: pensionData.totalValueUSD,
        } as Record<string, number>,
      )
    : null

  return (
    <>
      {
        !pensionData?.ReleaseTime && (
          <>
            <Button className="mx-auto mt-[120px] w-[248px]" onPress={() => setCreateModalOpen(true)}>
              <span className="icon-[ic--baseline-plus] text-base"></span>
              <span>{t('pension.create')}</span>
            </Button>
            <FormModal open={createModalOpen} setOpen={setCreateModalOpen} />
          </>
        )
      }
      {!!pensionData?.ReleaseTime && (
        <FormModal
          open={viewModalOpen}
          setOpen={setViewModalOpen}
          readonly
          totalValue={pensionData.totalValueUSD}
          defaultValues={{
            startingTime: pensionData?.ReleaseTime ? toCalendarDate(fromAbsolute(pensionData.ReleaseTime, getLocalTimeZone())) : null,
            months: pensionData.releaseMonths,
          }}
        />
      )}
      <p className="mt-[26px] text-center text-xs/5 font-medium text-[#6E86C2]">
        <Trans i18nKey="pension.createTips" />
      </p>
      <MyRecord
        title={t('pension.myPension')}
        onClickShowDetails={() => {
          if (pensionData?.ReleaseTime) {
            setViewModalOpen(true)
          }
        }}
        data={data}
        depositButtonProps={{
          onPress: () => setDepositModalOpen(true),
        }}
        isInsured={pensionData?.isInsured}
        productType={PRODUCT_TYPE.PENSION}
      />
      <DepositAndWithdrawModal
        type="deposit"
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={depositing || approving || transfering}
      />
      <ActivityTable productType={PRODUCT_TYPE.PENSION} />
    </>
  )
}

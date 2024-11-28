import type { DateValue } from 'react-aria-components'
import { getLocalTimeZone } from '@internationalized/date'
import { t } from 'i18next'
import { useMemo, useState } from 'react'
import { Button as AriaButton, Form, Heading } from 'react-aria-components'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Trans } from 'react-i18next'
import { toast } from 'react-toastify'
import $api from '../../api/fetchClient'
import ActivityTable from '../../components/ActivityTable'
import Button from '../../components/Button'
import ConnectButton from '../../components/ConnectButton'
import ConnectedMenu from '../../components/ConnectedMenu'
import DatePicker from '../../components/DatePicker'
import DepositModal, { type FormValues as DepositModalFormValues } from '../../components/DepositModal'
import Keynote from '../../components/Keynote'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import MyRecord from '../../components/MyRecord'
import NumberField from '../../components/NumberField'
import TextField from '../../components/TextField'
import Title from '../../components/Title'
import { useConnectedAndAuthorized } from '../../store/hooks'

export default function LegacyPage() {
  const { data: connectedAndAuthorized } = useConnectedAndAuthorized()

  const keynotes = useMemo(() => [
    t('legacy.desc1'),
    t('legacy.desc2'),
    t('legacy.desc3'),
    t('legacy.desc4'),
    t('legacy.desc5'),
    t('legacy.desc6'),
  ], [])

  return (
    <Layout>
      <Title>{t('home.legacy')}</Title>
      <ConnectedMenu />
      <Keynote>
        {keynotes}
      </Keynote>
      {
        connectedAndAuthorized ? <MainContent /> : <ConnectButton className="mx-auto mt-[120px] flex" />
      }
    </Layout>
  )
}

interface FormValues {
  startingTime: DateValue | null
  wallets: { address: string, percentage: number }[]
}

function FormModal() {
  const labelClasses = 'text-center w-44'
  const [open, setOpen] = useState(false)
  const { control, handleSubmit: _handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      startingTime: null,
      wallets: [{ address: '', percentage: 100 }],
    },
  })
  const { fields, append, remove } = useFieldArray<FormValues>({ control, name: 'wallets' })

  const { mutateAsync, isPending } = $api.useMutation('post', '/create-will')

  const handleSubmit = async (formValues: FormValues) => {
    if (!formValues.startingTime) {
      toast.error(t('legacy.startingTimeRequired'))
      return
    }
    if (formValues.wallets.length === 1 && !formValues.wallets[0]!.percentage) {
      formValues.wallets[0]!.percentage = 100
    }
    await mutateAsync({
      body: {
        is_insured: false,
        release_time: formValues.startingTime.toDate(getLocalTimeZone()).valueOf(),
        beneficiaries: formValues.wallets.map(({ address, percentage }) => ({
          benAddr: address.startsWith('0x') ? address : `0x${address}`,
          percent: percentage,
        })),
      },
    })
    reset()
    setOpen(false)
  }

  return (
    <>
      <Button className="mx-auto mt-[120px] w-[248px]" onPress={() => setOpen(true)}>
        <span className="icon-[ic--baseline-plus] text-base"></span>
        <span>{t('legacy.create')}</span>
      </Button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        className="px-14 pb-6 pt-14"
      >
        <Heading slot="title" className="sr-only">{t('legacy.create')}</Heading>
        <Form
          className="flex flex-col gap-5"
          onSubmit={_handleSubmit(handleSubmit)}
        >
          <Controller
            control={control}
            name="startingTime"
            render={({ field, fieldState }) => (
              <DatePicker
                label={t('legacy.startingTime')}
                validationBehavior="aria"
                isInvalid={fieldState.invalid}
                name={field.name}
                isDisabled={field.disabled}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                labelClasses={labelClasses}
                endAdditional={<span className="size-8" />}
              />
            )}
          />
          <hr className="border-t-2 border-[#7A86A5]/40" />
          {
            fields.map((field, index) => (
              <div key={field.id}>
                <Controller
                  name={`wallets.${index}.address`}
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { disabled, ...restField }, fieldState }) => (
                    <TextField
                      {...restField}
                      isRequired
                      validationBehavior="aria"
                      isInvalid={fieldState.invalid}
                      labelClasses={labelClasses}
                      isDisabled={disabled}
                      autoComplete="off"
                      label={`${t('legacy.beneficiaryWallet')}${fields.length > 1 ? ` (${index + 1})` : ''}`}
                      placeholder={t('legacy.beneficiaryWalletPlaceholder')}
                      endAdditional={index === 0
                        ? <span className="size-8" />
                        : (
                            <AriaButton
                              aria-label="Delete"
                              className="flex size-8 items-center justify-center rounded-[5px] border border-[#7A86A5]/50 text-lg text-[#6E86C2]"
                              onPress={() => remove(index)}
                            >
                              <span aria-hidden className="icon-[uiw--delete]"></span>
                            </AriaButton>
                          )}
                    />
                  )}
                />
                <Controller
                  name={`wallets.${index}.percentage`}
                  control={control}
                  rules={{
                    required: true,
                    validate: (_, formValues) => {
                      if (formValues.wallets.reduce((acc, { percentage }) => acc + percentage, 0) > 100) {
                        return t('legacy.percentageTotal')
                      }
                      return false
                    },
                  }}
                  disabled={fields.length === 1}
                  render={({ field: { disabled, ...restField }, fieldState }) => (
                    <NumberField
                      {...restField}
                      isRequired
                      validationBehavior="aria"
                      isInvalid={fieldState.invalid}
                      labelClasses={labelClasses}
                      className="mt-7"
                      label={t('legacy.percentage')}
                      isDisabled={disabled}
                      endAdditional={<span className="flex size-8 items-center justify-center">%</span>}
                      errorMessage={index === fields.length - 1 ? fieldState.error?.message : undefined}
                    />
                  )}
                />
              </div>
            ))
          }
          <Button
            variant="outline"
            className="mt-14 self-center px-2"
            onPress={() => append({ address: '', percentage: 0 })}
          >
            <span className="icon-[ic--baseline-plus] text-lg text-[#6E86C2]"></span>
            <span className="text-xs font-medium text-[#7A86A5]">{t('common.addAnotherWallet')}</span>
          </Button>
          <div className="mt-6 flex w-full items-center justify-center gap-[88px] text-xs font-medium">
            <Button variant="dashed-outline" onPress={() => setOpen(false)} className="w-[168px]">{t('common.cancel')}</Button>
            <Button isPending={isPending} type="submit" className="w-[168px]">{t('common.confirm')}</Button>
          </div>
          <p className="mt-4 text-center text-xs font-medium text-[#6E86C2]">
            {t('legacy.formDesc')}
          </p>
        </Form>
      </Modal>
    </>
  )
}

function MainContent() {
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
  const [depositModalOpen, setDepositModalOpen] = useState(false)

  const handleDeposit = async (values: DepositModalFormValues) => {
    await depositWill({
      body: values,
    }).then(() => {
      toast.success(t('common.depositSuccessful'))
    }).catch((error) => {
      console.error(error)
      toast.error(t('common.depositFailure'))
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
            <Button size="small" className="w-[72px]" onPress={() => setDepositModalOpen(true)}>{t('common.deposit')}</Button>
            <Button size="small" variant="outline" className="w-[72px]">{t('common.withdraw')}</Button>
          </>
        )}
      />
      <DepositModal isOpen={depositModalOpen} onClose={() => setDepositModalOpen(false)} handleDeposit={handleDeposit} depositing={depositing} />
      <ActivityTable assetMode={0} />
    </>
  )
}

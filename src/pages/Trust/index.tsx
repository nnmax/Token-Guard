import type { DateValue } from 'react-aria-components'
import { t } from 'i18next'
import { useMemo, useState } from 'react'
import { Button as AriaButton, Form, Heading } from 'react-aria-components'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Trans } from 'react-i18next'
import { useAccount } from 'wagmi'
import ActivityTable from '../../components/ActivityTable'
import Button from '../../components/Button'
import ConnectButton from '../../components/ConnectButton'
import ConnectedMenu from '../../components/ConnectedMenu'
import DatePicker from '../../components/DatePicker'
import Keynote from '../../components/Keynote'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import MyRecord from '../../components/MyRecord'
import NumberField from '../../components/NumberField'
import TextField from '../../components/TextField'
import Title from '../../components/Title'

const tableData = [
  {
    id: '1',
    time: '2021-09-23 12:00:00',
    type: 'DEPOSIT' as 'DEPOSIT' | 'WITHDRAW',
    token: 'WBTC',
    amount: '0.1',
  },
  {
    id: '2',
    time: '2021-09-23 12:00:00',
    type: 'WITHDRAW' as 'DEPOSIT' | 'WITHDRAW',
    token: 'WBTC',
    amount: '0.1',
  },
  {
    id: '3',
    time: '2021-09-23 12:00:00',
    type: 'DEPOSIT' as 'DEPOSIT' | 'WITHDRAW',
    token: 'WBTC',
    amount: '0.1',
  },
  {
    id: '4',
    time: '2021-09-23 12:00:00',
    type: 'WITHDRAW' as 'DEPOSIT' | 'WITHDRAW',
    token: 'WBTC',
    amount: '0.1',
  },
]

export default function TrustPage() {
  const { isConnected } = useAccount()

  const keynotes = useMemo(() => [
    t('trust.desc1'),
    t('trust.desc2'),
    t('trust.desc3'),
    t('trust.desc4'),
    t('trust.desc5'),
    t('trust.desc6'),
  ], [])

  return (
    <Layout>
      <Title>{t('home.trust')}</Title>
      <ConnectedMenu />
      <Keynote>
        {keynotes}
      </Keynote>
      {
        isConnected
          ? (
              <>
                <FormModal />
                <p className="mt-[26px] text-center text-xs/5 font-medium text-[#6E86C2]">
                  <Trans i18nKey="trust.createTips" />
                </p>
                <MyRecord
                  title={t('trust.myTrust')}
                  onClickShowDetails={() => {}}
                  data={null}
                  handleNode={(
                    <>
                      <Button size="small" className="w-[72px]">{t('common.deposit')}</Button>
                      <Button size="small" variant="outline" className="w-[72px]">{t('common.withdraw')}</Button>
                    </>
                  )}
                />
                <ActivityTable data={tableData} />
              </>
            )
          : <ConnectButton className="mx-auto mt-[120px] flex" />
      }
    </Layout>
  )
}

interface FormValues {
  startingTime: DateValue | null
  wallets: { address: string, percentage: number }[]
}

function FormModal() {
  const [open, setOpen] = useState(false)
  const { control, handleSubmit: _handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      startingTime: null,
      wallets: [{ address: '', percentage: 100 }],
    },
  })
  const { fields, append, remove } = useFieldArray<FormValues>({ control, name: 'wallets' })
  const labelClasses = 'text-center w-44'

  const handleSubmit = (formValues: FormValues) => {
    // eslint-disable-next-line no-console
    console.log('%c [ formValues ]-76', 'font-size:13px; background:pink; color:#bf2c9f;', formValues)
    reset()
    setOpen(false)
  }

  return (
    <>
      <Button className="mx-auto mt-[120px] w-[248px]" onPress={() => setOpen(true)}>
        <span className="icon-[ic--baseline-plus] text-base"></span>
        <span>{t('trust.create')}</span>
      </Button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        className="px-14 pb-6 pt-14"
      >
        <Heading slot="title" className="sr-only">{t('trust.create')}</Heading>
        <Form
          className="flex flex-col gap-5"
          onSubmit={_handleSubmit(handleSubmit)}
        >
          <Controller
            control={control}
            name="startingTime"
            render={({ field, fieldState }) => (
              <DatePicker
                label={t('trust.startingTime')}
                isRequired
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
                      label={`${t('trust.beneficiaryWallet')}${fields.length > 1 ? ` (${index + 1})` : ''}`}
                      placeholder={t('trust.beneficiaryWalletPlaceholder')}
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
                  rules={{ required: true }}
                  disabled={fields.length === 1}
                  render={({ field: { disabled, ...restField }, fieldState }) => (
                    <NumberField
                      {...restField}
                      isRequired
                      validationBehavior="aria"
                      isInvalid={fieldState.invalid}
                      labelClasses={labelClasses}
                      className="mt-7"
                      label={t('trust.percentage')}
                      isDisabled={disabled}
                      endAdditional={<span className="flex size-8 items-center justify-center">%</span>}
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
            <Button type="submit" className="w-[168px]">{t('common.confirm')}</Button>
          </div>
          <p className="mt-4 text-center text-xs font-medium text-[#6E86C2]">
            {t('trust.formDesc')}
          </p>
        </Form>
      </Modal>
    </>
  )
}

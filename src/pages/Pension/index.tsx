import type { DateValue } from 'react-aria-components'
import { t } from 'i18next'
import { useMemo, useState } from 'react'
import { Form, Heading } from 'react-aria-components'
import { Controller, useForm } from 'react-hook-form'
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
import Title from '../../components/Title'

export default function PensionPage() {
  const { isConnected } = useAccount()

  const keynotes = useMemo(() => [
    t('pension.desc1'),
    t('pension.desc2'),
    t('pension.desc3'),
    t('pension.desc4'),
    t('pension.desc5'),
    t('pension.desc6'),
  ], [])

  return (
    <Layout>
      <Title>{t('home.pension')}</Title>
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
                  <Trans i18nKey="pension.createTips" />
                </p>
                <MyRecord
                  title={t('pension.myPension')}
                  onClickShowDetails={() => {}}
                  data={null}
                  handleNode={<Button size="small" className="w-[72px]">{t('common.deposit')}</Button>}
                />
                <ActivityTable assetMode={1} />
              </>
            )
          : <ConnectButton className="mx-auto mt-[120px] flex" />
      }
    </Layout>
  )
}

interface FormValues {
  startingTime: DateValue | null
  payment: number
}

function FormModal() {
  const [open, setOpen] = useState(false)
  const { control, handleSubmit: _handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      startingTime: null,
      payment: Number.NaN,
    },
  })
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
        <span>{t('pension.create')}</span>
      </Button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        className="px-14 pb-6 pt-14"
      >
        <Heading slot="title" className="sr-only">{t('pension.create')}</Heading>
        <Form
          className="flex flex-col gap-5"
          onSubmit={_handleSubmit(handleSubmit)}
        >
          <Controller
            control={control}
            name="startingTime"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <DatePicker
                label={t('pension.startingTime')}
                validationBehavior="aria"
                isInvalid={fieldState.invalid}
                name={field.name}
                isDisabled={field.disabled}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                labelClasses={labelClasses}
                description={t('pension.startingTimeDesc')}
              />
            )}
          />
          <Controller
            name="payment"
            control={control}
            rules={{ required: true, validate: value => !Number.isNaN(value) }}
            render={({ field: { disabled, ...restField }, fieldState }) => (
              <NumberField
                {...restField}
                isRequired
                validationBehavior="aria"
                isInvalid={fieldState.invalid}
                placeholder={t('pension.monthsOfPaymentPlaceholder')}
                labelClasses={labelClasses}
                label={t('pension.monthsOfPayment')}
                isDisabled={disabled}
                description={t('pension.monthsOfPaymentDesc')}
              />
            )}
          />

          <div className="mt-[92px] flex w-full items-center justify-center gap-[88px] text-xs font-medium">
            <Button variant="dashed-outline" onPress={() => setOpen(false)} className="w-[168px]">{t('common.cancel')}</Button>
            <Button type="submit" className="w-[168px]">{t('common.confirm')}</Button>
          </div>
          <p className="mt-4 text-center text-xs font-medium text-[#6E86C2]">
            {t('pension.formDesc')}
          </p>
        </Form>
      </Modal>
    </>
  )
}

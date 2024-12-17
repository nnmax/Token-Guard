import type { DateValue } from 'react-aria-components'
import type { Hex } from 'viem'
import { getLocalTimeZone } from '@internationalized/date'
import { t } from 'i18next'
import { Form, Heading } from 'react-aria-components'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useSendTransaction } from 'wagmi'
import $api from '../../api/fetchClient'
import Button from '../../components/Button'
import DatePicker from '../../components/DatePicker'
import Modal from '../../components/Modal'
import NumberField from '../../components/NumberField'
import { CONTRACT_ADDRESS } from '../../constants'
import TextField from '../TextField'

interface FormValues {
  startingTime: DateValue | null
  months: number
}

interface FormModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  defaultValues?: FormValues
  readonly?: boolean
  totalValue?: number | null
}

const DEFAULT_VALUES: FormValues = {
  startingTime: null,
  months: Number.NaN,
}

export default function FormModal(props: FormModalProps) {
  const { open, setOpen, readonly, totalValue, defaultValues = DEFAULT_VALUES } = props
  const labelClasses = 'text-center w-44'
  const { sendTransactionAsync, isPending: sendingTransaction } = useSendTransaction()
  const { mutateAsync: createPension, isPending: creating } = $api.useMutation('post', '/create-social-security')
  const { control, handleSubmit: _handleSubmit, reset } = useForm<FormValues>({
    defaultValues,
  })

  const handleSubmit = async (formValues: FormValues) => {
    if (!formValues.startingTime) {
      toast.error(t('common.startingTimeRequired'))
      return
    }
    const calldata = await createPension({
      body: {
        is_insured: false,
        release_time: formValues.startingTime.toDate(getLocalTimeZone()).valueOf(),
        release_months: formValues.months,
      },
    }).then((res) => {
      if (res.calldata) {
        return res.calldata as Hex
      }
      throw new Error('No calldata')
    }).catch((error) => {
      console.error(error)
      toast.error(t('common.createFailure'))
      throw error
    })
    await sendTransactionAsync({
      data: calldata,
      to: CONTRACT_ADDRESS,
    })
    toast.success(t('common.createSuccessful'))
    reset()
    setOpen(false)
  }

  return (
    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      className="px-14 pb-6 pt-14"
    >
      <Heading slot="title" className="sr-only">{t('pension.create')}</Heading>
      <Form
        className="flex flex-col gap-5"
        onSubmit={(event) => { _handleSubmit(handleSubmit)(event).catch(console.error) }}
      >
        {(totalValue !== null || totalValue !== undefined) && (
          <TextField
            labelClasses={labelClasses}
            label={t('pension.totalValue')}
            isReadOnly
            value={`$ ${totalValue ?? 0}`}
          />
        )}
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
              description={readonly ? undefined : t('pension.startingTimeDesc')}
              isReadOnly={readonly}
            />
          )}
        />
        <Controller
          name="months"
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
              description={readonly ? undefined : t('pension.monthsOfPaymentDesc')}
              isReadOnly={readonly}
            />
          )}
        />
        {
          readonly
            ? (
                <div className="mt-[92px] flex w-full items-center justify-center gap-[88px] text-xs font-medium">
                  <Button onPress={() => setOpen(false)} className="w-[168px]">{t('common.confirm')}</Button>
                </div>
              )
            : (
                <>
                  <div className="mt-[92px] flex w-full items-center justify-center gap-[88px] text-xs font-medium">
                    <Button variant="dashed-outline" onPress={() => setOpen(false)} className="w-[168px]">{t('common.cancel')}</Button>
                    <Button isPending={creating || sendingTransaction} type="submit" className="w-[168px]">{t('common.confirm')}</Button>
                  </div>
                  <p className="mt-4 text-center text-xs font-medium text-[#6E86C2]">
                    {t('pension.formDesc')}
                  </p>
                </>
              )
        }
      </Form>
    </Modal>
  )
}

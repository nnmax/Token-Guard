import type { Hex } from 'viem'
import { getLocalTimeZone } from '@internationalized/date'
import { t } from 'i18next'
import { Button as AriaButton, type DateValue, Form, Heading } from 'react-aria-components'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useSendTransaction } from 'wagmi'
import $api from '../../api/fetchClient'
import { CONTRACT_ADDRESS } from '../../constants'
import Button from '../Button'
import DatePicker from '../DatePicker'
import Modal from '../Modal'
import NumberField from '../NumberField'
import TextField from '../TextField'

interface FormValues {
  startingTime: DateValue | null
  wallets: { address: string, percentage: number }[]
}

interface FormModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  defaultValues?: FormValues
  readonly?: boolean
  setReadonly?: (readonly: boolean) => void
  totalValue?: number | null
}

const DEFAULT_VALUES: FormValues = {
  startingTime: null,
  wallets: [{ address: '', percentage: 100 }],
}

export default function FormModal(props: FormModalProps) {
  const { open, setOpen, defaultValues = DEFAULT_VALUES, readonly, totalValue, setReadonly } = props
  const labelClasses = 'text-center w-44'
  const { sendTransactionAsync, isPending: sendingTransaction } = useSendTransaction()
  const { control, handleSubmit: _handleSubmit, reset } = useForm<FormValues>({
    defaultValues,
  })
  const { fields, append, remove } = useFieldArray<FormValues>({ control, name: 'wallets' })
  const { mutateAsync: createTrust, isPending: creating } = $api.useMutation('post', '/create-trust')

  const handleSubmit = async (formValues: FormValues) => {
    if (!formValues.startingTime) {
      toast.error(t('common.startingTimeRequired'))
      return
    }
    if (formValues.wallets.length === 1 && !formValues.wallets[0]!.percentage) {
      formValues.wallets[0]!.percentage = 100
    }
    const calldata = await createTrust({
      body: {
        is_insured: false,
        release_time: formValues.startingTime.toDate(getLocalTimeZone()).valueOf(),
        release_percent: 0,
        beneficiaries: formValues.wallets.map(({ address, percentage }) => ({
          benAddr: address.startsWith('0x') ? address : `0x${address}`,
          percent: percentage,
        })),
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
      <Heading slot="title" className="sr-only">{t('trust.create')}</Heading>
      <Form
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          _handleSubmit(handleSubmit)(event).catch(console.error)
        }}
      >
        {(totalValue !== null || totalValue !== undefined) && (
          <TextField
            labelClasses={labelClasses}
            label={t('trust.totalValue')}
            isReadOnly
            value={`$ ${totalValue ?? 0}`}
          />
        )}
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
              isReadOnly={readonly}
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
                    isReadOnly={readonly}
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
                    isReadOnly={readonly}
                  />
                )}
              />
            </div>
          ))
        }
        {
          readonly
            ? (
                <div className="mt-6 flex w-full items-center justify-center gap-[88px] text-xs font-medium">
                  <Button
                    variant="dashed-outline"
                    onPress={() => {
                      setReadonly?.(false)
                    }}
                    className="w-[168px]"
                  >
                    {t('common.edit')}

                  </Button>
                </div>
              )
            : (
                <>
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
                    <Button isPending={creating || sendingTransaction} type="submit" className="w-[168px]">{t('common.confirm')}</Button>
                  </div>
                  {(totalValue === null || totalValue === undefined) && (
                    <p className="mt-4 text-center text-xs font-medium text-[#6E86C2]">
                      {t('trust.formDesc')}
                    </p>
                  )}
                </>
              )
        }
      </Form>
    </Modal>
  )
}

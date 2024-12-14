import type { DateValue } from 'react-aria-components'
import type { Hex } from 'viem'
import { getLocalTimeZone } from '@internationalized/date'
import { t } from 'i18next'
import { useState } from 'react'
import { Button as AriaButton, Form, Heading } from 'react-aria-components'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useSendTransaction } from 'wagmi'
import $api from '../../api/fetchClient'
import Button from '../Button'
import DatePicker from '../DatePicker'
import Modal from '../Modal'
import NumberField from '../NumberField'
import TextField from '../TextField'

interface FormValues {
  startingTime: DateValue | null
  wallets: { address: string, percentage: number }[]
}

export default function FormModal() {
  const labelClasses = 'text-center w-44'
  const [open, setOpen] = useState(false)
  const { sendTransactionAsync } = useSendTransaction()
  const { control, handleSubmit: _handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      startingTime: null,
      wallets: [{ address: '', percentage: 100 }],
    },
  })
  const { fields, append, remove } = useFieldArray<FormValues>({ control, name: 'wallets' })
  const { mutateAsync: createWill, isPending: creating } = $api.useMutation('post', '/create-will')

  const handleSubmit = async (formValues: FormValues) => {
    if (!formValues.startingTime) {
      toast.error(t('legacy.startingTimeRequired'))
      return
    }
    if (formValues.wallets.length === 1 && !formValues.wallets[0]!.percentage) {
      formValues.wallets[0]!.percentage = 100
    }
    const calldata = await createWill({
      body: {
        is_insured: false,
        release_time: formValues.startingTime.toDate(getLocalTimeZone()).valueOf(),
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
          onSubmit={(event) => {
            _handleSubmit(handleSubmit)(event).catch(console.error)
          }}
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
            <Button isPending={creating} type="submit" className="w-[168px]">{t('common.confirm')}</Button>
          </div>
          <p className="mt-4 text-center text-xs font-medium text-[#6E86C2]">
            {t('legacy.formDesc')}
          </p>
        </Form>
      </Modal>
    </>
  )
}

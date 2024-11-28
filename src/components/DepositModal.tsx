import type { ModalProps } from './Modal'
import clsx from 'clsx'
import { t } from 'i18next'
import { useId } from 'react'
import { Form, Heading, Input, Label, NumberField, Radio, RadioGroup } from 'react-aria-components'
import { Controller, useForm } from 'react-hook-form'
import $api from '../api/fetchClient'
import WETHImage from '../assets/images/weth.png'
import Button from './Button'
import Modal from './Modal'

interface DepositModalProps extends Omit<ModalProps, 'children'> {
  handleDeposit: (values: FormValues) => Promise<void>
  depositing: boolean
}

const radioClassName = clsx('flex h-[88px] w-[112px] cursor-pointer flex-col items-center justify-center rounded-[5px] border border-dashed border-[#A4A4A4] text-sm font-medium text-black transition-colors data-[selected]:border-0 data-[selected]:bg-[#3255AC] data-[selected]:text-white [&>[data-token]]:text-[36px]')

enum Token {
  WBTC = 'WBTC',
  WETH = 'WETH',
  USDT = 'USDT',
  USDC = 'USDC',
}

export interface FormValues {
  token: Token
  amount: number
}

export default function DepositModal(props: DepositModalProps) {
  const { isOpen, onClose, handleDeposit, depositing } = props
  const titleId = useId()
  const { control, watch, setValue, handleSubmit: _handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      token: Token.WBTC,
      amount: 0,
    },
  })

  const [token, amount] = watch(['token', 'amount'])

  const { data: balance, isLoading: balanceIsLoading } = $api.useQuery('get', '/get-balance', { params: { query: { token } } }, { enabled: isOpen })
  const maxValue = balance?.balance ?? 0

  const handleMax = () => {
    setValue('amount', maxValue)
  }

  const handleSubmit = _handleSubmit(async (values: FormValues) => {
    await handleDeposit(values)
    onClose?.()
    reset()
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[576px] rounded-[20px] " padding="24px 52px 40px" contentClassName="flex flex-col">
      <Heading id={titleId} slot="title" className="text-2xl/10 font-bold uppercase text-[#6E86C2]">{t('common.deposit')}</Heading>
      <Form className="flex flex-col" onSubmit={handleSubmit}>
        <Controller
          control={control}
          name="token"
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              name={field.name}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isDisabled={field.disabled}
              className="mt-4 flex gap-2"
              aria-labelledby={titleId}
            >
              <Radio className={radioClassName} value={Token.WBTC}>
                <span aria-hidden data-token className="icon-[token--wbtc]"></span>
                <span>{Token.WBTC}</span>
              </Radio>
              <Radio className={radioClassName} value={Token.WETH}>
                <img aria-hidden data-token alt="" src={WETHImage} width="36" height="36" loading="lazy" />
                <span>{Token.WETH}</span>
              </Radio>
              <Radio className={radioClassName} value={Token.USDT}>
                <span aria-hidden data-token className="icon-[cryptocurrency-color--usdt]"></span>
                <span>{Token.USDT}</span>
              </Radio>
              <Radio className={radioClassName} value={Token.USDC}>
                <span aria-hidden data-token className="icon-[token-branded--usdc]"></span>
                <span>{Token.USDC}</span>
              </Radio>
            </RadioGroup>
          )}
        />
        <div className="relative mt-8">
          <Controller
            control={control}
            name="amount"
            rules={{
              required: true,
              min: 0,
              max: maxValue,
            }}
            render={({ field, fieldState }) => (
              <NumberField
                isRequired
                minValue={0}
                maxValue={maxValue}
                className="flex flex-col gap-2"
                isInvalid={fieldState.invalid}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                isDisabled={field.disabled}
              >
                <Label className="text-sm/6 font-semibold text-[#525A70]">{t('common.depositAmount')}</Label>
                <Input ref={field.ref} className="h-16 rounded-[5px] border border-black/10 py-4 pl-6 pr-[92px] text-2xl/10 font-semibold text-[#3255AC]" />
              </NumberField>
            )}
          />
          <Button onPress={handleMax} className="absolute bottom-4 right-4 h-8 w-[60px] rounded-[5px] bg-[#6E86C2]">{t('common.max')}</Button>
        </div>
        <p className="mt-10 flex gap-4">
          <span className="text-sm/6 font-semibold text-[#525A70]">{t('common.available')}</span>
          <span className={clsx('text-base font-medium text-black', {
            loading: balanceIsLoading,
          })}
          >
            {balance?.balance ?? '-'}
          </span>
        </p>
        <Button className="mx-auto mt-8 w-60" isDisabled={!amount || amount <= 0} isPending={depositing} type="submit">{t('common.confirm')}</Button>
      </Form>
    </Modal>
  )
}

import type { NumberFieldProps as AriaNumberFieldProps, ValidationResult } from 'react-aria-components'
import { forwardRef } from 'react'
import { NumberField as AriaNumberField, FieldError, Input, Label, Text } from 'react-aria-components'
import { twMerge } from 'tailwind-merge'

interface NumberFieldProps extends Omit<AriaNumberFieldProps, 'className'> {
  className?: string
  label?: string
  description?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
  placeholder?: string
  labelClasses?: string
  endAdditional?: React.ReactNode
}

const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>((
  { label, description, labelClasses, errorMessage, className, placeholder, endAdditional, ...restProps },
  ref,
) => {
  return (
    <div className={twMerge('flex w-full gap-6', className)}>
      <AriaNumberField className={twMerge('flex w-full gap-2')} {...restProps}>
        <Label
          className={twMerge(
            'text-base/8 font-semibold text-[#525A70]',
            labelClasses,
          )}
        >
          {label}
        </Label>
        <Input ref={ref} className="h-8 flex-1 rounded-[5px] bg-[#E8E8E8] px-2" placeholder={placeholder} />
        {description && <Text slot="description">{description}</Text>}
        <FieldError>{errorMessage}</FieldError>
      </AriaNumberField>
      {endAdditional}
    </div>
  )
})

export default NumberField

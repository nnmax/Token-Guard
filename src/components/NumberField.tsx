import type { NumberFieldProps as AriaNumberFieldProps, ValidationResult } from 'react-aria-components'
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
  ref?: React.Ref<HTMLInputElement>
}

function NumberField(props: NumberFieldProps) {
  const { ref, label, description, labelClasses, errorMessage, className, placeholder, endAdditional, isReadOnly, value, ...restProps } = props
  return (
    <div className={twMerge('flex w-full gap-6', className)}>
      <AriaNumberField className={twMerge('flex w-full gap-2')} isReadOnly={isReadOnly} value={value} {...restProps}>
        <Label
          className={twMerge(
            'text-base/8 font-semibold text-[#525A70]',
            labelClasses,
          )}
        >
          {label}
        </Label>
        <div className="flex-1">
          {isReadOnly
            ? (
                <div className="flex items-center px-2">
                  <span>{value}</span>
                  {endAdditional}
                </div>
              )
            : (
                <Input
                  ref={ref}
                  className="h-8 w-full rounded-[5px] bg-[#E8E8E8] px-2 read-only:bg-transparent disabled:cursor-not-allowed data-[invalid]:border data-[invalid]:border-[#FA5151]"
                  placeholder={placeholder}
                />
              )}
          {typeof description === 'string' && description !== '' && <Text slot="description" className="text-xs/5 font-medium text-black/30">{description}</Text>}
          <FieldError className="text-xs font-normal text-[#FA5151]">{errorMessage}</FieldError>
        </div>
      </AriaNumberField>
      {!isReadOnly && endAdditional}
    </div>
  )
}

export default NumberField

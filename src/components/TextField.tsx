import type { TextFieldProps as AriaTextFieldProps } from 'react-aria-components'
import { forwardRef } from 'react'
import { TextField as AriaTextField, Input, Label, Text } from 'react-aria-components'
import { twMerge } from 'tailwind-merge'

interface TextFieldProps extends Omit<AriaTextFieldProps, 'className'> {
  className?: string
  label?: string
  description?: string
  placeholder?: string
  labelClasses?: string
  endAdditional?: React.ReactNode
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>((
  { label, description, labelClasses, className, placeholder, endAdditional, ...restProps },
  ref,
) => {
  return (
    <div className={twMerge('flex w-full gap-6', className)}>
      <AriaTextField
        className={twMerge('flex w-full gap-2')}
        {...restProps}
      >
        <Label
          className={twMerge(
            'text-base/8 font-semibold text-[#525A70]',
            labelClasses,
          )}
        >
          {label}
        </Label>
        <div className="flex flex-1 flex-col gap-1">
          <Input
            ref={ref}
            className="h-8 rounded-[5px] bg-[#E8E8E8] px-2"
            placeholder={placeholder}
          />
          {description && <Text slot="description">{description}</Text>}
        </div>
      </AriaTextField>
      {endAdditional}
    </div>
  )
})

export default TextField

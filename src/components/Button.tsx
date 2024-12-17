import clsx from 'clsx'
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components'
import { twMerge } from 'tailwind-merge'

export interface ButtonProps extends Omit<AriaButtonProps, 'className'> {
  className?: string
  /**
   * The size of the button.
   * @default 'medium'
   */
  size?: 'small' | 'medium'
  /**
   * The variant of the button.
   * @default 'primary
   */
  variant?: 'primary' | 'outline' | 'dashed-outline'
}

export default function Button(props: ButtonProps) {
  const { className, size = 'medium', variant = 'primary', isDisabled, isPending, children, ...restProps } = props

  return (
    <AriaButton
      isPending={isPending}
      isDisabled={isDisabled}
      className={twMerge(
        clsx(
          'flex items-center justify-center gap-1.5 text-xs font-medium',
          {
            'h-6 rounded-[3px]': size === 'small',
            'h-8 rounded-[5px]': size === 'medium',
            'text-white bg-[#3255AC]': variant === 'primary',
            'border border-[#7A86A5]/50 text-[#7A86A5]': variant === 'outline',
            'border border-dashed border-[#3255AC] text-[#3255AC]': variant === 'dashed-outline',
          },
          {
            'bg-black/[0.08] text-black/30': variant === 'primary' && isDisabled,
          },
        ),
        className,
      )}
      {...restProps}
    >
      {state => (
        <>
          {isPending
            ? (
                <span className="loading" aria-label="Loading..." />
              )
            : (
                typeof children === 'function' ? children(state) : children
              )}
        </>
      )}
    </AriaButton>
  )
}

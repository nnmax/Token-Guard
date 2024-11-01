import type { DialogProps, ModalOverlayProps } from 'react-aria-components'
import clsx from 'clsx'
import { Modal as AriaModal, Button, Dialog, DialogTrigger, ModalOverlay } from 'react-aria-components'
import { twMerge } from 'tailwind-merge'

interface ModalProps extends Omit<ModalOverlayProps, 'className' | 'children'> {
  'className'?: string
  'trigger'?: React.ReactNode
  'children'?: DialogProps['children']
  'maxWidth'?: string
  'onClose'?: () => void
  'contentClassName'?: string
  'padding'?: string
  'showCloseButton'?: boolean
  'aria-label'?: string
}

export default function Modal(props: ModalProps) {
  const {
    maxWidth,
    trigger,
    children,
    className,
    onClose,
    onOpenChange,
    contentClassName,
    isDismissable = true,
    style,
    padding,
    showCloseButton = false,
    'aria-label': ariaLabel,
    ...restProps
  } = props

  const handleOpenChange = (changedOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(changedOpen)
    }
    if (!changedOpen && onClose) {
      onClose()
    }
  }

  const content = (
    <ModalOverlay
      className="fixed left-0 top-0 z-20 flex h-[--visual-viewport-height] w-screen items-center justify-center bg-black/50 data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in data-[exiting]:fade-out"
      isDismissable={isDismissable}
      onOpenChange={handleOpenChange}
      {...restProps}
    >
      <AriaModal
        style={{
          maxWidth,
          padding,
          ...style,
        }}
        className={twMerge(
          'data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:zoom-in-75 data-[exiting]:zoom-out-75 relative max-h-[calc(100vh-32px)] w-full max-w-[768px] overflow-y-auto rounded-lg bg-white px-4 py-8 outline-none',
          className,
        )}
      >
        <Dialog aria-label={ariaLabel} className={clsx(contentClassName, 'focus-visible:outline-none')}>
          {(options) => {
            return (
              <>
                {showCloseButton && (
                  <Button
                    autoFocus
                    className="absolute right-5 top-5 size-6"
                    onPress={() => {
                      if (onClose) {
                        onClose()
                      }
                      if (onOpenChange) {
                        onOpenChange(false)
                      }
                    }}
                  >
                    <span className="icon-[pixelarticons--close] text-2xl" />
                  </Button>
                )}
                {typeof children === 'function' ? children(options) : children}
              </>
            )
          }}

        </Dialog>
      </AriaModal>
    </ModalOverlay>
  )

  if (trigger) {
    return (
      <DialogTrigger
        onOpenChange={handleOpenChange}
        {...restProps}
      >
        {trigger}
        {content}
      </DialogTrigger>
    )
  }

  return content
}

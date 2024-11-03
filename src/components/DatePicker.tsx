import type { DatePickerProps as AriaDatePickerProps, ButtonProps, DateValue, PopoverProps } from 'react-aria-components'
import { DatePicker as AriaDatePicker, Button, Calendar, CalendarCell, CalendarGrid, CalendarGridBody, CalendarGridHeader, CalendarHeaderCell, DateInput, DateSegment, Dialog, Group, Heading, Label, Popover } from 'react-aria-components'
import { twMerge } from 'tailwind-merge'

interface DatePickerProps extends AriaDatePickerProps<DateValue> {
  labelClasses?: string
  endAdditional?: React.ReactNode
  label?: React.ReactNode
}

export default function DatePicker(props: DatePickerProps) {
  const { labelClasses, endAdditional, label, ...restProps } = props

  return (
    <div className="flex w-full gap-6">
      <AriaDatePicker
        {...restProps}
        className="group flex w-full gap-2"
      >
        <Label
          className={twMerge(
            'flex cursor-default items-center justify-center text-base font-semibold text-[#525A70]',
            labelClasses,
          )}
        >
          {label}
        </Label>
        <Group className="flex flex-1 rounded-[5px] bg-[#E8E8E8] text-black/30 group-open:bg-white">
          <DateInput className="flex flex-1 justify-center py-1">
            {segment => (
              <DateSegment
                segment={segment}
                className="rounded-sm px-0.5 tabular-nums caret-transparent outline-none placeholder-shown:italic focus:bg-violet-700 focus:text-white"
              />
            )}
          </DateInput>
          <Button className="pressed:bg-purple-100 flex items-center rounded-r-lg border-0 border-l border-solid border-l-purple-200 bg-transparent px-3 text-gray-700 outline-none ring-black transition focus-visible:ring-2">
            <span className="icon-[lsicon--down-filled]"></span>
          </Button>
        </Group>
        <MyPopover>
          <Dialog className="p-6 text-gray-600">
            <Calendar>
              <header className="flex w-full items-center gap-1 px-1 pb-4">
                <Heading className="ml-2 flex-1 text-2xl font-semibold" />
                <RoundButton slot="previous">
                  <span className="icon-[mingcute--left-line]"></span>
                </RoundButton>
                <RoundButton slot="next">
                  <span className="icon-[mingcute--right-line]"></span>
                </RoundButton>
              </header>
              <CalendarGrid className="border-separate border-spacing-1">
                <CalendarGridHeader>
                  {day => (
                    <CalendarHeaderCell className="text-xs font-semibold text-gray-500">
                      {day}
                    </CalendarHeaderCell>
                  )}
                </CalendarGridHeader>
                <CalendarGridBody>
                  {date => (
                    <CalendarCell
                      date={date}
                      className="outside-month:text-gray-300 pressed:bg-gray-200 selected:bg-violet-700 selected:text-white flex size-9 cursor-default items-center justify-center rounded-full outline-none ring-violet-600/70 ring-offset-2 hover:bg-gray-100 focus-visible:ring"
                    />
                  )}
                </CalendarGridBody>
              </CalendarGrid>
            </Calendar>
          </Dialog>
        </MyPopover>
      </AriaDatePicker>
      {endAdditional}
    </div>
  )
}

function RoundButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      className="pressed:bg-gray-200 flex size-9 cursor-default items-center justify-center rounded-full border-0 bg-transparent text-gray-600 outline-none ring-violet-600/70 ring-offset-2 hover:bg-gray-100 focus-visible:ring"
    />
  )
}

function MyPopover(props: PopoverProps) {
  return (
    <Popover
      {...props}
      className={({ isEntering, isExiting }) => `
        overflow-auto rounded-lg drop-shadow-lg ring-1 ring-black/10 bg-white
        ${
    isEntering
      ? 'animate-in fade-in placement-bottom:slide-in-from-top-1 placement-top:slide-in-from-bottom-1 ease-out duration-200'
      : ''
    }
        ${
    isExiting
      ? 'animate-out fade-out placement-bottom:slide-out-to-top-1 placement-top:slide-out-to-bottom-1 ease-in duration-150'
      : ''
    }
      `}
    />
  )
}

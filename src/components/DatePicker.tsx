import type { DatePickerProps as AriaDatePickerProps, ButtonProps, DateValue, PopoverProps } from 'react-aria-components'
import { getLocalTimeZone, today } from '@internationalized/date'
import clsx from 'clsx'
import { DatePicker as AriaDatePicker, Button, Calendar, CalendarCell, CalendarGrid, CalendarGridBody, CalendarGridHeader, CalendarHeaderCell, DateInput, DateSegment, Dialog, Group, Heading, Label, Popover, Text } from 'react-aria-components'
import { twMerge } from 'tailwind-merge'

interface DatePickerProps extends AriaDatePickerProps<DateValue> {
  labelClasses?: string
  endAdditional?: React.ReactNode
  label?: React.ReactNode
  description?: React.ReactNode
}

const now = today(getLocalTimeZone())

export default function DatePicker(props: DatePickerProps) {
  const { labelClasses, endAdditional, label, description, className, value, defaultValue, isReadOnly, ...restProps } = props

  const hasValue = !!value || !!defaultValue

  return (
    <div className="flex w-full gap-6">
      <AriaDatePicker
        minValue={now}
        isDateUnavailable={date => date.compare(now) < 0}
        value={value}
        defaultValue={defaultValue}
        isReadOnly={isReadOnly}
        {...restProps}
        className={state => twMerge('group flex w-full gap-2', typeof className === 'function' ? className(state) : className)}
      >
        <Label
          className={twMerge(
            'flex cursor-default items-center justify-center text-base font-semibold text-[#525A70]',
            labelClasses,
          )}
        >
          {label}
        </Label>
        <div className="flex-1">
          <Group className={twMerge('flex rounded-[5px] bg-[#E8E8E8] group-open:bg-white', isReadOnly && 'bg-transparent')}>
            <DateInput className={clsx('flex flex-1 px-2 py-1', !hasValue && 'text-black/30')}>
              {segment => (
                <DateSegment
                  segment={segment}
                  className="rounded-sm px-0.5 tabular-nums caret-transparent outline-none placeholder-shown:italic focus:bg-violet-700 focus:text-white"
                />
              )}
            </DateInput>
            {!isReadOnly && (
              <Button className="flex items-center rounded-r-lg border-0 border-l border-solid border-l-purple-200 bg-transparent px-3 text-gray-700 outline-none ring-black transition focus-visible:ring-2 data-[pressed]:bg-purple-100">
                <span className="icon-[lsicon--down-filled]" />
              </Button>
            )}
          </Group>
          {!!description && (
            <Text slot="description" className="text-xs/5 font-medium text-black/30">{description}</Text>
          )}
        </div>
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
                      className="flex size-9 cursor-default items-center justify-center rounded-full outline-none ring-violet-600/70 ring-offset-2 focus-visible:ring data-[hovered]:bg-gray-100 data-[pressed]:bg-gray-200 data-[selected]:!bg-violet-700 data-[outside-month]:text-gray-300 data-[selected]:text-white data-[unavailable]:text-gray-300"
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
      className="flex size-9 cursor-default items-center justify-center rounded-full border-0 bg-transparent text-gray-600 outline-none ring-violet-600/70 ring-offset-2 hover:bg-gray-100 focus-visible:ring data-[pressed]:bg-gray-200"
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
      ? 'animate-in fade-in data-[placement-bottom]:slide-in-from-top-1 data-[[placement-top]:slide-in-from-bottom-1 ease-out duration-200'
      : ''
    }
        ${
    isExiting
      ? 'animate-out fade-out data-[placement-bottom]:slide-out-to-top-1 data-[[placement-top]:slide-out-to-bottom-1 ease-in duration-150'
      : ''
    }
      `}
    />
  )
}

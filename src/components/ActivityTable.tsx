import clsx from 'clsx'
import { t } from 'i18next'
import { Cell, Column, Row, Table, TableBody, TableHeader } from 'react-aria-components'

interface ActivityData {
  id: string
  time: string
  type: 'DEPOSIT' | 'WITHDRAW'
  token: string
  amount: string
}

export default function ActivityTable(props: {
  data: ActivityData[]
}) {
  const { data } = props
  const thClasses = 'text-xs/6 font-semibold text-[#1A1A1A]/70'

  return (
    <section className="mt-[60px]">
      <h2 className="text-lg/10 font-bold text-[#525A70]">{t('legacy.activity')}</h2>
      <Table aria-label="Activity" selectionMode="none" className="mt-5 w-full text-center">
        <TableHeader className="h-10 border-b border-[#6E86C2]">
          <Column className={thClasses} isRowHeader>{t('common.tableTime')}</Column>
          <Column className={thClasses}>{t('common.tableType')}</Column>
          <Column className={thClasses}>{t('common.tableToken')}</Column>
          <Column className={thClasses}>{t('common.tableAmount')}</Column>
        </TableHeader>
        <TableBody items={data}>
          {
            item => (
              <Row
                id={item.id}
                className={clsx('h-[60px] border-b border-[#6E86C2]', {
                  'bg-[#7A86A5]/20': item.type === 'WITHDRAW',
                })}
              >
                <Cell className="text-sm/6 font-medium text-[#1A1A1A]">{item.time}</Cell>
                <Cell className="text-xs/5 font-medium text-[#7A86A5]">{item.type}</Cell>
                <Cell className="text-sm/6 font-semibold text-[#3255AC]">{item.token}</Cell>
                <Cell className="text-sm/6 font-medium text-[#1A1A1A]">{item.amount}</Cell>
              </Row>
            )
          }
        </TableBody>
      </Table>
    </section>
  )
}

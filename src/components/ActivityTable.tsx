import type { PRODUCT_TYPE } from '../constants'
import clsx from 'clsx'
import { t } from 'i18next'
import { Cell, Column, Row, Table, TableBody, TableHeader } from 'react-aria-components'
import $api from '../api/fetchClient'

export default function ActivityTable(props: {
  productType: PRODUCT_TYPE
}) {
  const { productType: assetMode } = props
  const thClasses = 'text-xs/6 font-semibold text-[#1A1A1A]/70'

  const { data: operations, isLoading } = $api.useQuery('get', '/get-asset-operations', {
    params: {
      query: {
        asset_mode: assetMode,
      },
    },
  })

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
        <TableBody
          items={operations?.operations}
          renderEmptyState={
            isLoading
              ? () => <p className="mt-10 text-2xl text-[#9e9e9e] loading" />
              : () => <p className="mt-10 text-sm text-[#9e9e9e]">NO DATA</p>
          }
        >
          {
            item => (
              <Row
                id={JSON.stringify(item)}
                className={clsx('h-[60px] border-b border-[#6E86C2]', {
                  'bg-[#7A86A5]/20': item.operation_type === 'WITHDRAW',
                })}
              >
                <Cell className="text-sm/6 font-medium text-[#1A1A1A]">{item.timestamp}</Cell>
                <Cell className="text-xs/5 font-medium text-[#7A86A5]">{item.operation_type}</Cell>
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

import type { DateValue } from 'react-aria-components'
import { t } from 'i18next'
import { Button as AriaButton, Cell, Column, Form, Row, Table, TableBody, TableHeader } from 'react-aria-components'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import IncreaseSvg from '../../assets/images/increase.svg'
import SearchSvg from '../../assets/images/search.svg'
import ShieldSvg from '../../assets/images/shield.svg'
import Button from '../../components/Button'
import ConnectButton from '../../components/ConnectButton'
import ConnectedMenu from '../../components/ConnectedMenu'
import DatePicker from '../../components/DatePicker'
import Modal from '../../components/Modal'
import NumberField from '../../components/NumberField'
import TextField from '../../components/TextField'

const connected = true

export default function LegacyPage() {
  return (
    <div className="px-[68px] py-[90px]">
      <Link className="inline-flex items-center px-2 text-xs font-medium text-[#576FAA]" to="/">
        <span className="icon-[mingcute--left-line] text-[32px]"></span>
        <span>Home</span>
      </Link>
      <div className="relative mt-2 px-28">
        <h1 className="text-center text-[32px] font-bold leading-10 text-[#576FAA]">{t('home.legacy')}</h1>
        {connected && <ConnectedMenu className="absolute right-28 top-1" />}
        <ul className="mt-10 flex flex-wrap gap-x-[49px] gap-y-4 text-sm/10 font-bold text-[#6E86C2]">
          <li className="h-10 flex-[327px] rounded-[5px] border border-dashed border-[#6E86C2] text-center">Smart Contract Protection</li>
          <li className="h-10 flex-[327px] rounded-[5px] border border-dashed border-[#6E86C2] text-center">Accident Prevention</li>
          <li className="h-10 flex-[327px] rounded-[5px] border border-dashed border-[#6E86C2] text-center">Deposit or Withdraw at any time</li>
          <li className="h-10 flex-[327px] rounded-[5px] border border-dashed border-[#6E86C2] text-center">Family Heritage</li>
          <li className="h-10 flex-[327px] rounded-[5px] border border-dashed border-[#6E86C2] text-center">0 Inheritance Tax</li>
          <li className="h-10 flex-[327px] rounded-[5px] border border-dashed border-[#6E86C2] text-center">Customized</li>
        </ul>
        {
          connected
            ? (
                <>
                  <FormModal />
                  <p className="mt-[26px] text-center text-xs/5 font-medium text-[#6E86C2]">
                    Create a new legacy contract, deposit or withdraw at any time,
                    <br />
                    and it will automatically distrubite the balance to the beneficiaries
                    <br />
                    when the time you set arrived.
                  </p>
                  <MyLegacy />
                  <ActivityTable />
                </>
              )
            : <ConnectButton className="mx-auto mt-[120px] flex" />
        }
      </div>
    </div>
  )
}

export interface FormValues {
  startingTime: DateValue | null
  wallets: { address: string, percentage: number }[]
}

function FormModal() {
  const { control, handleSubmit: _handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      startingTime: null,
      wallets: [{ address: '', percentage: 0 }],
    },
  })
  const { fields, append, remove } = useFieldArray<FormValues>({ control, name: 'wallets' })
  const labelClasses = 'text-center w-44'

  const handleSubmit = (formValues: FormValues) => {
    // eslint-disable-next-line no-console
    console.log('%c [ formValues ]-76', 'font-size:13px; background:pink; color:#bf2c9f;', formValues)
    reset()
  }

  return (
    <Modal
      className="px-14 pb-6 pt-14"
      trigger={(
        <Button className="mx-auto mt-[120px] w-[248px]">
          <span className="icon-[ic--baseline-plus] text-base"></span>
          <span>Create A New Legacy Contract</span>
        </Button>
      )}
    >
      {
        ({ close }) => (
          <Form
            className="flex flex-col gap-5"
            onSubmit={_handleSubmit(handleSubmit)}
          >
            <Controller
              control={control}
              name="startingTime"
              render={({ field, fieldState }) => (
                <DatePicker
                  isRequired
                  validationBehavior="aria"
                  isInvalid={fieldState.invalid}
                  name={field.name}
                  isDisabled={field.disabled}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  labelClasses={labelClasses}
                  endAdditional={<span className="size-8" />}
                />
              )}
            />
            <hr className="border-t-2 border-[#7A86A5]/40" />
            {
              fields.map((field, index) => (
                <div key={field.id}>
                  <Controller
                    name={`wallets.${index}.address`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { disabled, ...restField }, fieldState }) => (
                      <TextField
                        {...restField}
                        isRequired
                        validationBehavior="aria"
                        isInvalid={fieldState.invalid}
                        labelClasses={labelClasses}
                        isDisabled={disabled}
                        autoComplete="off"
                        label={`Beneficiary Wallet${fields.length > 1 ? ` (${index + 1})` : ''}`}
                        placeholder="Please enter the address of the beneficiary wallet"
                        endAdditional={index === 0
                          ? <span className="size-8" />
                          : (
                              <AriaButton
                                aria-label="Delete"
                                className="flex size-8 items-center justify-center rounded-[5px] border border-[#7A86A5]/50 text-lg text-[#6E86C2]"
                                onPress={() => remove(index)}
                              >
                                <span aria-hidden className="icon-[uiw--delete]"></span>
                              </AriaButton>
                            )}
                      />
                    )}
                  />
                  <Controller
                    name={`wallets.${index}.percentage`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { disabled, ...restField }, fieldState }) => (
                      <NumberField
                        {...restField}
                        isRequired
                        validationBehavior="aria"
                        isInvalid={fieldState.invalid}
                        labelClasses={labelClasses}
                        className="mt-7"
                        label="Percentage"
                        isDisabled={disabled}
                        endAdditional={<span className="flex size-8 items-center justify-center">%</span>}
                      />
                    )}
                  />
                </div>
              ))
            }
            <Button
              variant="outline"
              className="mt-14 self-center px-2"
              onPress={() => append({ address: '', percentage: 0 })}
            >
              <span className="icon-[ic--baseline-plus] text-lg text-[#6E86C2]"></span>
              <span className="text-xs font-medium text-[#7A86A5]">Add Another Wallet</span>
            </Button>
            <div className="mt-6 flex w-full items-center justify-center gap-[88px] text-xs font-medium">
              <Button variant="dashed-outline" onPress={close} className="w-[168px]">Cancel</Button>
              <Button type="submit" className="w-[168px]">Confirm</Button>
            </div>
            <p className="mt-4 text-xs font-medium text-[#6E86C2]">
              Create a new legacy contract, deposit or withdraw at any time, and it will automatically distribute the balance
              to the beneficiaries when the time you set arrived.
            </p>
          </Form>
        )
      }
    </Modal>
  )
}

function MyLegacy() {
  const legacyBoxItemClasses = 'flex-[120px] flex flex-col gap-[18px]'

  return (
    <section>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <h2 className="font-bold text-[#525A70]">My Legacy</h2>
          <AriaButton aria-label="Show Details"><img src={SearchSvg} alt="Search" aria-hidden /></AriaButton>
        </div>
        <div className="flex gap-4">
          <Button className="w-[108px]">
            <img src={IncreaseSvg} alt="" aria-hidden />
            <span>Financing</span>
          </Button>
          <Button className="w-[108px]">
            <img src={ShieldSvg} alt="" aria-hidden />
            <span>Insure</span>
          </Button>
        </div>
      </div>
      <dl className="mt-7 flex items-center justify-between border-b border-[#6E86C2]/40 pb-[18px] text-center font-medium text-[#1A1A1A] [&_dd]:text-sm/6 [&_dt]:text-xs/6">
        <div className={legacyBoxItemClasses}>
          <dt>VALUE</dt>
          <dd>$ 5234</dd>
        </div>
        <div className={legacyBoxItemClasses}>
          <dt>WBTC</dt>
          <dd>5234</dd>
        </div>
        <div className={legacyBoxItemClasses}>
          <dt>WETH</dt>
          <dd>5234</dd>
        </div>
        <div className={legacyBoxItemClasses}>
          <dt>USDT</dt>
          <dd>5234</dd>
        </div>
        <div className={legacyBoxItemClasses}>
          <dt>USDC</dt>
          <dd>5234</dd>
        </div>
        <div className={legacyBoxItemClasses}>
          <dt aria-hidden>&nbsp;</dt>
          <dd className="flex gap-4">
            <Button size="small" className="w-[72px]">Deposit</Button>
            <Button size="small" variant="outline" className="w-[72px]">Withdraw</Button>
          </dd>
        </div>
      </dl>
    </section>
  )
}

function ActivityTable() {
  const thClasses = 'text-xs/6 font-semibold text-[#1A1A1A]/70'
  return (
    <section className="mt-[60px]">
      <h2 className="text-lg/10 font-bold text-[#525A70]">Activity</h2>
      <Table aria-label="Activity" selectionMode="none" className="mt-5 w-full text-center">
        <TableHeader className="h-10 border-b border-[#6E86C2]">
          <Column className={thClasses} isRowHeader>TIME</Column>
          <Column className={thClasses}>TYPE</Column>
          <Column className={thClasses}>TOKEN</Column>
          <Column className={thClasses}>AMOUNT</Column>
        </TableHeader>
        <TableBody>
          <Row className="h-[60px]">
            <Cell className="text-sm/6 font-medium text-[#1A1A1A]">2024-08-02 12:33</Cell>
            <Cell className="text-xs/5 font-medium text-[#7A86A5]">DEPOSIT</Cell>
            <Cell className="text-sm/6 font-semibold text-[#3255AC]">USDT</Cell>
            <Cell className="text-sm/6 font-medium text-[#1A1A1A]">10.56</Cell>
          </Row>
          <Row className="h-[60px] bg-[#7A86A5]/20">
            <Cell className="text-sm/6 font-medium text-[#1A1A1A]">2024-08-02 12:33</Cell>
            <Cell className="text-xs/5 font-medium text-[#7A86A5]">WITHDRAW</Cell>
            <Cell className="text-sm/6 font-semibold text-[#3255AC]">WETH</Cell>
            <Cell className="text-sm/6 font-medium text-[#1A1A1A]">10.56</Cell>
          </Row>
          <Row className="h-[60px]">
            <Cell className="text-sm/6 font-medium text-[#1A1A1A]">2024-08-02 12:33</Cell>
            <Cell className="text-xs/5 font-medium text-[#7A86A5]">DEPOSIT</Cell>
            <Cell className="text-sm/6 font-semibold text-[#3255AC]">USDT</Cell>
            <Cell className="text-sm/6 font-medium text-[#1A1A1A]">10.56</Cell>
          </Row>
          <Row className="h-[60px] bg-[#7A86A5]/20">
            <Cell className="text-sm/6 font-medium text-[#1A1A1A]">2024-08-02 12:33</Cell>
            <Cell className="text-xs/5 font-medium text-[#7A86A5]">WITHDRAW</Cell>
            <Cell className="text-sm/6 font-semibold text-[#3255AC]">WETH</Cell>
            <Cell className="text-sm/6 font-medium text-[#1A1A1A]">10.56</Cell>
          </Row>
        </TableBody>
      </Table>
    </section>
  )
}

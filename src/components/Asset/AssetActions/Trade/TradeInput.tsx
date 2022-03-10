import React, { ChangeEvent, ReactElement } from 'react'
import styles from './TradeInput.module.css'
import {
  Field,
  FieldInputProps,
  FormikContextType,
  useFormikContext
} from 'formik'
import Input from '@shared/FormInput'
import Button from '@shared/atoms/Button'
import { FormTradeData, TradeItem } from './_types'
import UserLiquidity from '../UserLiquidity'
import { useWeb3 } from '@context/Web3'

export default function TradeInput({
  name,
  item,
  disabled,
  handleValueChange
}: {
  name: string
  item: TradeItem
  disabled: boolean
  handleValueChange: (name: string, value: number) => void
}): ReactElement {
  const { accountId } = useWeb3()

  // Connect with form
  const {
    handleChange,
    validateForm,
    values
  }: FormikContextType<FormTradeData> = useFormikContext()

  const isTopField =
    (name === 'baseToken' && values.type === 'buy') ||
    (name === 'datatoken' && values.type === 'sell')
  const titleAvailable = isTopField ? `Balance` : `Available from pool`
  const titleMaximum = isTopField ? `Maximum to spend` : `Maximum to receive`
  const decimalPattern = new RegExp('/^[0-9.]+$/')

  return (
    <section className={styles.tradeInput}>
      <UserLiquidity
        amount={`${item?.amount}`}
        amountMax={`${item?.maxAmount}`}
        symbol={item?.token}
        titleAvailable={titleAvailable}
        titleMaximum={titleMaximum}
      />

      <Field name={name}>
        {({
          field,
          form
        }: {
          field: FieldInputProps<FormTradeData>
          form: any
        }) => (
          <Input
            type="text"
            name={name}
            max={`${item?.maxAmount}`}
            min="0"
            step="0.1"
            pattern="/^[0-9.]+$/"
            prefix={item?.token}
            placeholder="0"
            field={field}
            form={form}
            value={`${field.value}`}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              console.log(
                'E TARGET VALUE',
                parseFloat(e.target.value),
                decimalPattern.test(e.target.value)
              )
              // if (
              //   e.target.value === '' ||
              //   decimalPattern.test(e.target.value)
              // ) {
              //   console.log(
              //     e.target.value === '' || decimalPattern.test(e.target.value)
              //   )
              handleValueChange(name, parseFloat(e.target.value))
              // }
              validateForm()
              handleChange(e)
            }}
            disabled={!accountId || disabled}
          />
        )}
      </Field>

      {/* {!isTopField && (
        <Button
          className={styles.buttonMax}
          disabled={disabled}
          style="text"
          size="small"
          onClick={() => {
            setFieldValue(name, item?.maxAmount)
            handleValueChange(name, Number(item?.maxAmount))
          }}
        >
          Use Max
        </Button>
      )} */}
    </section>
  )
}

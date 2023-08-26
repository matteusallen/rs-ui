// @flow
import React, { useState, useEffect, useCallback } from 'react';
import { capitalize, Grid } from '@material-ui/core';
import styled from 'styled-components';
import { Formik, Field, Form } from 'formik';
import Modal from '../../../../components/Modal';
import Button from '../../../../components/Button';
import { FormikField, FormikMoneyField } from '../../../../components/Fields';
import { displayFlex } from '../../../../styles/Mixins';
import colors from '../../../../styles/Colors';
import OrderRefund from '../../../../mutations/OrderRefund';
import { getRefundableAmount } from '../../../../helpers';
import type { OrderType } from 'src/queries/Admin/OrderForOrderTableDetail.js';
import type { RefundInputType } from '../../../../mutations/OrderRefund';
import { subRouteCodes as SUB_ROUTES } from 'Constants/routes';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '../../../Event/Shared/Radio';
import { Notice, Error } from '../../../../components/Alerts';
import moment from 'moment';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Collapse from '@material-ui/core/Collapse';
import { ORDER_FOR_ORDER_HISTORY_DETAILS } from '../../../../queries/Admin/OrderForOrderHistoryDetails';
import { useLazyQuery } from '@apollo/react-hooks';
import IndeterminateLoading from 'Components/Loading/IndeterminateLoading';
import { getProdType, getDateDiff, getSortedItemsArr } from './orderHistoryHelpers';
import { getPricePerOrderItem } from '../../../../components/PrintReceipt/receiptHelpers';

export type PaymentType = {|
  adminId: number | string,
  amount: number,
  cardBrand: string,
  cardPayment: boolean,
  createdAt: Date,
  id: number | string,
  last4: string,
  notes: string,
  orderId: number,
  ssChargeId: string,
  ssRefundId: ?string,
  success: boolean
|};

type RefundModalBasePropsType = {|
  className?: string,
  history: {|
    push: string => void
  |},
  onClose: () => void,
  open: boolean,
  order: OrderType,
  specialRefund: boolean,
  orderRefund: (input: RefundInputType) => void,
  cancelWithRefund: boolean,
  handleCancelReservation?: ({}) => void,
  currentCharges?: number,
  handleSubmit?: (paymentDetails: {}, refundPayment: boolean, isGroupOrder: boolean, noRefund: {}) => void
|};

export const RefundModalBase = (props: RefundModalBasePropsType) => {
  const {
    className = '',
    onClose,
    open,
    order = {},
    orderRefund,
    cancelWithRefund,
    handleCancelReservation,
    history,
    specialRefund,
    currentCharges = 0,
    handleSubmit,
    priceAdjustments
  } = props;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [cardStep, setCardStep] = useState(false);
  const { payments = [], id, fee, platformFee } = order;
  const payment = payments.find(payment => payment.amount > 0) || {};
  const uniquePayments = {};
  const uniqueRefunds = {};
  let cashPayments = [],
    cashPaymentsWithFees = [];
  const cashRefunds = [];
  for (let record of payments) {
    if (+record.amount > 0 && record.cardPayment) {
      uniquePayments[`${record.ssChargeId}`] = {
        ...record
      };
    } else if (!record.cardPayment) {
      record.amount > 0 ? cashPayments.push(record) : cashRefunds.push(record);
    } else {
      uniqueRefunds[`${record.ssChargeId}`] = uniqueRefunds[`${record.ssChargeId}`] ? uniqueRefunds[`${record.ssChargeId}`] + record.amount : record.amount;
    }
  }

  for (const key in uniquePayments) {
    //refund adjustments
    uniquePayments[key].amount = uniqueRefunds[key] ? uniqueRefunds[key] + uniquePayments[key].amount : uniquePayments[key].amount;
  }

  let totalCashlRefundAmount = 0,
    totalCashPaymentAmount = 0,
    totalCashFees = 0;
  if (cashRefunds.length) {
    for (let cRefund of cashRefunds) {
      //cash adjustments
      totalCashlRefundAmount += Math.abs(+cRefund.amount);
    }
  }
  if (cashPayments.length) {
    for (let cPayment of cashPayments) {
      totalCashPaymentAmount += +cPayment.amount;
      totalCashFees += cPayment.serviceFee;
    }
  }

  const refundAmountPlusFees = totalCashPaymentAmount - totalCashlRefundAmount;

  if (cashPayments.length) {
    cashPaymentsWithFees = [
      {
        ...cashPayments[0],
        amount: refundAmountPlusFees
      }
    ];
  }

  let uniquePaymentsArray = [...Object.values(uniquePayments), ...cashPaymentsWithFees];
  const totalPaidMinusRefunds = Math.abs(
    Number(uniquePaymentsArray.reduce((acc, curr) => (curr.amount > 0 ? (acc += curr.amount) : (acc = curr.amount + acc)), 0))
  );
  const totalPaidMinusFees =
    +totalPaidMinusRefunds.toFixed(2) > 0 ? +totalPaidMinusRefunds.toFixed(2) - +fee?.toFixed(2) - +platformFee?.toFixed(2) : +totalPaidMinusRefunds.toFixed(2);
  const currentChargesString = currentCharges < 0 ? `$${Math.abs(currentCharges)?.toFixed(2)}` : `$${currentCharges?.toFixed(2)}`;
  const [checked, setChecked] = useState(false);
  const [refundCardInformation, setRefundCardInformation] = useState(
    uniquePaymentsArray
      .map(paid => {
        return {
          paid: +paid.amount.toFixed(2),
          amount: 0,
          cardBrand: paid.cardBrand,
          cardPayment: paid.cardPayment,
          last4: paid.last4,
          orderId: Number(id),
          ssChargeId: paid.ssChargeId || moment(paid.createdAt).unix(),
          createdAt: paid.createdAt
        };
      })
      .sort((a, b) => moment(b.createdAt) - moment(a.createdAt))
  );
  const initialChargeAmounts = {};
  refundCardInformation.forEach(charge => {
    return (initialChargeAmounts[charge.ssChargeId] = `${charge.amount}.00`);
  });

  const totalPaidMinusFeesArray = uniquePaymentsArray.map(record => {
    if (!record.cardPayment) {
      const value = +record.amount > 0 ? +record.amount - totalCashFees : 0;
      return { ...record, amount: value };
    } else {
      const value =
        +record?.amount?.toFixed(2) > 0
          ? +record?.amount?.toFixed(2) - +record.stripeFee?.toFixed(2) - +record.serviceFee?.toFixed(2)
          : +totalPaidMinusRefunds?.toFixed(2);
      return { ...record, amount: value };
    }
  });

  const formatPrice = price => {
    if (price < 0) return `-$${Math.abs(price).toFixed(2)}`;
    return `$${price.toFixed(2)}`;
  };

  const refundableAmount = () => {
    if (specialRefund || cancelWithRefund) return getRefundableAmount(payments || []);
    if (totalPaidMinusFees < 0) return 0;
    if (Math.abs(currentCharges) > totalPaidMinusFees) return totalPaidMinusFees;
    else return Math.abs(currentCharges);
  };

  const getRefundTotal = refundCardInformation.reduce((acc, obj) => {
    return acc + obj.amount;
  }, 0);

  const updatedRefundableAmount = Number(refundableAmount().toFixed(2)) - Number(getRefundTotal.toFixed(2));

  const updateTotals = (amount = 0, chargeId) => {
    setRefundCardInformation(prevState =>
      prevState.map(obj => {
        if (obj.ssChargeId === chargeId) {
          return { ...obj, amount: amount };
        }
        return obj;
      })
    );
  };

  const doRefund = async (refundInfo: array) => {
    const result = await orderRefund(refundInfo);

    if (result && !result.data.refund.error) {
      onClose();
      history.push(SUB_ROUTES.ADMIN.ORDERS);
      return;
    }
  };

  const validateAmount = (refundAmount: string, amount: string) => () => {
    if (!refundAmount) {
      return 'REFUND AMOUNT IS REQUIRED';
    }
    if (isNaN(Number(refundAmount))) {
      return 'INVALID NUMBER';
    }
    if (Number(refundAmount) < 0) {
      return 'NUMBER CANNOT BE NEGATIVE';
    }
    if (Number(Math.abs(amount).toFixed(2)) < Number(refundAmount)) {
      return `CANNOT REFUND MORE THAN $${amount.toFixed(2)}`;
    }
    if (Number(Math.abs(refundableAmount()).toFixed(2)) < Number(refundAmount)) {
      return `CANNOT REFUND MORE THAN $${refundableAmount().toFixed(2)}`;
    }
  };

  const validateReason = (refundReason: string) => {
    if (!refundReason?.trim()) {
      return 'REFUND REASON IS REQUIRED';
    }
    if (refundReason?.length < 3) {
      return 'DESCRIPTION IS TOO SHORT';
    }
    if (refundReason?.length > 240) {
      return 'DESCRIPTION IS TOO LONG';
    }
  };

  if (!payment) {
    return null;
  }

  const [getOrderByIdCallback, { data, loading }] = useLazyQuery<OrderReturnType>(ORDER_FOR_ORDER_HISTORY_DETAILS, {
    fetchPolicy: 'network-only'
  });
  const [, itemsByPaymentObject] = getSortedItemsArr(data, order.event);

  const loadOrder = useCallback(() => {
    if (order?.id) {
      getOrderByIdCallback({ variables: { id: order?.id } });
    }
  }, [order]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder, open]);

  const getHistoryPayment = chargeID => {
    let payment = uniquePaymentsArray.find(pay => {
      return pay.ssChargeId === chargeID || moment(pay.createdAt).unix() === chargeID;
    });
    return {
      amount: payment?.amount - (payment?.serviceFee + payment?.stripeFee),
      amountWithFees: payment?.amount,
      fees: payment?.serviceFee + payment?.stripeFee
    };
  };

  const paymentHistory = chargeID => {
    return Object.values(itemsByPaymentObject)
      .flat(1)
      .filter(history => {
        if (history.payments.length > 0) {
          return history.payments.every(p => p.ssChargeId === chargeID) || history.payments.some(p => p.amount > 0 && !p.cardPayment);
        }
      });
  };

  const getPrice = item => {
    const price =
      item.productType === 'specialRefund' ? formatPrice(item?.payments[0]?.amount ?? 0) : getPricePerOrderItem(order.orderItems, item, order.event);

    return price;
  };

  const getLabel = (item, plural) => {
    if (item.productType === 'orderCancellation') {
      return <></>;
    }
    if (item.productType === 'specialRefund') {
      return <>Special Refund</>;
    }
    return (
      <>
        Removed {item.prevQuantity - item.quantity || item.prevQuantity || null}{' '}
        {getProdType(item.productType, item.productName, item.prevQuantity - item.quantity)}
        {item.startDate || item.endDate
          ? ` x ${getDateDiff(item.startDate, item.endDate)
              .toString()
              .replace('-', '')} night${plural}`
          : null}
      </>
    );
  };

  if (loading) {
    return <IndeterminateLoading />;
  }

  return (
    <Modal heading={'Refund'} open={open} className={`${className}__refund-modal`}>
      {(!payment.cardPayment && !cancelWithRefund) ||
        (!payment.cardPayment && !uniquePayments.length && cashPayments.length && <Notice label="This refund needs to be issued by cash or check" />)}
      {!!currentCharges && Math.abs(currentCharges) > refundableAmount() && <Notice label="Total edits exceed transaction total" />}
      <Formik
        className={className}
        onSubmit={async ({ refundAmount, refundReason, picked, refundFees }) => {
          setLoading(true);
          let arr = refundFees === 'fees' ? uniquePaymentsArray : totalPaidMinusFeesArray;
          //for cancel with multiple refunds
          const refundInformation = arr.map(paid => {
            return {
              amount: +paid.amount.toFixed(2),
              cardBrand: paid.cardBrand,
              cardPayment: paid.cardPayment,
              last4: paid.last4,
              orderId: Number(id),
              ssChargeId: paid.ssChargeId,
              notes: picked === 'refund' ? refundReason : null
            };
          });

          //for refunds when order changes e.g qty changes, date change, product change
          const singleRefund = [
            {
              amount: +refundAmount,
              cardBrand: payment.cardBrand,
              cardPayment: payment.cardPayment,
              last4: payment.last4,
              orderId: Number(id),
              ssChargeId: payment.ssChargeId,
              notes: picked === 'refund' ? refundReason : null
            }
          ];

          const refundInfo = await refundCardInformation
            .filter(card => card.amount >= 1) // eslint-disable-next-line no-unused-vars
            .map(({ paid, createdAt, ...rest }) => {
              rest['notes'] = picked === 'refund' || specialRefund ? refundReason : null;
              if (!rest.cardPayment) rest.ssChargeId = null;
              return rest;
            });

          const noRefund = {
            notes: picked === 'norefund' ? refundReason : null,
            amount: +refundAmount
          };
          if (cancelWithRefund) {
            handleCancelReservation && (await handleCancelReservation(refundInformation));
          } else if (specialRefund) {
            doRefund(refundInfo);
          } else {
            handleSubmit &&
              (await handleSubmit(
                // eslint-disable-next-line
                cardStep ? refundInfo : singleRefund,
                refundAmount > 0 && picked === 'refund',
                false,
                noRefund
              ));
          }
          onClose();
          setLoading(false);
        }}
        initialValues={{
          refundAmount:
            specialRefund && !cancelWithRefund
              ? ''
              : currentCharges && Math.abs(currentCharges) <= refundableAmount()
              ? Math.abs(currentCharges).toFixed(2)
              : totalPaidMinusFees < 0
              ? (0).toFixed(2)
              : totalPaidMinusFees.toFixed(2),
          refundReason: '',
          paymentOption: 'card' || 'cash',
          picked: !!currentCharges && Math.abs(currentCharges) > refundableAmount() ? 'norefund' : 'refund',
          refundFees: 'no-fees',
          refundCardTotal: getRefundTotal,
          specialChargeId: '',
          ...initialChargeAmounts
        }}>
        {({ dirty, isValid, values, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              {specialRefund && !cancelWithRefund && (
                <Grid item xs={12} className={`${className}__original-payment-method`}>
                  {refundCardInformation.some(refund => !refund.cardPayment) && (
                    <Notice hideIcon={true} label="Part of this refund needs to be issued by cash or check" />
                  )}
                  <p>
                    <strong>Please enter the refund amount in the transaction you would like to refund</strong>
                  </p>
                  {refundableAmount() < getRefundTotal && <Error label="Refund can not exceed the remaining total" />}
                  <div className={`${className}__itemized-container ${className}__transaction-header`}>
                    <div>
                      <strong>Transactions</strong>
                    </div>
                    <div>
                      <strong>Refund total</strong>
                    </div>
                  </div>
                  <div>
                    {refundCardInformation.map((p, idx) => {
                      let revealKey = p.ssChargeId + idx;
                      return (
                        <Grid item xs={12} key={p.index} className={`${className}__payment-card-info-wrapper`}>
                          <div className={`${className}__payment-wrapper`}>
                            <div
                              className={`${className}__itemized-container ${className}__payment-list`}
                              onClick={() => setChecked(prevState => (prevState !== false ? false : revealKey))}>
                              ${p.paid.toFixed(2)} Payment with {p.cardBrand ? p.cardBrand : 'Cash'} ON{' '}
                              {`${moment(p.createdAt).format('MM/DD/YY')} at ${moment(p.createdAt).format('hh:mm a')}`}{' '}
                              {checked === revealKey ? (
                                <ArrowDropUpIcon className={`${className}__payment-details-icon`} />
                              ) : (
                                <ArrowDropDownIcon className={`${className}__payment-details-icon`} />
                              )}
                            </div>
                            <Collapse in={checked === revealKey}>
                              <div className={`${className}__history-details-notes-container ${className}__history-details-wrapper`}>
                                {uniqueRefunds[p.ssChargeId] ? (
                                  <Grid container className={`${className}__fees-wrapper`}>
                                    <Grid item md={10}>
                                      <strong>Refunded to date</strong>
                                    </Grid>
                                    <Grid className={`${className}__payment-fees`} item md={2}>
                                      <strong>-${Math.abs(uniqueRefunds[p.ssChargeId]).toFixed(2)}</strong>
                                    </Grid>
                                  </Grid>
                                ) : totalCashlRefundAmount > 0 ? (
                                  <Grid container className={`${className}__fees-wrapper`}>
                                    <Grid item md={10}>
                                      <strong>Refunded to date</strong>
                                    </Grid>
                                    <Grid className={`${className}__payment-fees`} item md={2}>
                                      <strong>-${totalCashlRefundAmount.toFixed(2)}</strong>
                                    </Grid>
                                  </Grid>
                                ) : null}
                                {paymentHistory(p.ssChargeId)?.map(item => {
                                  const dateDiff = item.startDate ? getDateDiff(item.startDate, item.endDate) : null;
                                  const isDateChange = item.prevEndDate > item.endDate || item.startDate > item.prevStartDate;
                                  const startDateDiff = getDateDiff(item.startDate, item.prevStartDate) || 0;
                                  const endDateDiff = getDateDiff(item.prevEndDate, item.endDate) || 0;
                                  const totalDateDiff = startDateDiff + endDateDiff;
                                  const dateReduction = isDateChange ? totalDateDiff : false;
                                  const plural =
                                    dateReduction && Math.abs(dateReduction) > 1 ? 's' : dateDiff && !dateReduction && Math.abs(dateDiff) > 1 ? 's' : '';
                                  return (
                                    <Grid container className={`${className}__history-details-bloc-wrapper`}>
                                      <Grid item md={5} className={`${className}__history-details-bloc`}>
                                        {item.productType === 'specialRefund' ||
                                        ((item.quantity === 0 || !!item.prevQuantity) && !item.prevProductId && item.quantity < item.prevQuantity) ? (
                                          getLabel(item, plural)
                                        ) : (item.prevProductId && item.remove) || item.remove ? (
                                          <>
                                            {`Removed ${item.prevQuantity || item.quantity} ${getProdType(
                                              item.productType,
                                              item.productName,
                                              item.prevQuantity || item.quantity
                                            )} x ${getDateDiff(item.prevStartDate || item.startDate, item.prevEndDate || item.endDate)
                                              .toString()
                                              .replace('-', '')} night${plural}`}
                                          </>
                                        ) : (
                                          <>
                                            {!item.remove && item.prevProductId ? 'Added ' : isDateChange ? 'Reduced ' : 'Added '}
                                            {item.quantity} {getProdType(item.productType, item.productName, item.quantity)}{' '}
                                            {item.productType !== 'addOns'
                                              ? `x ${dateReduction ||
                                                  getDateDiff(item.startDate, item.endDate)
                                                    .toString()
                                                    .replace('-', '')} night${plural}`
                                              : null}
                                          </>
                                        )}
                                      </Grid>
                                      <Grid item md={5} className={`${className}__history-details-bloc ${className}__history-details-productType`}>
                                        <span>{item.productType !== 'addOns' ? item.productName : null}</span>
                                      </Grid>
                                      <Grid item md={2} className={`${className}__history-details-bloc ${className}__history-details-amount`}>
                                        {getPrice(item)}
                                      </Grid>
                                    </Grid>
                                  );
                                })}
                              </div>
                              <Grid container className={`${className}__fees-wrapper`}>
                                <Grid item md={10}>
                                  Fees
                                </Grid>
                                <Grid className={`${className}__payment-fees`} item md={2}>
                                  ${getHistoryPayment(p.ssChargeId).fees.toFixed(2)}
                                </Grid>
                              </Grid>
                            </Collapse>
                          </div>
                          {getHistoryPayment(p.ssChargeId).amountWithFees > 0 && (
                            <Field
                              data-testid={`refund-card-amount-${p.ssChargeId}`}
                              name={p.ssChargeId}
                              validate={validateAmount(values[p.ssChargeId], p.paid)}
                              render={({ field, meta }) => (
                                <FormikMoneyField
                                  {...field}
                                  {...meta}
                                  data-testid="refund-amount-money-field"
                                  error={meta.touched && meta.error}
                                  helperText={meta.touched && !!meta.error && meta.error}
                                  variant="filled"
                                  onChange={e => {
                                    setFieldValue(
                                      e.target.name,
                                      e.target.value
                                        .replace(/\$/g, '')
                                        .replace(/\s/g, '')
                                        .replace(/,/g, '')
                                    );
                                    updateTotals(Number(e.target.value.replace(/[^\d.]/g, '')), p.ssChargeId);
                                  }}
                                  className={`${className}__field-card`}
                                />
                              )}
                            />
                          )}
                        </Grid>
                      );
                    })}
                  </div>
                </Grid>
              )}
              {cancelWithRefund && (
                <Grid
                  style={{
                    width: '100%'
                  }}
                  item
                  xs={12}
                  className={`${className}__refund-options`}
                  role="group">
                  {uniquePaymentsArray.some(refund => !refund.cardPayment && !uniquePaymentsArray.every(refund => !refund.cardPayment)) && (
                    <Notice hideIcon={true} label="Part of this refund needs to be issued by cash or check" />
                  )}
                  <Field
                    fullWidth
                    type="radio"
                    name="refundFees"
                    component={RadioGroup}
                    value={values.refundFees}
                    onChange={e => {
                      setFieldValue('refundFees', e.target.value);
                      setFieldValue('refundAmount', e.target.value === 'fees' ? totalPaidMinusRefunds.toFixed(2) : totalPaidMinusFees.toFixed(2));
                    }}>
                    <FormControlLabel
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        margin: 0
                      }}
                      value="no-fees"
                      control={<Radio />}
                      labelPlacement={'end'}
                      label={
                        <p
                          style={{
                            margin: '.5rem 0',
                            display: 'flex'
                          }}>
                          <span>Refund without fees to:</span>
                          <ul className={`${className}__card-lists`}>
                            {totalPaidMinusFeesArray.map(p =>
                              p.amount && p.amount > 0 ? (
                                <li>
                                  <span
                                    style={{
                                      fontWeight: 500
                                    }}>
                                    {p.cardPayment ? `${capitalize(p.cardBrand)}-${p.last4}` : 'Cash/Check'}:{' '}
                                  </span>
                                  <strong>${p.amount.toFixed(2)}</strong>
                                </li>
                              ) : null
                            )}
                          </ul>
                        </p>
                      }
                      disabled={!!currentCharges && Math.abs(currentCharges) > refundableAmount()}
                    />
                    <FormControlLabel
                      style={{
                        display: 'flex',
                        margin: 0,
                        alignItems: 'flex-start'
                      }}
                      value="fees"
                      control={<Radio />}
                      label={
                        <p
                          style={{
                            display: 'flex',
                            margin: '.5rem 0'
                          }}>
                          <span>Refund including fees to:</span>
                          <ul className={`${className}__card-lists`}>
                            {uniquePaymentsArray.map(p =>
                              p.amount ? (
                                <li
                                  style={{
                                    fontWeight: 500
                                  }}>
                                  {p.cardPayment ? `${capitalize(p.cardBrand)}-${p.last4}` : 'Cash/Check'}: <strong>${p.amount.toFixed(2)}</strong>
                                </li>
                              ) : null
                            )}
                          </ul>
                        </p>
                      }
                    />
                  </Field>
                </Grid>
              )}
              {!specialRefund && !cancelWithRefund && (
                <Grid item xs={12} className={`${className}__refund-options`} role="group">
                  {refundCardInformation.some(refund => !refund.cardPayment) && (
                    <Notice hideIcon={true} label="Part of this refund needs to be issued by cash or check" />
                  )}
                  {cardStep && values.paymentOption === 'card' ? (
                    <>
                      <p>
                        <strong>Please enter the refund amount in the transaction you would like to refund</strong>
                      </p>
                      <div className={`${className}__price-adjustments`}>
                        {priceAdjustments?.map((change, i) => {
                          return (
                            <div key={`price-change-${i}`} className={`${className}__itemized-container ${className}__price-adjustments`}>
                              <div className="item-change">{change[0]}</div>
                              <div>{formatPrice(change[1])}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div className={`${className}__itemized-container`}>
                        <div className={`${className}__updated-refund`}>Left to refund</div>
                        <div>${updatedRefundableAmount.toFixed(2)}</div>
                      </div>
                      {refundableAmount() < getRefundTotal && <Error label="Refund can not exceed the remaining total" />}
                      <div className={`${className}__itemized-container ${className}__transaction-header`}>
                        <div>
                          <strong>Transactions</strong>
                        </div>
                        <div>
                          <strong>Refund total</strong>
                        </div>
                      </div>
                      <div>
                        {refundCardInformation.map((p, idx) => {
                          let revealKey = p.ssChargeId + idx;
                          return (
                            <Grid item xs={12} key={p.index} className={`${className}__payment-card-info-wrapper`}>
                              <div className={`${className}__payment-wrapper`}>
                                <div
                                  className={`${className}__itemized-container ${className}__payment-list`}
                                  onClick={() => setChecked(prevState => (prevState !== false ? false : revealKey))}>
                                  ${p.paid.toFixed(2)} Payment with {p.cardBrand ? p.cardBrand : 'Cash'} ON{' '}
                                  {`${moment(p.createdAt).format('MM/DD/YY')} at ${moment(p.createdAt).format('hh:mm a')}`}{' '}
                                  {checked === revealKey ? (
                                    <ArrowDropUpIcon className={`${className}__payment-details-icon`} />
                                  ) : (
                                    <ArrowDropDownIcon className={`${className}__payment-details-icon`} />
                                  )}
                                </div>
                                <Collapse in={checked === revealKey}>
                                  <div className={`${className}__history-details-notes-container ${className}__history-details-wrapper`}>
                                    {uniqueRefunds[p.ssChargeId] ? (
                                      <Grid container className={`${className}__fees-wrapper`}>
                                        <Grid item md={10}>
                                          <strong>Refunded to date</strong>
                                        </Grid>
                                        <Grid className={`${className}__payment-fees`} item md={2}>
                                          <strong>-${Math.abs(uniqueRefunds[p.ssChargeId]).toFixed(2)}</strong>
                                        </Grid>
                                      </Grid>
                                    ) : totalCashlRefundAmount > 0 ? (
                                      <Grid container className={`${className}__fees-wrapper`}>
                                        <Grid item md={10}>
                                          <strong>Refunded to date</strong>
                                        </Grid>
                                        <Grid className={`${className}__payment-fees`} item md={2}>
                                          <strong>-${totalCashlRefundAmount.toFixed(2)}</strong>
                                        </Grid>
                                      </Grid>
                                    ) : null}
                                    {paymentHistory(p.ssChargeId)?.map(item => {
                                      const dateDiff = item.startDate ? getDateDiff(item.startDate, item.endDate) : null;
                                      const isDateChange = item.prevEndDate > item.endDate || item.startDate > item.prevStartDate;
                                      const startDateDiff = getDateDiff(item.startDate, item.prevStartDate) || 0;
                                      const endDateDiff = getDateDiff(item.prevEndDate, item.endDate) || 0;
                                      const totalDateDiff = startDateDiff + endDateDiff;
                                      const dateReduction = isDateChange ? totalDateDiff : false;
                                      const plural =
                                        dateReduction && Math.abs(dateReduction) > 1 ? 's' : dateDiff && !dateReduction && Math.abs(dateDiff) > 1 ? 's' : '';
                                      return (
                                        <Grid container className={`${className}__history-details-bloc-wrapper`}>
                                          <Grid item md={5} className={`${className}__history-details-bloc`}>
                                            {item.productType === 'specialRefund' ||
                                            ((item.quantity === 0 || !!item.prevQuantity) && !item.prevProductId && item.quantity < item.prevQuantity) ? (
                                              getLabel(item, plural)
                                            ) : (item.prevProductId && item.remove) || item.remove ? (
                                              <>
                                                {`Removed ${item.prevQuantity || item.quantity} ${getProdType(
                                                  item.productType,
                                                  item.productName,
                                                  item.prevQuantity || item.quantity
                                                )} x ${getDateDiff(item.prevStartDate || item.startDate, item.prevEndDate || item.endDate)
                                                  .toString()
                                                  .replace('-', '')} night${plural}`}
                                              </>
                                            ) : (
                                              <>
                                                {!item.remove && item.prevProductId ? 'Added ' : isDateChange ? 'Reduced ' : 'Added '}
                                                {item.quantity} {getProdType(item.productType, item.productName, item.quantity)}{' '}
                                                {item.productType !== 'addOns'
                                                  ? `x ${dateReduction ||
                                                      getDateDiff(item.startDate, item.endDate)
                                                        .toString()
                                                        .replace('-', '')} night${plural}`
                                                  : null}
                                              </>
                                            )}
                                          </Grid>
                                          <Grid item md={5} className={`${className}__history-details-bloc ${className}__history-details-productType`}>
                                            <span>{item.productType !== 'addOns' ? item.productName : null}</span>
                                          </Grid>
                                          <Grid item md={2} className={`${className}__history-details-bloc ${className}__history-details-amount`}>
                                            {getPrice(item)}
                                          </Grid>
                                        </Grid>
                                      );
                                    })}
                                  </div>
                                  <Grid container className={`${className}__fees-wrapper`}>
                                    <Grid item md={10}>
                                      Fees (not refundable)
                                    </Grid>
                                    <Grid className={`${className}__payment-fees`} item md={2}>
                                      ${getHistoryPayment(p.ssChargeId).fees.toFixed(2)}
                                    </Grid>
                                  </Grid>
                                </Collapse>
                              </div>
                              {getHistoryPayment(p.ssChargeId).amount >= 1 && (
                                <Field
                                  data-testid={`refund-card-amount-${p.ssChargeId}`}
                                  name={p.ssChargeId}
                                  validate={validateAmount(values[p.ssChargeId], getHistoryPayment(p.ssChargeId).amount)}
                                  render={({ field, meta }) => (
                                    <FormikMoneyField
                                      {...field}
                                      {...meta}
                                      data-testid="refund-amount-money-field"
                                      error={meta.touched && meta.error}
                                      helperText={meta.touched && !!meta.error && meta.error}
                                      variant="filled"
                                      onChange={e => {
                                        setFieldValue(
                                          `${e.target.name}`,
                                          e.target.value
                                            .replace(/\$/g, '')
                                            .replace(/\s/g, '')
                                            .replace(/,/g, '')
                                        );
                                        updateTotals(Number(e.target.value.replace(/[^\d.]/g, '')), p.ssChargeId);
                                      }}
                                      className={`${className}__field-card`}
                                    />
                                  )}
                                />
                              )}
                            </Grid>
                          );
                        })}
                      </div>
                      <div className={`${className}__itemized-container ${className}__refund-total`}>
                        <div>Refund total</div>
                        <div>${getRefundTotal.toFixed(2)}</div>
                      </div>
                    </>
                  ) : (
                    <Field type="radio" name="picked" component={RadioGroup} value={values.picked} row onChange={e => setFieldValue('picked', e.target.value)}>
                      <FormControlLabel
                        value="refund"
                        control={<Radio />}
                        label={
                          <span>
                            Refund: <strong>{currentChargesString}</strong>
                          </span>
                        }
                        disabled={!!currentCharges && Math.abs(currentCharges) > refundableAmount()}
                      />
                      <FormControlLabel value="norefund" control={<Radio />} label="No Refund" />
                    </Field>
                  )}
                </Grid>
              )}

              <Grid item xs={12} className={`${className}__refund-field-row`}>
                {((uniquePaymentsArray.length <= 1 && values.picked === 'refund') || specialRefund || cardStep || values.picked === 'norefund') && (
                  <Field
                    data-testid="return-reason-field"
                    label={values.picked === 'refund' ? 'REASON FOR REFUND' : 'NOTES'}
                    multiline
                    maxLength="255"
                    type="text"
                    name="refundReason"
                    variant="filled"
                    component={FormikField}
                    value={values.refundReason}
                    onChange={e => setFieldValue('refundReason', e.target.value)}
                    validate={() => validateReason(values.refundReason)}
                  />
                )}
              </Grid>
              <Grid item xs={12} className={`${className}__refund-actions`}>
                <FlexButtonWrapper>
                  <FormButton
                    data-testid="refund-cancel"
                    secondary
                    variant="contained"
                    size="large"
                    onClick={() => {
                      onClose(), setCardStep(false);
                    }}>
                    GO BACK
                  </FormButton>
                  {!cardStep && values.picked !== 'norefund' && uniquePaymentsArray.length > 1 && !specialRefund ? (
                    <FormButton
                      data-testid="refund-display-card-options"
                      primary
                      className={`${className}__refund-button`}
                      variant="contained"
                      size="large"
                      onClick={() => setCardStep(true)}
                      type="button">
                      REFUND
                    </FormButton>
                  ) : (
                    <FormButton
                      data-testid="refund-confirm"
                      primary
                      className={`${className}__refund-button`}
                      variant="contained"
                      size="large"
                      type="submit"
                      disabled={
                        isLoading ||
                        !dirty ||
                        !isValid ||
                        refundableAmount() < getRefundTotal ||
                        !values.refundReason ||
                        (specialRefund && getRefundTotal <= 0 && !cancelWithRefund) ||
                        (cardStep && updatedRefundableAmount > 0)
                      }>
                      {values.picked === 'norefund' ? 'NO REFUND' : cancelWithRefund ? 'NEXT' : 'REFUND'}
                    </FormButton>
                  )}
                </FlexButtonWrapper>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const RefundModal = styled(RefundModalBase)`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  justify-content: space-around;
  font-family: 'IBM Plex Sans';

  &__card-lists {
    margin: 0px 5px;
    padding: 0;
    font-weight: bold;
    list-style: none;
    flex: none;
    order: 0;
    flex-grow: 0;
  }

  &__field {
    margin: 10px 0 !important;
  }
  &__refund-modal {
    & {
      div[class^='MuiCard-root'],
      div[class*='MuiCard-root'] {
        max-width: 734px;
        font-size: 16px;
      }
      .MuiPaper-root.MuiCard-root {
        h4 {
          margin-top: 0;
          margin-bottom: 5px;
        }
      }
    }
  }

  &__no-fees-text {
    font-size: 12px;
  }
  &__original-payment-method.MuiGrid-item.MuiGrid-grid-xs-12 {
    padding: 20px 8px 0;
    p {
      margin: 0;
      margin-top: 5px;
      padding: 0;
      &:last-child {
        margin-top: 20px;
      }
    }
  }
  &__refund-actions.MuiGrid-item.MuiGrid-grid-xs-12 {
    padding: 20px 8px 10px;
  }
  &__refund-field-row.MuiGrid-item.MuiGrid-grid-xs-12 {
    padding: 0 8px;
    a {
      color: ${colors.secondary};
      text-decoration: underline;
      &:hover {
        cursor: pointer;
      }
    }
    .MuiTextField-root {
      &:last-child {
        margin: 10px 0 0;
      }
    }
  }
  &__refund-method {
    margin-bottom: 0;
  }
  &__refund-button {
    padding: 8px 16px !important;
  }
  &__payment-card-info-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
  }
  &__itemized-container {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
  }
  &__price-adjustments {
    border-top: 0.5px solid #c8d6e5;
    border-bottom: 0.5px solid #c8d6e5;
  }
  &__transaction-header {
    padding: 10px;
    background: #f2f4f7;
    border-top: 0.5px solid #c8d6e5;
    border-bottom: 0.5px solid #c8d6e5;
  }
  &__field-card {
    max-width: 105px;
    margin: 0 !important;
    input {
      padding: 10px 12px 10px;
    }
  }
  &__payment-list {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letterspacing: 0.5px;
    display: inline-flex;
    align-items: center;
  }
  &__payment-details-icon {
    fill: #10ac84 !important;
    margin-left: 5px;
  }
  &__updated-refund,
  &__transaction-header,
  &__refund-total {
    font-weight: 700;
  }
  &__refund-total {
    border-top: 0.5px solid #c8d6e5;
  }
  &__payment-wrapper {
    flex-basis: 65%;
  }
  &__history-details-bloc-wrapper,
  &__fees-wrapper {
    font-size: 11px;
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
  }
  &__payment-fees,
  &__history-details-amount {
    text-align: right;
  }
`;

const FlexWrapper = styled.div`
  ${displayFlex}
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  &__field {
    width: 250px;
  }
  @media screen and (max-width: 601px) {
    ${displayFlex}
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

const FlexButtonWrapper = styled(FlexWrapper)`
  ${displayFlex}
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  @media screen and (max-width: 601px) {
    ${displayFlex}
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
  }
`;

const FormButton = styled(Button)`
  &&& {
    line-height: 0;
    width: 120px;
    margin-left: ${props => (props.primary ? 20 : 0)}px;
  }
`;

export default OrderRefund(RefundModal);

import React from 'react';
import moment from 'moment';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import colors from '../../../../styles/Colors';

const IconTip = ({ item }) => {
  const payment = item.payment || item.payments[0];
  if (
    (payment && Math.sign(payment?.amount) === -1 && payment.notes) ||
    (item.groupOrderBill && item.groupOrderBill.isRefund && item.groupOrderBill.note) ||
    item.noRefundReason
  ) {
    return (
      <BlueTooltip
        placement="top"
        arrow
        title={payment && payment.notes ? payment.notes : item.groupOrderBill?.note ? item.groupOrderBill.note : item.noRefundReason}>
        <InfoIcon fontSize="small" />
      </BlueTooltip>
    );
  }
  return <></>;
};

export const PaymentDetails = ({ payment, item, group, isDetailsPage, handleIsGroup }) => {
  const itemPayment = payment || item.payment || item.payments[0];
  const paymentAmount = Math.abs(itemPayment?.amount).toFixed(2);

  if (item.productType && item.productType === 'specialRefund') {
    return (
      <>
        <span>
          ${paymentAmount} Special Refund to
          {itemPayment.cardBrand && itemPayment.last4 ? ` ${itemPayment.cardBrand} -${itemPayment.last4}` : ' cash'}
        </span>
        {isDetailsPage && <IconTip item={item} />}
      </>
    );
  } else if (item.groupOrderBill?.id) {
    handleIsGroup && handleIsGroup(true);
    return (
      <>
        <span>
          {item.productType === 'orderCancellation' ? 'Cancelled Reservation - ' : ''} ${Math.abs(item.groupOrderBill.amount).toFixed(2)}{' '}
          {item.groupOrderBill.isRefund || Math.sign(item.groupOrderBill.amount) === -1 ? `adjusted to ${group?.name}` : `added to ${group?.name}`}
        </span>
        {isDetailsPage && <IconTip item={item} />}
      </>
    );
  } else if (item.productType === 'orderCancellation' && !item.payment && !item.payments?.length && !item.groupOrderBill) {
    return <span>Cancelled Reservation - No Refund</span>;
  } else if (item.isNoRefund) {
    return (
      <>
        <span>No Refund</span>
        {isDetailsPage && <IconTip item={item} />}
      </>
    );
  } else {
    return (
      <>
        <span>
          {!isNaN(paymentAmount) && (
            <>
              {item.productType === 'orderCancellation' ? 'Cancelled Reservation - ' : ''} ${paymentAmount}{' '}
            </>
          )}
          {itemPayment?.ssRefundId || Math.sign(itemPayment?.amount) === -1 ? 'refunded to' : `${item.prevProductId ? 'charged' : 'payment'} with`}{' '}
          {itemPayment && itemPayment.cardBrand && itemPayment.last4 ? ` ${itemPayment.cardBrand} -${itemPayment.last4}` : ' cash'}
          {itemPayment && <>{item.discount && item.discount > 0 ? ` | DISCOUNTED $${item.discount.toFixed(2)}` : ''}</>}
          {!itemPayment && item.discount && item.discount > 0 ? `$0.00 PAYMENT | DISCOUNTED $${item.discount.toFixed(2)}` : ''}
        </span>
        {isDetailsPage && <IconTip item={item} />}
      </>
    );
  }
};

export const getProdType = (prodType, prodName, quantity) => {
  let prodText = '';
  const pluralize = quantity > 1 ? 's' : '';
  if (prodType === 'rvs') {
    prodText = 'RV spot';
  } else if (prodType === 'stalls') {
    prodText = 'stall';
  } else if (prodType === 'addOns') {
    return prodName;
  }
  return `${prodText}${pluralize}`;
};

export const getDateDiff = (start, end) => {
  let a = moment(start),
    b = moment(end);
  return a.diff(b, 'days');
};

export const getSortedItemsArr = (order, event) => {
  const itemsByPaymentObject = {};
  order?.orderHistory.forEach(item => {
    const prevProductName =
      item.productType === 'rvs'
        ? event?.rvProducts.find(prod => prod.id == item.prevProductId)?.name
        : event?.stallProducts.find(prod => prod.id == item.prevProductId)?.name;

    const prevProductNightly =
      item.productType === 'rvs'
        ? event?.rvProducts.find(prod => prod.id == item.prevProductId)?.nightly
        : event?.stallProducts.find(prod => prod.id == item.prevProductId)?.nightly;

    let createdAt;
    const paymentIdString = item.groupOrderBill
      ? item.groupOrderBill.id
      : !item.payments?.length
      ? item.payment?.id
      : item.payments.reduce((acc, next) => (acc += next?.id), item.payments[0]?.id);
    if (item.prevProductId) item.remove = false;
    if (typeof item.createdAt === 'string') createdAt = item.createdAt.slice(0, -3);
    if (item.payment) {
      if (itemsByPaymentObject[paymentIdString]) itemsByPaymentObject[paymentIdString] = [...itemsByPaymentObject[paymentIdString], item];
      else itemsByPaymentObject[paymentIdString] = [item];
    } else if (item.groupOrderBill) {
      if (itemsByPaymentObject[item.groupOrderBill.id]) itemsByPaymentObject[item.groupOrderBill.id] = [...itemsByPaymentObject[item.groupOrderBill.id], item];
      else itemsByPaymentObject[item.groupOrderBill.id] = [item];
    } else if (!item.payment && !item.groupOrderBill) {
      if (item.productType === 'orderCancellation') {
        itemsByPaymentObject['cancelled'] = [item];
      } else {
        if (itemsByPaymentObject[createdAt]) itemsByPaymentObject[createdAt] = [...itemsByPaymentObject[createdAt], item];
        else itemsByPaymentObject[createdAt] = [item];
      }
    }
    if (item.prevProductId) {
      if (itemsByPaymentObject[createdAt])
        itemsByPaymentObject[createdAt] = itemsByPaymentObject[createdAt]
          ? [
              ...itemsByPaymentObject[createdAt],
              {
                ...item,
                remove: true,
                productName: prevProductName,
                endDate: item.prevEndDate || item.endDate,
                prevProductId: null,
                productId: item.prevProductId,
                nightly: item.nightly === prevProductNightly ? item.nightly : prevProductNightly
              }
            ]
          : [
              {
                ...item,
                remove: true,
                productName: prevProductName,
                endDate: item.prevEndDate || item.endDate,
                prevProductId: null,
                productId: item.prevProductId,
                nightly: item.nightly === prevProductNightly ? item.nightly : prevProductNightly
              }
            ];
      else
        itemsByPaymentObject[paymentIdString] = itemsByPaymentObject[paymentIdString]
          ? [
              ...itemsByPaymentObject[paymentIdString],
              {
                ...item,
                remove: true,
                productName: prevProductName,
                endDate: item.prevEndDate || item.endDate,
                prevProductId: null,
                productId: item.prevProductId,
                nightly: item.nightly === prevProductNightly ? item.nightly : prevProductNightly
              }
            ]
          : [
              {
                ...item,
                remove: true,
                productName: prevProductName,
                endDate: item.prevEndDate || item.endDate,
                prevProductId: null,
                productId: item.prevProductId,
                nightly: item.nightly === prevProductNightly ? item.nightly : prevProductNightly
              }
            ];
    }
  });

  const sortedItemsArr = Object.keys(itemsByPaymentObject).sort((a, b) =>
    !!a && !!b ? itemsByPaymentObject[b][0].createdAt.localeCompare(itemsByPaymentObject[a][0].createdAt, 'en', { numeric: true }) : 0
  );

  return [sortedItemsArr, itemsByPaymentObject];
};

export const BlueTooltip = withStyles({
  tooltip: {
    color: colors.white,
    backgroundColor: colors.border.tertiary,
    fontSize: '16px'
  },
  arrow: {
    color: colors.border.tertiary
  }
})(Tooltip);

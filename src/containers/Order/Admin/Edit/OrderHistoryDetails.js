//@flow
import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import colors from '../../../../styles/Colors';
import { useLazyQuery } from '@apollo/react-hooks';
import { ORDER_FOR_ORDER_HISTORY_DETAILS } from '../../../../queries/Admin/OrderForOrderHistoryDetails';
import type { OrderReturnType } from '../../../../queries/Admin/OrderForOrderTableDetail';
import IndeterminateLoading from 'Components/Loading/IndeterminateLoading';
import Modal from 'Components/Modal';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import { getProdType, PaymentDetails, getDateDiff, getSortedItemsArr } from './orderHistoryHelpers';
import { HeadingThree } from 'Components/Headings';
import { useFormikContext } from 'formik';

type OrderHistoryDetailsBasePropType = {
  className: string,
  close: boolean,
  open: boolean,
  orderID: string,
  group: Object
};

const OrderHistoryDetailsBase = (props: OrderHistoryDetailsBasePropType) => {
  const { className, close, open, orderID, group } = props;
  const { values } = useFormikContext();

  const [getOrderByIdCallback, { data, loading }] = useLazyQuery<OrderReturnType>(ORDER_FOR_ORDER_HISTORY_DETAILS, {
    fetchPolicy: 'network-only'
  });

  const loadOrder = useCallback(() => {
    if (orderID) {
      getOrderByIdCallback({ variables: { id: orderID } });
    }
  }, [orderID]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder, open]);

  if (loading) {
    return <IndeterminateLoading />;
  }
  const [sortedItemsArr, itemsByPaymentObject] = getSortedItemsArr(data, values.event);
  return (
    <Modal open={open} onClose={close} className={`${className}__history-details-modal`}>
      <div className={`${className}__history-details-heading-container`}>
        <HeadingThree label="Order History Details" />
        <IconButton onClick={close} className={`${className}__history-details-close`}>
          <CloseIcon />
        </IconButton>
      </div>
      {data !== undefined ? (
        <>
          {sortedItemsArr.map((key, idx) => {
            let item = itemsByPaymentObject[key].find(x => ['orderCancellation', 'rvs', 'stalls', 'specialRefund'].includes(x.productType));
            if (!item) {
              item = itemsByPaymentObject[key][0];
            }
            const payments = item.payment ? [item.payment] : item.payments;

            return (
              <>
                {item.payment?.id ||
                item.payments?.length ||
                item.groupOrderBill?.id ||
                item.productType === 'orderCancellation' ||
                item.productType === 'specialRefund' ||
                item.isNoRefund ||
                !item.payment ? (
                  <>
                    {item.productType === 'orderCancellation' && !payments.length ? (
                      <>
                        <Grid container className={`${className}__history-details-charge-container ${className}__history-details-wrapper`}>
                          <Grid item xs={12} sm={9} className={`${className}__history-details-charge-amount`}>
                            <PaymentDetails payment={null} item={item} group={group} isDetailsPage />
                          </Grid>
                          <Grid item xs={12} sm={3} className={`${className}__history-details-charge-attribute`}>
                            <span>
                              {item.user.firstName} {item.user.lastName}
                              <br />
                              {moment.unix(item.createdAt / 1000).format('MM/DD/YY [at] h:mm a')}
                            </span>
                          </Grid>
                        </Grid>
                      </>
                    ) : item.productType != 'orderCancellation' && !payments.length && !item.groupOrderBill?.id ? (
                      <Grid container className={`${className}__history-details-charge-container ${className}__history-details-wrapper`}>
                        <Grid item xs={12} sm={9} className={`${className}__history-details-charge-amount`}>
                          <span>non payment edit</span>
                        </Grid>
                        <Grid item xs={12} sm={3} className={`${className}__history-details-charge-attribute`}>
                          <span>
                            {item.user.firstName} {item.user.lastName}
                            <br />
                            {moment.unix(item.createdAt / 1000).format('MM/DD/YY [at] h:mm a')}
                          </span>
                        </Grid>
                      </Grid>
                    ) : (
                      <>
                        {(payments.length ? payments : item.groupOrderBill ? [item.groupOrderBill] : []).map(payment => (
                          <Grid container className={`${className}__history-details-charge-container ${className}__history-details-wrapper`}>
                            <Grid item xs={12} sm={9} className={`${className}__history-details-charge-amount`}>
                              <PaymentDetails payment={payment} item={item} group={group} isDetailsPage />
                            </Grid>
                            <Grid item xs={12} sm={3} className={`${className}__history-details-charge-attribute`}>
                              <span>
                                {item.user.firstName} {item.user.lastName}
                                <br />
                                {moment.unix(item.createdAt / 1000).format('MM/DD/YY [at] h:mm a')}
                              </span>
                            </Grid>
                          </Grid>
                        ))}
                      </>
                    )}
                  </>
                ) : (
                  <></>
                )}

                {itemsByPaymentObject[key].map((item, index) => {
                  const dateDiff = item.startDate ? getDateDiff(item.startDate, item.endDate) : null;
                  const isDateChange = item.prevEndDate > item.endDate || item.startDate > item.prevStartDate;
                  const startDateDiff = getDateDiff(item.startDate, item.prevStartDate) || 0;
                  const endDateDiff = getDateDiff(item.prevEndDate, item.endDate) || 0;
                  const totalDateDiff = startDateDiff + endDateDiff;
                  const dateReduction = isDateChange ? totalDateDiff : false;
                  const plural = dateReduction && Math.abs(dateReduction) > 1 ? 's' : dateDiff && !dateReduction && Math.abs(dateDiff) > 1 ? 's' : '';

                  //check for date extension
                  const currentDateDiff = getDateDiff(item.endDate, item.startDate) || 0;
                  const prevDateDiff = getDateDiff(item.prevEndDate, item.prevStartDate) || 0;
                  const prevNightsPlural = prevDateDiff > 1 ? 's' : '';

                  const noOfExtendedNights = Math.abs(currentDateDiff - prevDateDiff);

                  const isDateExtended = currentDateDiff > prevDateDiff && item.prevEndDate;
                  const isDateReduction = currentDateDiff < prevDateDiff && item.prevEndDate;
                  const updatedDateSameNights = isDateChange && totalDateDiff === 0;

                  const moreUnitsWereAdded = item.prevQuantity && item.quantity - item.prevQuantity > 0;

                  const extendedNightsPlural = isDateExtended && Math.abs(noOfExtendedNights) > 1 ? 's' : '';

                  let isReservationUpdate = false;
                  for (const k in itemsByPaymentObject) {
                    //for adding a new addOn when updating order
                    const isOrderUpdate = itemsByPaymentObject[k].find(x => x.prevProductId);
                    const addOnIncrease = itemsByPaymentObject[k].find(x => x.productType === 'addOns' && x.prevQuantity);
                    //for adding a new addOn when updating order
                    const isOnlyAddons = !itemsByPaymentObject[k].find(x => ['rvs', 'stalls'].includes(x.productType));
                    if (isOrderUpdate) {
                      isReservationUpdate = true;
                      break;
                    }
                    if (addOnIncrease) {
                      isReservationUpdate = true;
                      break;
                    }
                    if (isOnlyAddons) {
                      isReservationUpdate = true;
                      break;
                    }
                  }

                  const isAddonUpdate =
                    item.productType === 'addOns' &&
                    isReservationUpdate &&
                    (item.prevQuantity ? item.prevQuantity < item.quantity : item.quantity) &&
                    idx !== sortedItemsArr.length - 1;
                  if (item.productType === 'orderCancellation') return null;

                  return (
                    <>
                      {item.productType === 'specialRefund' ? null : (
                        <div key={index}>
                          <Grid container className={`${className}__history-details-notes-container ${className}__history-details-wrapper`}>
                            <Grid item xs={12} sm={6} md={4}>
                              {(item.quantity === 0 || !!item.prevQuantity) && !item.prevProductId && item.productType !== 'addOns' ? (
                                <span>
                                  {item.productType === 'orderCancellation' ? (
                                    <></>
                                  ) : moreUnitsWereAdded && isDateExtended && !updatedDateSameNights ? (
                                    <>
                                      <span>
                                        Added {item.quantity - item.prevQuantity}{' '}
                                        {getProdType(item.productType, item.productName, item.quantity - item.prevQuantity)}
                                        {item.startDate || item.endDate
                                          ? ` x ${getDateDiff(item.startDate, item.endDate)
                                              .toString()
                                              .replace('-', '')} night${plural}`
                                          : null}
                                      </span>
                                      <span style={{ display: 'block' }}>
                                        {'Extended '}
                                        {item.prevQuantity} {getProdType(item.productType, item.productName, item.quantity)}{' '}
                                        {item.productType !== 'addOns' ? `x ${noOfExtendedNights} night${extendedNightsPlural}` : null}
                                      </span>
                                    </>
                                  ) : moreUnitsWereAdded && isDateReduction ? (
                                    <>
                                      <span>
                                        Added {item.quantity - item.prevQuantity}{' '}
                                        {getProdType(item.productType, item.productName, item.quantity - item.prevQuantity)}
                                        {item.startDate || item.endDate
                                          ? ` x ${getDateDiff(item.startDate, item.endDate)
                                              .toString()
                                              .replace('-', '')} night${plural}`
                                          : null}
                                      </span>
                                      <span style={{ display: 'block' }}>
                                        {'Reduced '}
                                        {item.prevQuantity} {getProdType(item.productType, item.productName, item.quantity)}{' '}
                                        {item.productType !== 'addOns' ? `x ${noOfExtendedNights} night${extendedNightsPlural}` : null}
                                      </span>
                                    </>
                                  ) : moreUnitsWereAdded && !item.remove && !isDateExtended && !updatedDateSameNights ? (
                                    <>
                                      Added {item.quantity - item.prevQuantity}{' '}
                                      {getProdType(item.productType, item.productName, item.quantity - item.prevQuantity)}
                                      {item.startDate || item.endDate
                                        ? ` x ${getDateDiff(item.startDate, item.endDate)
                                            .toString()
                                            .replace('-', '')} night${plural}`
                                        : null}
                                    </>
                                  ) : moreUnitsWereAdded && !isDateExtended && updatedDateSameNights ? (
                                    <>
                                      <span>
                                        Added {item.quantity - item.prevQuantity}{' '}
                                        {getProdType(item.productType, item.productName, item.quantity - item.prevQuantity)}
                                        {item.startDate || item.endDate
                                          ? ` x ${getDateDiff(item.startDate, item.endDate)
                                              .toString()
                                              .replace('-', '')} night${plural}`
                                          : null}
                                      </span>
                                      <span style={{ display: 'block' }}>Updated date - Same number of nights</span>
                                    </>
                                  ) : !moreUnitsWereAdded && isDateExtended && !updatedDateSameNights ? (
                                    <>
                                      <span>
                                        Removed {item.prevQuantity - item.quantity || item.prevQuantity || null}{' '}
                                        {getProdType(item.productType, item.productName, item.prevQuantity - item.quantity)}{' '}
                                        {item.startDate || item.endDate ? ` x ${prevDateDiff.toString().replace('-', '')} night${prevNightsPlural}` : null}
                                      </span>
                                      <span style={{ display: 'block' }}>
                                        {'Extended '}
                                        {item.quantity} {getProdType(item.productType, item.productName, item.quantity)}{' '}
                                        {item.productType !== 'addOns' ? `x ${noOfExtendedNights} night${extendedNightsPlural}` : null}
                                      </span>
                                    </>
                                  ) : !moreUnitsWereAdded && !isDateExtended && !updatedDateSameNights && !item.remove && noOfExtendedNights !== 0 ? (
                                    <>
                                      <span>
                                        Removed {item.prevQuantity - item.quantity || item.prevQuantity || null}{' '}
                                        {getProdType(item.productType, item.productName, item.prevQuantity - item.quantity)}{' '}
                                        {item.startDate || item.endDate ? ` x ${prevDateDiff.toString().replace('-', '')} night${prevNightsPlural}` : null}
                                      </span>
                                      <span style={{ display: 'block' }}>
                                        {'Reduced '}
                                        {item.quantity} {getProdType(item.productType, item.productName, item.quantity)}{' '}
                                        {item.productType !== 'addOns' ? `x ${noOfExtendedNights} night${extendedNightsPlural}` : null}
                                      </span>
                                    </>
                                  ) : !moreUnitsWereAdded && !isDateExtended && updatedDateSameNights ? (
                                    <>
                                      <span>
                                        Removed {item.prevQuantity - item.quantity || item.prevQuantity || null}{' '}
                                        {getProdType(item.productType, item.productName, item.prevQuantity - item.quantity)}{' '}
                                        {item.startDate || item.endDate ? ` x ${prevDateDiff.toString().replace('-', '')} night${prevNightsPlural}` : null}
                                      </span>
                                      <span style={{ display: 'block' }}>Updated date - Same number of nights</span>
                                    </>
                                  ) : (
                                    <>
                                      Removed {item.prevQuantity - item.quantity || item.prevQuantity || null}{' '}
                                      {getProdType(item.productType, item.productName, item.prevQuantity - item.quantity)}
                                      {item.startDate || item.endDate
                                        ? ` x ${getDateDiff(item.startDate, item.endDate)
                                            .toString()
                                            .replace('-', '')} night${plural}`
                                        : null}
                                    </>
                                  )}
                                </span>
                              ) : item.prevProductId && item.remove ? (
                                <>
                                  {`Removed ${item.prevQuantity || item.quantity} ${getProdType(
                                    item.productType,
                                    item.productName,
                                    item.prevQuantity || item.quantity
                                  )} x ${getDateDiff(item.prevStartDate || item.startDate, item.prevEndDate || item.endDate)
                                    .toString()
                                    .replace('-', '')} night${plural}`}
                                </>
                              ) : item.prevProductId && !item.remove ? (
                                <>
                                  {`Added ${item.quantity} ${getProdType(item.productType, item.productName, item.quantity)} x ${getDateDiff(
                                    item.startDate,
                                    item.endDate
                                  )
                                    .toString()
                                    .replace('-', '')} night${plural}`}
                                </>
                              ) : isDateExtended && item.productType !== 'addOns' ? (
                                <span>
                                  {'Extended '}
                                  {item.quantity} {getProdType(item.productType, item.productName, item.quantity)}{' '}
                                  {item.productType !== 'addOns' ? `x ${noOfExtendedNights} night${extendedNightsPlural}` : null}
                                </span>
                              ) : updatedDateSameNights ? (
                                <>Updated date - Same number of nights</>
                              ) : (
                                <span>
                                  {isDateChange && 'Reduced '}
                                  {item.productType === 'addOns' && item.prevQuantity > item.quantity && 'Reduced '}
                                  {isAddonUpdate && 'Added '}
                                  {item.productType === 'addOns' && Math.abs(item.prevQuantity - item.quantity)}
                                  {item.productType !== 'addOns' && item.quantity} {getProdType(item.productType, item.productName, item.quantity)}{' '}
                                  {item.productType !== 'addOns'
                                    ? `x ${dateReduction ||
                                        getDateDiff(item.startDate, item.endDate)
                                          .toString()
                                          .replace('-', '')} night${plural}`
                                    : null}
                                </span>
                              )}
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} className={`${className}__history-details-productType`}>
                              <span>{item.productType !== 'addOns' ? item.productName : null}</span>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              {item.productType !== 'addOns' && (
                                <span>
                                  {item.startDate ? `${moment(item.startDate).format('MM/DD/YYYY')}-${moment(item.endDate).format('MM/DD/YYYY')}` : null}
                                </span>
                              )}
                            </Grid>
                          </Grid>
                        </div>
                      )}
                    </>
                  );
                })}
              </>
            );
          })}
        </>
      ) : null}
    </Modal>
  );
};

const OrderHistoryDetails = styled(OrderHistoryDetailsBase)`
  &__history-details-modal {
    > .MuiPaper-rounded {
      padding: 0;
      max-height: 707px;
      overflow: auto;
    }
  }
  &__history-details-heading-container {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    button {
      padding: 0;
    }
  }
  &__history-details-wrapper {
    padding: 10px 20px;
    border-top: ${colors.border.primary};
    border-bottom: ${colors.border.primary};
    min-height: 43px;
    .MuiGrid-item {
      display: inline-flex;
      align-items: center;
      text-align: center;
      &:first-child {
        text-align: left;
      }
      &:last-child {
        text-align: right;
      }
    }
  }
  &__history-details-charge-container {
    font-size: 11px;
    background: ${colors.background.primary};
    text-transform: uppercase;
  }
  &__history-details-charge-attribute,
  &__history-details-notes-container {
    span {
      flex: 1;
    }
  }
  &__history-details-charge-amount {
    font-weight: 600;
    svg {
      margin-left: 5px;
    }
  }
  &__history-details-notes-container {
    border-top: 0.5px solid ${colors.border.primary};
    font-size: 16px;
  }
  &__history-details-productType {
    text-transform: capitalize;
  }
`;

export default OrderHistoryDetails;

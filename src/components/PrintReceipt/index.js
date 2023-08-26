import React from 'react';
import { formatPhoneNumber } from '../../helpers/formatPhoneNumber';
import { getPricePerOrderItem, getProduct, getItemizedText } from './receiptHelpers';
import moment from 'moment';
import osLogo from 'src/assets/img/open-stalls-black.png';
import vector from 'src/assets/img/Vector.svg';
import { getProdType, PaymentDetails, getDateDiff, getSortedItemsArr } from '../../containers/Order/Admin/Edit/orderHistoryHelpers';
import { HeadingFour } from 'Components/Headings';
import cliTruncate from 'cli-truncate';
import './PrintReceipt.scss';

const PdfPrintReceipt = ({ order, saveAndPrint, renterView }) => {
  const [isGroup, setIsGroup] = React.useState(false);
  const { user, event, group, discount } = order;
  const [sortedItemsArr, itemsByPaymentObject] = getSortedItemsArr(order, order.event);
  const reservations = order.orderItems.filter(oi => !!oi.reservation);
  const topReservations = reservations.filter(res => !!res.quantity);
  const addOns = order.orderItems.filter(oi => !!oi.addOnProduct);

  let totalMinusRefunds = 0;
  let actualPayment = 0;
  let cardForFees = 0;

  Object.keys(itemsByPaymentObject).forEach(it => {
    if (itemsByPaymentObject[it].some(i => i.remove && i.prevProductId !== null && i.productType !== 'rvs')) {
      return (itemsByPaymentObject[it] = itemsByPaymentObject[it].filter(i => i.productType === 'rvs' && Object.prototype.hasOwnProperty.call(i, 'remove')));
    }
  });

  const handleIsGroup = isGroup => {
    setIsGroup(isGroup);
  };

  return (
    <div className="print-receipt" data-testid="print-receipt-pdf">
      <div className="top-bar" />
      <div className="receipt-header">
        <div className="left-column">
          <div className="header-logo">
            <img src={osLogo} alt="os-logo" width="100px" />
          </div>

          <div className="event-name">
            <HeadingFour label="Order Details" />
            <p className="title">{`${event.name} | ${moment(event.startDate).format('MMMM D[,] YYYY')} - ${moment(event.endDate).format('MMMM D[,] YYYY')}`}</p>
          </div>
        </div>
        <div className="right-column">
          <p className="title">Renter info</p>
          <p>{user.fullName}</p>
          <p>{formatPhoneNumber(user.phone)}</p>
          <p>{user.email}</p>
          {!saveAndPrint && <p>order {order.id}</p>}
        </div>
      </div>
      <div className="order-items">
        {!!topReservations.length && (
          <div className="left-column">
            {topReservations.map((reservation, i) => {
              return (
                <div className="reservation" key={i}>
                  <p className="title">{getItemizedText(reservation)}</p>
                  {!renterView ? getProduct(reservation.reservation) : <></>}
                  <div className="check-in">
                    <div>
                      <p>After {moment(event.checkInTime, 'H:mm:ss').format('h:mm A')}</p>
                      <p>{moment(reservation.reservation.startDate).format('ddd[,] MMM DD[,] YYYY')}</p>
                    </div>
                    <img src={vector} alt="vector" />
                    <div>
                      <p>By {moment(event.checkOutTime, 'H:mm:ss').format('h:mm A')}</p>
                      <p>{moment(reservation.reservation.endDate).format('ddd[,] MMM DD[,] YYYY')}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className={`right-column${!topReservations.length ? ' left-align' : ''}`}>
          {!!addOns.length && (
            <div>
              <p className="title">Add ons</p>
              {addOns.map((addOn, i) => (
                <p key={i}>
                  {addOn.quantity} {addOn.addOnProduct.addOn.name}
                </p>
              ))}
            </div>
          )}
          {order.notes && (
            <div>
              <p className="title">Special requests</p>
              <p>{cliTruncate(order.notes, 80)}</p>
            </div>
          )}
        </div>
      </div>
      <div className="order-history">
        <p className="title">Description</p>
        <div className="order-items-container">
          {sortedItemsArr.map((key, i) => {
            totalMinusRefunds = 0;
            let item = itemsByPaymentObject[key].find(x => ['orderCancellation', 'rvs', 'stalls'].includes(x.productType));
            if (!item) item = itemsByPaymentObject[key][0];
            return (
              <>
                <div className="history-details-charge-container history-details-wrapper" key={`${key}-${i}`}>
                  <div className="history-details-charge-amount">
                    {item.payment?.id ||
                    item.payments?.length ||
                    item.groupOrderBill?.id ||
                    item.productType === 'orderCancellation' ||
                    item.isNoRefund ||
                    (!item.payment && item.discount > 0) ? (
                      <>
                        {item.payments?.length ? (
                          item.payments.map(payment => (
                            <div className="history-details-payment-details-block">
                              <PaymentDetails payment={payment} item={item} group={group} handleIsGroup={isGroup => handleIsGroup(isGroup)} />
                            </div>
                          ))
                        ) : (
                          <PaymentDetails item={item} group={group} handleIsGroup={isGroup => handleIsGroup(isGroup)} />
                        )}
                      </>
                    ) : (
                      <span>non payment edit</span>
                    )}
                  </div>
                  <div className="history-details-charge-attribute">
                    <span>{moment.unix(item.createdAt / 1000).format('MM/DD/YY [at] h:mm a')}</span>
                  </div>
                </div>
                {itemsByPaymentObject[key].map((item, index) => {
                  const dateDiff = item.startDate ? getDateDiff(item.startDate, item.endDate) : null;
                  const reservation = reservations.find(
                    res => res.reservation['rvProduct']?.name === item.productName || res.reservation['stallProduct']?.name === item.productName
                  );
                  const isDateChange = item.prevEndDate > item.endDate || item.startDate > item.prevStartDate;
                  const startDateDiff = getDateDiff(item.startDate, item.prevStartDate) || 0;
                  const endDateDiff = getDateDiff(item.prevEndDate, item.endDate) || 0;
                  const totalDateDiff = startDateDiff + endDateDiff;
                  const dateReduction = isDateChange ? totalDateDiff : false;
                  const plural = dateReduction && Math.abs(dateReduction) > 1 ? 's' : dateDiff && !dateReduction && Math.abs(dateDiff) > 1 ? 's' : '';
                  let itemPayment = item.payment || item.payments[0];

                  if (isGroup) {
                    itemPayment = item.groupOrderBill || itemPayment;
                  }

                  const itemCostString = getPricePerOrderItem(order.orderItems, item, order.event);
                  const [isNegative, actualCost] = itemCostString ? itemCostString.split('$') : 0;
                  totalMinusRefunds += isNegative === '-' ? -Number(actualCost) : Number(actualCost);
                  actualPayment = itemPayment?.amount.toFixed(2) || 0;
                  cardForFees =
                    item.payments?.length > 1
                      ? actualPayment - (item.payments.reduce((prev, curr) => prev + curr.amount, 0) - totalMinusRefunds)
                      : totalMinusRefunds;

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
                    i != sortedItemsArr.length - 1;

                  if (item.productType !== 'specialRefund' && item.productType !== 'orderCancellation') {
                    return (
                      <div key={index}>
                        <div className="history-details-notes-container history-details-wrapper">
                          <div className="details-column">
                            {(item.quantity === 0 || !!item.prevQuantity) && !item.prevProductId && item.productType !== 'addOns' ? (
                              <span>
                                {item.productType === 'specialRefund' || item.productType === 'orderCancellation' ? (
                                  <>{itemPayment?.notes || ' '}</>
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
                                ) : moreUnitsWereAdded && !item.remove && !isDateExtended && !isDateReduction && !updatedDateSameNights ? (
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
                                    {getProdType(item.productType, item.productName, item.prevQuantity - item.quantity)}{' '}
                                    {item.startDate || item.endDate ? ` x ${dateDiff.toString().replace('-', '')} night${plural}` : null}
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
                                {item.productType === 'addOns' && Math.abs(item.prevQuantity ? item.prevQuantity - item.quantity : item.quantity)}
                                {item.productType !== 'addOns' && (item.quantity || reservation.quantity)}{' '}
                                {getProdType(item.productType, item.productName, item.quantity)}{' '}
                                {item.productType !== 'addOns' ? `x ${dateReduction || dateDiff.toString().replace('-', '')} night${plural}` : null}
                              </span>
                            )}
                          </div>
                          <div className="details-column">
                            <span>{item.productType !== 'addOns' ? item.productName : null}</span>
                          </div>
                          <div className="details-column fees">{itemCostString}</div>
                        </div>
                      </div>
                    );
                  }
                })}
                <div className="history-details-notes-container history-details-wrapper fees-row">
                  <span>Fees</span>
                  <span>${actualPayment <= 0 ? 0 : (actualPayment - cardForFees + (discount || 0)).toFixed(2)}</span>
                </div>
              </>
            );
          })}
          {discount && discount > 0 ? (
            <div className="history-details-notes-container history-details-wrapper discount-row">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          ) : null}
        </div>
      </div>
      <p className="fee-statement">This receipt includes all applicable taxes and fees</p>
    </div>
  );
};

class PrintReceiptBase extends React.Component {
  constructor(props) {
    super();
    this.state = { order: props.order, saveAndPrint: props.saveAndPrint, discount: props.discount };
  }
  render() {
    return (
      <PdfPrintReceipt order={this.state.order} saveAndPrint={this.state.saveAndPrint} renterView={this.props.renterView} discount={this.state.discount} />
    );
  }
}

export default PrintReceiptBase;

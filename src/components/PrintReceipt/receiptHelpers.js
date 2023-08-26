import React from 'react';
import { calculateReservationNights } from '../../utils/dateTimeHelpers';

const getCorrectRvProduct = (prod, itm) => (prod?.name || prod?.productName === itm.productName) && prod?.id == itm.productId;

export const getPricePerOrderItem = (orderItems, item, event, extended = false) => {
  if (!item.payment && !item.payments.length && !item.groupOrderBill && (!item.discount || item.discount === 0)) return '$0.00';
  const isAddOn = item.productType === 'addOns';
  const isStalls = item.productType === 'stalls';
  const isRefund =
    item.prevQuantity > item.quantity ||
    item.remove ||
    ((item.quantity === 0 || (!!item.prevQuantity && item.prevQuantity > item.quantity)) && !item.prevProductId);

  const oiProduct = isAddOn
    ? orderItems.find(oi => oi.addOnProduct?.addOn.name === item.productName)
    : isStalls
    ? orderItems.find(oi => oi.reservation?.stallProduct?.id == item.productId)
    : orderItems.find(oi => getCorrectRvProduct(oi.reservation?.rvProduct, item));

  const eventProduct = isStalls
    ? event.stallProducts.find(prod => prod.name === item.productName)
    : event.rvProducts.find(prod => getCorrectRvProduct(prod, item));

  const itemQuantity = item.remove
    ? item.prevQuantity
    : isRefund && item.quantity && !item.prevProductId && item.prevQuantity !== item.quantity
    ? item.prevQuantity - item.quantity
    : item.prevQuantity && (item.productType === 'addOns' || (item.prevQuantity < item.quantity && !extended))
    ? item.quantity - item.prevQuantity
    : item.quantity || item.prevQuantity || oiProduct?.quantity;
  const price = isAddOn
    ? oiProduct?.addOnProduct?.price
    : isStalls
    ? oiProduct?.reservation?.stallProduct?.price || eventProduct?.price
    : oiProduct?.reservation?.rvProduct?.price || eventProduct?.price;

  const reservation = item.startDate ? { startDate: item.startDate, endDate: item.endDate } : oiProduct?.reservation;
  const currentNights = item.nightly ? calculateReservationNights(reservation) : 1;
  const previousNights =
    item.prevStartDate && eventProduct?.nightly ? calculateReservationNights({ startDate: item.prevStartDate, endDate: item.prevEndDate }) : 0;

  let nightMultiplier = !eventProduct?.nightly
    ? previousNights
    : (!item.remove && item.prevProductId !== null) || previousNights === currentNights
    ? currentNights
    : item.productType !== 'addOns'
    ? currentNights - previousNights
    : 1;
  if (!item.prevQuantity && item.prevStartDate && nightMultiplier && !item.nightly) return '$0.00';

  if (item.remove) {
    nightMultiplier = previousNights;
  }

  let totalPrice = Math.abs(itemQuantity * price * (nightMultiplier || 1));

  // extend dates and added units at the same time
  if (previousNights < currentNights && item.nightly && item.prevQuantity && item.prevQuantity < item.quantity) {
    totalPrice = Math.abs((item.quantity - item.prevQuantity) * price * (currentNights || 1));
    totalPrice += Math.abs(item.prevQuantity * price * (nightMultiplier || 1));
  }
  if (previousNights < currentNights && item.nightly && item.prevQuantity && item.prevQuantity > item.quantity) {
    totalPrice = Math.abs((item.quantity - item.prevQuantity) * price * (previousNights || 1));
    totalPrice -= Math.abs(item.quantity * price * (nightMultiplier || 1));
  }
  if (previousNights > currentNights && item.nightly && item.prevQuantity && item.prevQuantity > item.quantity) {
    totalPrice = Math.abs((item.quantity - item.prevQuantity) * price * (previousNights || 1));
    totalPrice += Math.abs(item.quantity * price * (nightMultiplier || 1));
  }
  if (previousNights > currentNights && item.nightly && item.prevQuantity && item.prevQuantity < item.quantity) {
    totalPrice = Math.abs((item.quantity - item.prevQuantity) * price * (currentNights || 1));
    totalPrice -= Math.abs(item.prevQuantity * price * (nightMultiplier || 1));
  }

  return `${isRefund && item.remove != false ? '-' : ''}$${totalPrice.toFixed(2)}`;
};

export const getItemizedText = item => {
  const nights = calculateReservationNights(item.reservation);
  const nightsPlural = nights > 1 ? 's' : '';
  const { quantity } = item;
  const plural = quantity > 1 ? 's' : '';
  const product = item.reservation?.rvProduct ? 'rv spot' : 'stall';
  const addOn = item.addOnProduct?.addOn?.unitName;
  if (item.addOnProduct?.addOn) {
    return `${quantity} ${addOn}${plural}`;
  }
  return `${quantity} ${product}${plural} x ${nights} night${nightsPlural}`;
};

export const getProduct = reservation => {
  const { stallProduct, stalls, id } = reservation;
  const buildingNames = stallProduct ? [...new Set(stalls.map(item => item.building.name))] : [reservation.rvProduct.rvLot?.name];
  const type = stallProduct ? 'stalls' : 'rvSpots';
  const spotList = reservation[type]
    .map(prod => prod.name)
    .sort((a, b) => (!!a && !!b ? a.localeCompare(b, 'en', { numeric: true }) : 0))
    .join(', ');

  return (
    <div className="buildings-spots" key={id}>
      {!!buildingNames.length && !!spotList.length && (
        <p>{`${buildingNames.join(', ')} - ${stallProduct ? 'Stall' : 'Spot'}${spotList.indexOf(',') !== -1 ? 's' : ''} ${spotList}`}</p>
      )}
    </div>
  );
};

import { calculateReservationNights } from '../../../../utils/dateTimeHelpers';
import moment from 'moment';
import PRODUCT_REF_TYPE from 'Constants/productRefType';

export function daysWithoutDiscount(item, initialStartDate, initialEndDate, initialDuration) {
  if ((!item.discountStartDate || !item.discountEndDate) && initialDuration) return initialDuration;

  const selectedDatesRange = moment.range(moment(initialStartDate), moment(initialEndDate));
  const discountRange = moment.range(moment(item.discountStartDate), moment(item.discountEndDate));

  const selectedDatesArray = Array.from(selectedDatesRange.by('days'));

  const daysWithoutDiscount = selectedDatesArray.filter(selectedDate => !discountRange.contains(moment(selectedDate)));

  return daysWithoutDiscount.length;
}

export function removedDaysWithoutDiscount(item, initialStartDate, initialEndDate, nights, initialDuration) {
  if ((!item.discountStartDate || !item.discountEndDate) && nights) return nights - initialDuration;
  if ((!item.discountStartDate || !item.discountEndDate) && !nights && initialDuration) return initialDuration;

  const selectedDatesRange = moment.range(moment(item.startDate), moment(item.endDate));
  const discountRange = moment.range(moment(item.discountStartDate), moment(item.discountEndDate));
  const oldDatesRange = moment.range(moment(initialStartDate), moment(initialEndDate));

  const oldDatesArray = Array.from(oldDatesRange.by('days'));

  const removedDays = oldDatesArray.filter(oldDate => !selectedDatesRange.contains(moment(oldDate)));
  const removedDaysWithoutDiscount = removedDays.filter(removedDay => !discountRange.contains(moment(removedDay)));

  return -removedDaysWithoutDiscount.length;
}

export function parseDifferencesByItemWithDiscounts(priceAdjustments, initialOrderCosts, orderCosts) {
  if (!priceAdjustments || !priceAdjustments.length) return [];

  return priceAdjustments.map(priceAdjustment => {
    if (!initialOrderCosts || !orderCosts) return priceAdjustment;

    const initialProduct = initialOrderCosts.orderItemsCostsWithDetails.find(item => item.xProductId === priceAdjustment[3]);
    const currentProduct = orderCosts.orderItemsCostsWithDetails.find(item => item.xProductId === priceAdjustment[3]);

    if (initialProduct && !currentProduct && initialProduct.discount && initialProduct.discount > 0) {
      let newPriceAdjustment = [...priceAdjustment];
      newPriceAdjustment[1] = newPriceAdjustment[1] + initialProduct.discount;
      return newPriceAdjustment;
    } else {
      return priceAdjustment;
    }
  });
}

export const calculateDifferencesByItem = (values, orderCosts) => {
  if (!orderCosts || !orderCosts.orderCosts) return [];
  const productChanges = [];
  const initialItemsHash = {};
  const initialOrderItems = values.initialOrder.orderItems;
  const currentOrderItems = orderCosts.orderCosts?.orderItemsCostsWithDetails;
  const orderItemsHash = {};

  const pluralizeName = (diff, quantity, name) => {
    if (diff > 1 && quantity > 1) {
      return `${name}`;
    } else if (quantity > 1) {
      return `${name}s`;
    } else if (quantity === 1) {
      return name;
    }
    return name.slice(0, -1);
  };

  // build hash of initial items
  initialOrderItems.forEach(item => {
    const { quantity } = item;
    if (item.addOnProduct && quantity > 0) {
      const { id, price } = item.addOnProduct;
      initialItemsHash[id] = { quantity, cost: quantity * price };
    } else if (item.reservation && quantity > 0) {
      const product = item.reservation.rvProduct ? 'rvProduct' : 'stallProduct';
      const { id, price, nightly } = item.reservation[product];
      const { startDate, endDate } = item.reservation;
      const reservationNights = calculateReservationNights(item.reservation);
      const cost = nightly ? quantity * price * reservationNights : quantity * price;
      initialItemsHash[id] = { quantity, price, cost, startDate, endDate, nightly, product };
    }
  });

  // check for differences with current items
  currentOrderItems?.forEach(item => {
    const id = item.xProductId;
    orderItemsHash[id] = true;
    let name, nights, initialDuration;

    if (!item.startDate) {
      const matchingAddOn = values.event.addOnProducts.find(addOn => addOn.id === item.xProductId);
      name = matchingAddOn?.addOn.unitName;
    } else if (initialItemsHash[id]) {
      name = initialItemsHash[id]?.product === 'rvProduct' ? 'spot' : 'stall';
      nights = moment(item.endDate).diff(moment(item.startDate), 'days');
      initialDuration = moment(initialItemsHash[id].endDate).diff(moment(initialItemsHash[id].startDate), 'days');
    } else if (!initialItemsHash[id]) {
      name = item.xRefTypeId == PRODUCT_REF_TYPE.RV_PRODUCT ? 'spot' : 'stall';
      nights = moment(item.endDate).diff(moment(item.startDate), 'days');
    }

    name += initialItemsHash[id]?.quantity - item.quantity > 1 ? 's' : '';

    const dateWasChanged =
      item.startDate && initialItemsHash[id] && (item.startDate !== initialItemsHash[id].startDate || item.endDate !== initialItemsHash[id].endDate);

    if (!initialItemsHash[id]) {
      productChanges.push([
        `Added ${item.quantity} ${name}${nights ? ` x ${nights} nights` : ''}`,
        item.orderItemCost,
        !!item.discount && item.orderItemCost <= item.discount && item.discount > 0,
        id
      ]);
    } else if (item.quantity == 0) {
      productChanges.push([
        `Removed ${initialItemsHash[id].quantity} ${name}${nights ? ` x ${nights} nights` : ''}`,
        item.orderItemCost,
        !!item.discount && item.orderItemCost <= item.discount && item.discount > 0,
        id
      ]);
    } else if (item.quantity !== initialItemsHash[id].quantity) {
      if (dateWasChanged) {
        // qty and dates changed at the same time
        const nightsNumber = item.quantity < initialItemsHash[id].quantity ? initialDuration : nights;
        productChanges.push([
          `${item.quantity > initialItemsHash[id].quantity ? 'Added' : 'Removed'} ${Math.abs(item.quantity - initialItemsHash[id].quantity)} ${name}${
            nightsNumber ? ` x ${nightsNumber} ${nightsNumber > 1 ? 'nights' : 'night'}` : ''
          }`,
          !item.startDate
            ? item.orderItemCost - initialItemsHash[id].cost
            : (item.quantity * initialItemsHash[id].price - initialItemsHash[id].quantity * initialItemsHash[id].price) *
              (initialItemsHash[id].nightly
                ? Math.abs(daysWithoutDiscount(item, initialItemsHash[id].startDate, initialItemsHash[id].endDate, nightsNumber))
                : 1),
          daysWithoutDiscount(item, initialItemsHash[id].startDate, initialItemsHash[id].endDate, nightsNumber) <= 0,
          id
        ]);
      } else {
        productChanges.push([
          `${item.quantity > initialItemsHash[id].quantity ? 'Added' : 'Removed'} ${Math.abs(item.quantity - initialItemsHash[id].quantity)} ${name}${
            initialDuration ? ` x ${initialDuration} ${initialDuration > 1 ? 'nights' : 'night'}` : ''
          }`,
          !item.startDate
            ? item.orderItemCost - initialItemsHash[id].cost
            : (item.quantity * initialItemsHash[id].price - initialItemsHash[id].quantity * initialItemsHash[id].price) *
              (initialItemsHash[id].nightly
                ? Math.abs(daysWithoutDiscount(item, initialItemsHash[id].startDate, initialItemsHash[id].endDate, initialDuration))
                : 1),
          daysWithoutDiscount(item, initialItemsHash[id].startDate, initialItemsHash[id].endDate, initialDuration) <= 0,
          id
        ]);
      }
    }

    if (dateWasChanged) {
      const updatedDateSameNights = nights === initialDuration;
      const isDateReduction = nights < initialDuration;
      const isDateExtension = nights > initialDuration;
      const qtyDiff = Math.abs(item.quantity - initialItemsHash[id].quantity);
      const nightsDiff = Math.abs(nights - initialDuration);
      const pluralizedName = pluralizeName(qtyDiff, item.quantity, name);
      const pluralizedNight = nightsDiff > 1 ? 'nights' : 'night';
      const isQtyIncreased = item.quantity > initialItemsHash[id].quantity;
      let updatedItemsDescription = '';
      let itemQuantity = isQtyIncreased ? initialItemsHash[id].quantity : item.quantity;

      if (updatedDateSameNights) {
        updatedItemsDescription = 'Updated date - Same number of nights';
      }
      if (isDateReduction) {
        updatedItemsDescription = `Reduced ${item.quantity} ${pluralizedName} x ${nightsDiff} ${pluralizedNight}`;
      }
      if (isDateReduction && isQtyIncreased) {
        updatedItemsDescription = `Reduced ${initialItemsHash[id].quantity} ${pluralizedName} x ${nightsDiff} ${pluralizedNight}`;
      }
      if (isDateExtension) {
        updatedItemsDescription = `Extended ${item.quantity} ${pluralizedName} x ${nightsDiff} ${pluralizedNight}`;
      }
      if (isDateExtension && isQtyIncreased) {
        updatedItemsDescription = `Extended ${initialItemsHash[id].quantity} ${pluralizedName} x ${nightsDiff} ${pluralizedNight}`;
      }

      productChanges.push([
        updatedItemsDescription,
        initialItemsHash[id].nightly === false
          ? 0
          : itemQuantity *
            initialItemsHash[id].price *
            removedDaysWithoutDiscount(item, initialItemsHash[id].startDate, initialItemsHash[id].endDate, nights, initialDuration),
        removedDaysWithoutDiscount(item, initialItemsHash[id].startDate, initialItemsHash[id].endDate, nights, initialDuration) === 0,
        id
      ]);
    }
    delete initialItemsHash[id];
  });

  // check original items to see if anything was deleteed
  Object.keys(initialItemsHash).forEach(item => {
    const currentItem = currentOrderItems?.find(orderItem => {
      return item === orderItem.xProductId;
    });

    if (!currentItem) {
      let name, nights;
      if (!initialItemsHash[item].startDate) {
        const matchingAddOn = values.event.addOnProducts.find(addOn => addOn.id === item);
        name = matchingAddOn?.addOn.unitName;
      } else {
        name = initialItemsHash[item].product === 'rvProduct' ? 'spot' : 'stall';
        nights = moment(initialItemsHash[item].endDate).diff(moment(initialItemsHash[item].startDate), 'days');
      }
      name += initialItemsHash[item].quantity > 1 ? 's' : '';
      productChanges.push([
        `Removed ${initialItemsHash[item].quantity} ${name}${nights ? ` x ${nights} nights` : ''}`,
        initialItemsHash[item].cost * -1,
        false,
        item
      ]);
    }
  });

  return productChanges;
};

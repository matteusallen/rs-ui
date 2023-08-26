import xRefType from 'Constants/productRefType.js';
import moment from 'moment';

export const buildOrderItems = values => {
  const orderItemsArray = [];
  if (values.stallProductId) {
    const { quantity, start: startDate, end: endDate } = values.stalls;
    if (quantity > 0) {
      orderItemsArray.push({
        xProductId: values.stallProductId,
        xRefTypeId: xRefType.STALL_PRODUCT,
        quantity: Number(quantity),
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate ?? startDate).format('YYYY-MM-DD')
      });
    }
  }
  if (values.rvProductId) {
    const { quantity, start: startDate, end: endDate } = values.rv_spot;
    if (quantity > 0) {
      orderItemsArray.push({
        xProductId: values.rvProductId,
        xRefTypeId: xRefType.RV_PRODUCT,
        quantity: Number(quantity),
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate ?? startDate).format('YYYY-MM-DD')
      });
    }
  }
  Object.keys(values.addOns)?.forEach(addOn => {
    const quantity = +values.addOns[addOn];
    if (quantity > 0) orderItemsArray.push({ xProductId: addOn, xRefTypeId: xRefType.ADD_ON_PRODUCT, quantity });
  });
  return orderItemsArray;
};

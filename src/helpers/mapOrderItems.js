//@flow
import moment from 'moment';

import PRODUCT_REF_TYPE from 'Constants/productRefType';
import { isEmpty } from './isEmpty';
import type { AddOnProductType } from '../queries/Renter/EventForOrderCreate';

type MapOrderItemsParamsType = {|
  addOns: { [index: string]: number },
  rvProductId: string,
  rvsEnd: string,
  rvsQuantity: number,
  rvsStart: string,
  stallProductId: string,
  stallsEnd: string,
  stallsQuantity: number,
  stallsStart: string
|};

export type OrderItemsType = {|
  endDate?: string | null,
  quantity: number,
  startDate?: string | null,
  xProductId: string,
  xRefTypeId: number
|};

export const mapOrderItems = ({
  addOns,
  stallProductId,
  stallsQuantity,
  stallsStart,
  stallsEnd,
  rvProductId,
  rvsQuantity,
  rvsStart,
  rvsEnd
}: MapOrderItemsParamsType): OrderItemsType[] => {
  const orderItemsArray = [];
  if (!!stallProductId && !!stallsQuantity && !!stallsStart && !!stallsEnd) {
    orderItemsArray.push({
      xProductId: stallProductId,
      xRefTypeId: PRODUCT_REF_TYPE.STALL_PRODUCT,
      quantity: parseInt(stallsQuantity),
      startDate: moment(stallsStart).format('YYYY-MM-DD'),
      endDate: moment(stallsEnd).format('YYYY-MM-DD')
    });
  }
  if (!isEmpty(addOns)) {
    Object.keys(addOns).map(addOnProductId => {
      const quantity = parseInt(addOns[addOnProductId]);
      if (quantity > 0) {
        orderItemsArray.push({
          xProductId: addOnProductId,
          xRefTypeId: PRODUCT_REF_TYPE.ADD_ON_PRODUCT,
          quantity
        });
      }
    });
  }
  if (!!rvProductId && !!rvsQuantity && !!rvsStart && !!rvsEnd) {
    orderItemsArray.push({
      xProductId: rvProductId,
      xRefTypeId: PRODUCT_REF_TYPE.RV_PRODUCT,
      quantity: parseInt(rvsQuantity),
      startDate: moment(rvsStart).format('YYYY-MM-DD'),
      endDate: moment(rvsEnd).format('YYYY-MM-DD')
    });
  }
  return orderItemsArray;
};

type MapOrderItemsSummaryPramsType = {|
  addOnProducts: AddOnProductType[],
  orderItems: OrderItemsType[]
|};

type MapOrderItemsSummaryReturnType = {|
  ...OrderItemsType,
  by: string,
  duration: number | null,
  quantityUnit: string,
  unit: string
|};

export const mapOrderItemsSummary = ({ orderItems, addOnProducts }: MapOrderItemsSummaryPramsType): MapOrderItemsSummaryReturnType[] =>
  orderItems.map(orderItem => parseOrderItem(orderItem, addOnProducts));

const parseOrderItem = (orderItem: OrderItemsType, addOnProducts: AddOnProductType[]): MapOrderItemsSummaryReturnType => {
  switch (parseInt(orderItem.xRefTypeId)) {
    case PRODUCT_REF_TYPE.STALL_PRODUCT:
      return {
        unit: 'Stall',
        by: 'x',
        duration: Number(moment(orderItem.endDate).diff(moment(orderItem.startDate), 'days')),
        quantityUnit: 'night',
        ...orderItem
      };
    case PRODUCT_REF_TYPE.RV_PRODUCT:
      return {
        unit: 'RV spot',
        by: 'x',
        duration: Number(moment(orderItem.endDate).diff(moment(orderItem.startDate), 'days')),
        quantityUnit: 'night',
        ...orderItem
      };
    case PRODUCT_REF_TYPE.ADD_ON_PRODUCT: {
      const match = addOnProducts.find(addOnProduct => addOnProduct.id === orderItem.xProductId);
      const addOnProduct = match ? match : { addOn: {} };
      return {
        unit: addOnProduct.addOn.unitName || '',
        by: 'of',
        duration: null,
        quantityUnit: addOnProduct.addOn.name || '',
        ...orderItem
      };
    }
    default:
      return {
        ...orderItem,
        by: '',
        duration: null,
        quantityUnit: '',
        unit: ''
      };
  }
};

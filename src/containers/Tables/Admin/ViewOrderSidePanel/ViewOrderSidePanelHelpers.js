//@flow
import moment from 'moment';

import type { OrderItemType } from '../../../../mutations/OrderCheckout';

type GetOrderItemsReturnType = {|
  addOnOrderItems: OrderItemType[],
  rvsOrder: OrderItemType | null,
  stallsOrder: OrderItemType | null
|};

export const getOrderItems = (orderItems: OrderItemType[]): GetOrderItemsReturnType => {
  const stallsOrder = orderItems.find(item => !!item.reservation && item.reservation.stallProduct) || null;
  const rvsOrder = orderItems.find(item => !!item.reservation && item.reservation.rvProduct) || null;
  const addOnOrderItems = orderItems.filter(item => item.addOnProduct);

  return {
    stallsOrder,
    rvsOrder,
    addOnOrderItems
  };
};

export const parseDateRange = (from: string, to: string): string => `${moment(from).format('MM/DD/YY')} - ${moment(to).format('MM/DD/YY')}`;

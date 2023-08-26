//@flow
import moment from 'moment';

import { getValueByPropPath } from '../utils/objectHelpers';
import type { OrderCheckoutReturnType, OrderItemType } from '../mutations/OrderCheckout';
import type { SummaryPropsType } from '../containers/Order/Renter/Create/Summary';
import { DATE_FORMAT } from './DATE_FORMAT';
import type { TicketPropsType } from '../containers/Order/Renter/Create/Ticket';

type OrderItemsGroupsReturnType = {|
  addOnProducts: OrderItemType[],
  rvProduct: OrderItemType | {},
  stallProduct: OrderItemType | {}
|};

export const orderItemsGroups = (response: OrderCheckoutReturnType): OrderItemsGroupsReturnType => {
  const orderItems = response.order.orderItems;
  return orderItems.reduce(
    (state, item) => {
      if (item.addOnProduct) {
        return {
          ...state,
          addOnProducts: [...state.addOnProducts, item]
        };
      }
      if (item.reservation && item.reservation.stallProduct) {
        return {
          ...state,
          stallProduct: item
        };
      }
      if (!!item.reservation && !!item.reservation.rvProduct) {
        return {
          ...state,
          rvProduct: item
        };
      }
      return state;
    },
    {
      addOnProducts: [],
      stallProduct: {},
      rvProduct: {}
    }
  );
};

type MapSummaryFromResponseReturnType = {|
  ...SummaryPropsType,
  stallProductId: string
|};

export const mapSummaryFromResponse = (response: OrderCheckoutReturnType): MapSummaryFromResponseReturnType => {
  const { order } = response;
  const { event, fee, total, platformFee } = order;

  const groups = orderItemsGroups(response);
  const addOns = groups.addOnProducts.reduce((state, item) => {
    const newState = {};
    const id = (item && item.addOnProduct && item.addOnProduct.id) || '';
    newState[id] = item.quantity || 0;
    return {
      ...state,
      ...newState
    };
  }, {});

  const { stallProduct = {}, rvProduct = {} } = groups;
  const stallProductReservation = getValueByPropPath(stallProduct, 'reservation', {});
  const rvProductReservation = getValueByPropPath(rvProduct, 'reservation', {});
  const rvProductId = getValueByPropPath(rvProductReservation, 'rvProduct.id', '');
  const stallProductId = getValueByPropPath(stallProductReservation, 'stallProduct.id', '');
  const rv_spot = {
    end: moment(getValueByPropPath(rvProductReservation, 'endDate', ''), DATE_FORMAT),
    quantity: getValueByPropPath(rvProduct, 'quantity', 0),
    start: moment(getValueByPropPath(rvProductReservation, 'startDate', ''), DATE_FORMAT)
  };
  const stalls = {
    end: moment(getValueByPropPath(stallProductReservation, 'endDate', ''), DATE_FORMAT),
    quantity: getValueByPropPath(groups, 'stallProduct.quantity', 0),
    start: moment(getValueByPropPath(stallProductReservation, 'startDate', ''), DATE_FORMAT)
  };
  return {
    event,
    addOns,
    stalls,
    rv_spot,
    rvProductId,
    stallProductId,
    hideHeader: true,
    showFooter: true,
    fee,
    total,
    platformFee
  };
};

export const mapTicketFromResponse = (response: OrderCheckoutReturnType): TicketPropsType => {
  const { event, addOns, stalls, rv_spot, rvProductId, stallProductId, fee, total, platformFee } = mapSummaryFromResponse(response);
  return {
    addOnProducts: event.addOnProducts,
    addOns,
    rvProductId,
    rv_spot,
    stalls,
    stallProductId,
    payments: response.order && response.order.payments ? response.order.payments : [],
    orderFee: fee,
    orderTotal: total,
    platformFee
  };
};

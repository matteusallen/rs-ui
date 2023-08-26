//@flow
import React, { useMemo } from 'react';

import { getValueByPropPath } from '../../../../utils/objectHelpers';
import type { OrderItemType } from '../../../../mutations/OrderCheckout';
import { pluralizeName } from '../../../Order/Renter/Create/TicketOrderItem';

type SidePanelRvsPropsType = {|
  children: (columns: { text: React$Node, title: string }[]) => React$Node,
  order: OrderItemType
|};

export const SidePanelRvs = ({ children, order }: SidePanelRvsPropsType) => {
  const { reservation: orderReservation = {}, quantity } = order;
  const { rvProduct: orderReservationRvProduct = {} } = orderReservation;
  const rvSpots = orderReservation.rvSpots || [];
  const names = useMemo(() => rvSpots.map(rvSpot => rvSpot.name).join(', '), [JSON.stringify(rvSpots)]);
  const name = getValueByPropPath(orderReservationRvProduct, 'name', 'Unassigned');
  const lotName = getValueByPropPath(orderReservationRvProduct, 'rvLot.name', 'Unassigned');
  const numberOfSpots = `${quantity} ${pluralizeName('spot', quantity)}`;
  const columns = [
    {
      title: 'LOCATION',
      text: name || lotName
    },
    { title: 'SPOTS', text: names || numberOfSpots }
  ];
  return <>{children(columns)}</>;
};

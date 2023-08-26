//@flow
import React from 'react';

import { getValueByPropPath } from '../../../../utils/objectHelpers';
import type { OrderItemType } from '../../../../mutations/OrderCheckout';
import { pluralizeName } from '../../../Order/Renter/Create/TicketOrderItem';

type SidePanelStallsPropsType = {|
  children: (columns: { text: React$Node, title: string }[]) => React$Node,
  order: OrderItemType
|};

export const SidePanelStalls = ({ children, order }: SidePanelStallsPropsType) => {
  const stalls = getValueByPropPath(order, 'reservation.stalls', []);

  const numberOfStalls = `${order.quantity} ${pluralizeName('stall', order.quantity)}`;

  const rows = stalls.reduce((state, item) => {
    const newState = { ...state };
    const group = getValueByPropPath(item, 'building.name', 'none');
    newState[group] = newState[group] !== undefined ? newState[group] + ', ' + item.name : item.name;
    return newState;
  }, {});

  const stallsBuildings = Object.keys(rows).map(key => {
    return (
      <>
        {key}
        <br />{' '}
      </>
    );
  });

  const stallNumbers = Object.keys(rows)
    .map(key => rows[key])
    .join(', ');

  const columns = [
    {
      title: 'LOCATION',
      text: stallsBuildings.length === 0 ? 'Unassigned' : stallsBuildings
    },
    { title: 'STALLS', text: stallNumbers || numberOfStalls }
  ];

  return <>{children(columns)}</>;
};

//@flow
import React from 'react';

import { formatPriceInformation } from '../../../../helpers';

type TicketOrderItemPropsType = {|
  by: string,
  duration: number,
  orderItemCost: number,
  quantity: number,
  quantityUnit: string,
  unit: string
|};

export const pluralizeName = (name: string, quantity: number): string => (quantity > 1 ? name.trim().replace(/s$/i, '') + 's' : name);

const TicketOrderItem = (props: TicketOrderItemPropsType) => {
  const { quantityUnit, by, duration, quantity, unit, orderItemCost } = props;
  return (
    <div className="ticket-line">
      <p>{`${quantity} ${pluralizeName(unit, quantity)} ${by} ${duration ? duration : ''} ${pluralizeName(quantityUnit, duration ? duration : quantity)}`}</p>
      <p>${formatPriceInformation(orderItemCost)}</p>
    </div>
  );
};

export default TicketOrderItem;

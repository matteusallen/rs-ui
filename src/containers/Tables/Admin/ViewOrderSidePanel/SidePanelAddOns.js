//@flow
import React, { useMemo } from 'react';

import { getValueByPropPath } from '../../../../utils/objectHelpers';
import { pluralizeName } from '../../../Order/Renter/Create/TicketOrderItem';
import type { OrderItemType } from '../../../../mutations/OrderCheckout';

type SidePanelAddOnsPropsType = {|
  addOnOrderItems?: OrderItemType[] | null,
  children: (columns: { text: React$Node, title: string }[]) => React$Node
|};

export const SidePanelAddOns = ({ addOnOrderItems, children }: SidePanelAddOnsPropsType): React$Node => {
  const items = addOnOrderItems || [];
  const columns = useMemo(
    () =>
      items.map(orderItem => {
        const { addOnProduct, quantity } = orderItem;
        const unit = pluralizeName(getValueByPropPath(addOnProduct, 'addOn.unitName', ''), quantity);
        const addOnName = pluralizeName(getValueByPropPath(addOnProduct, 'addOn.name', ''), quantity);
        return {
          title: addOnName.toUpperCase(),
          text: `${quantity} ${unit}`
        };
      }),
    [JSON.stringify(addOnOrderItems)]
  );
  return <>{children(columns)}</>;
};

//@flow

import { useState } from 'react';

type UseOrderSidePanelReturnType = {|
  onClose: () => void,
  open: (id: string) => void,
  orderID: string | null
|};

export const useOrderSidePanel = (): UseOrderSidePanelReturnType => {
  const [orderID, setOrderId] = useState<string | null>(null);
  return {
    orderID,
    open: (id: string) => setOrderId(id),
    onClose: () => setOrderId(null)
  };
};

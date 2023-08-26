//@flow
import React from 'react';
import { useFormikContext } from 'formik';

import Ticket from './Ticket';

import type { ReservationFormShapeType } from './index';

const FormikTicket = ({ className = '', stripe, elements, setTotal }: { className?: string, stripe: string, elements: string, setTotal: number }) => {
  const { values = {} } = useFormikContext<ReservationFormShapeType>();
  const { addOns, ccInformation, event, rv_spot, rvProductId, stalls, stallProductId } = values;
  const { addOnProducts } = event;
  return (
    <Ticket
      className={className}
      addOnProducts={addOnProducts}
      ccInformation={ccInformation}
      stallProductId={stallProductId}
      rvProductId={rvProductId}
      addOns={addOns}
      stalls={stalls}
      rv_spot={rv_spot}
      key={`${event.id}-${stallProductId}-${rvProductId}-${addOns.length}`}
      stripe={stripe}
      elements={elements}
      setTotal={setTotal}
    />
  );
};

export default FormikTicket;

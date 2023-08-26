//@flow
import React from 'react';
import { useFormikContext } from 'formik';

import Summary from './Summary';
import FormCard from '../../../../components/Cards/FormCard';

import type { ReservationFormShapeType } from './index';

const CheckoutSummaryPreview = () => {
  const {
    values: { event, stalls, addOns, rvProductId, rv_spot }
  } = useFormikContext<ReservationFormShapeType>();

  return (
    <FormCard>
      <Summary event={event} stalls={stalls} addOns={addOns} rvProductId={rvProductId} rv_spot={rv_spot} />
    </FormCard>
  );
};

export default CheckoutSummaryPreview;

// @flow
import React from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';

import FormCard from '../../../../components/Cards/FormCard';
import FormikTicket from '../../Renter/Create/FormikTicket';

import { isEmpty } from '../../../../helpers';

import { paragraphReg } from '../../../../styles/Typography';

const OrderSummaryBase = ({ className, stripe, elements, setTotal }) => {
  const { values } = useFormikContext();
  const { event } = values;
  return (
    <FormCard dataTestId="reservation_summary">
      {event && !isEmpty(event) ? (
        <FormikTicket className={className} stripe={stripe} elements={elements} setTotal={setTotal} />
      ) : (
        <div className={className + '__empty-totals'}>Select an event to continue</div>
      )}
    </FormCard>
  );
};

const OrderSummary = styled(OrderSummaryBase)`
  &__empty-totals {
    ${paragraphReg}
    font-size: 16px;
    margin-top: 0;
  }
`;

export default OrderSummary;

import React from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';

import SpecialRequestTextArea from '../../shared/SpecialRequestTextArea';
import FormCard from '../../../../components/Cards/FormCard';
import { HeadingThree } from '../../../../components/Headings';
import { Separator } from '../../../../components/Separator';

function SpecialRequestsBase(props) {
  const { className, order } = props;
  const { values } = useFormikContext();
  const { reservationEdit } = values;

  return (
    <FormCard className={className} dataTestId="card_special_requests">
      <HeadingThree label={'Special Requests'} />
      <Separator margin="0.625rem 0 1.375rem" />
      <div className={`${className}__row`}>
        <div className={`${className}__item`}>
          {reservationEdit ? order.notes && order.notes.length > 0 ? <p>{order.notes}</p> : '-' : <SpecialRequestTextArea {...props} />}
        </div>
      </div>
    </FormCard>
  );
}

const SpecialRequests = styled(SpecialRequestsBase)`
  &&& {
    padding: 20px;
  }

  &__row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  &__item {
    width: 100%;
    margin: 0;
  }
  &__item p {
    margin: 0;
  }
`;

export default SpecialRequests;

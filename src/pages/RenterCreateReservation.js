// @flow
import React, { memo } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import RenterCreateReservation from '../containers/Order/Renter/Create';

type RenterCreateReservationPropsType = {|
  className: string
|};
const RenterCreateReservationBase = (props: RenterCreateReservationPropsType) => {
  const { className } = props;
  const { eventId } = useParams();
  return (
    <section className={className}>
      <RenterCreateReservation eventId={eventId} />
    </section>
  );
};

const RenterCreateReservationStyled = styled(RenterCreateReservationBase)`
  /* margin: 85px 50px 50px;
  // max-width: 1800px;
  min-width: 1130px; */

  margin: 85px 0 0;

  display: flex;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 600px) {
    margin: 15px 0 0;
  }

  @media screen and (min-width: 960px) {
    margin: 85px auto;
    max-width: 1800px;
    min-width: 1130px;
  }

  &__Header {
    &&& {
      text-align: left;
      margin: 0 20px 30px 0;
    }
  }
`;

export default memo<{}>(RenterCreateReservationStyled);

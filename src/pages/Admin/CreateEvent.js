// @flow
import React, { memo } from 'react';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router';
import CreateEvent from '../../containers/Event/Create';
import ContextSnackbar from '../../components/Snackbar';

export type EventType = {|
  checkInTime: string,
  checkOutTime: string,
  endDate: string,
  id: number,
  name: string,
  pricePerEvent: ?number,
  pricePerNight: ?number,
  startDate: string
|};
type AdminCreateEventPropsType = {|
  className: string,
  client: {
    query: (options: {}) => Promise<EventType>
  },
  history: {
    location: {
      pathname: string
    },
    push: (input: string) => void
  },
  location: {
    search: string
  }
|};

const AdminCreateEventBase = (props: AdminCreateEventPropsType) => {
  const { className } = props;
  return (
    <>
      <section className={className}>
        <ContextSnackbar />
        <CreateEvent />
      </section>
    </>
  );
};

const AdminCreateEvent = styled(AdminCreateEventBase)`
  margin: 85px 50px 50px;
`;

// eslint-disable-next-line prettier/prettier
export default compose(withRouter)(memo(AdminCreateEvent));

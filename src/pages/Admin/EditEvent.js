// @flow
import React, { memo } from 'react';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router';
import type { RouteComponentProps } from 'react-router-dom';
import type { StandardProps } from '@material-ui/core';

import EditEvent from '../../containers/Event/Edit';
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

declare interface AdminEditEventPropsType extends RouteComponentProps {
  client: {
    query: (options: {}) => Promise<EventType>
  };
}

const AdminEditEventBase = (props: AdminEditEventPropsType & StandardProps) => {
  const { className, location } = props;
  const path = location.pathname;
  const eventId = path.substring(path.lastIndexOf('/') + 1);

  return (
    <>
      <section className={className}>
        <ContextSnackbar />
        <EditEvent eventId={eventId} />
      </section>
    </>
  );
};

const AdminEditEvent = styled(AdminEditEventBase)`
  margin: 85px 50px 50px;
  .header {
    text-align: left;
    margin: 0 0 20px;
  }
`;

// eslint-disable-next-line prettier/prettier
export default compose(withRouter)(memo(AdminEditEvent));

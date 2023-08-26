// @flow
import React, { memo } from 'react';
import styled from 'styled-components';

import OperationsTable from '../../containers/Tables/Ops/OperationsTable';

type OpsOperationsPropsType = {|
  className: string
|};
const OpsOperationsBase = (props: OpsOperationsPropsType) => {
  const { className } = props;

  return (
    <>
      <section className={className}>
        <OperationsTable />
      </section>
    </>
  );
};

const OpsOperations = styled(OpsOperationsBase)`
  margin: 85px 50px 50px;
  max-width: 1800px;
  min-width: 1130px;
  &__Header {
    &&& {
      text-align: left;
      margin: 0 20px 30px 0;
    }
  }
  &&& {
    .CalendarDay__blocked_out_of_range,
    .CalendarDay__blocked_out_of_range:active,
    .CalendarDay__blocked_out_of_range:hover,
    .CalendarDay__blocked_calendar,
    .CalendarDay__blocked_calendar:active,
    .CalendarDay__blocked_calendar:hover {
      background: none;
      border: none;
      color: #cacccd;
      text-decoration: line-through;
    }
  }
`;

export default memo<{}>(OpsOperations);

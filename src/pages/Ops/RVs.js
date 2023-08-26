// @flow
import React, { memo } from 'react';
import styled from 'styled-components';

import RVsTable from '../../containers/Tables/Ops/RVsTable';

type RVsPropsType = {|
  className: string
|};
const RVsBase = (props: RVsPropsType) => {
  const { className } = props;

  return (
    <>
      <section className={className}>
        <RVsTable />
      </section>
    </>
  );
};

const RVs = styled(RVsBase)`
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

export default memo<{}>(RVs);

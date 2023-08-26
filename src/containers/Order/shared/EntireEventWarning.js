import React from 'react';
import styled from 'styled-components';
import WarningIcon from '@material-ui/icons/Warning';

import { displayFlex } from '../../../styles/Mixins';

const EntireEventWarningBase = ({ className, width }) => {
  return (
    <div style={{ width: `${width}px`, alignItems: 'start' }} className={`${className}__warning-alert`}>
      <WarningIcon />
      <p>Entire event reservations are unavailable. At least one night for event is fully booked.</p>
    </div>
  );
};

export default styled(EntireEventWarningBase)`
  &__warning-alert {
    align-items: start;
    ${displayFlex}
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    margin-bottom: 20px;
    padding: 12px 14px 12px 12px;
    border: 2px solid #ff9f43;
    border-radius: 3px;
    p {
      margin: 0;
    }
    & svg {
      fill: #ff9f43;
      margin-right: 13px;
    }
  }
`;

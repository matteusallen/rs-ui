//@flow
import React from 'react';
import styled from 'styled-components';

import colors from '../../styles/Colors';

import Button from './index';

type ActionButtonPropsType = {|
  onClick: (e: SyntheticEvent<HTMLButtonElement>) => void,
  type: string
|};

const ActionButton = (props: ActionButtonPropsType) => {
  return <Button warn variant="contained" size="large" {...props} />;
};

export default styled(ActionButton)`
  &&& {
    align-items: center;
    border-color: ${colors.text.primary};
    color: ${colors.text.primary};
    height: 36px;
    letter-spacing: 0.7px;
    line-height: normal;
    justify-content: center;
    white-space: nowrap;
    width: auto;

    &:disabled {
      opacity: 0.2;
    }
  }
`;

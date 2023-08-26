//@flow
import React from 'react';
import styled from 'styled-components';

import Button from './index';

type CancelButtonPropsType = {|
  onClick: (e: SyntheticEvent<HTMLButtonElement>) => void,
  type: string
|};

const CancelButton = (props: CancelButtonPropsType) => {
  return <Button warn variant="contained" size="large" {...props} />;
};

export default styled(CancelButton)`
  &&& {
    align-items: center;
    height: 36px;
    letter-spacing: 0.7px;
    line-height: normal;
    justify-content: center;
    margin-left: 20px;
    white-space: nowrap;
    width: 225px;
  }
`;

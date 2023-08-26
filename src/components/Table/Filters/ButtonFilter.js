import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';

import colors from '../../../styles/Colors';

const ButtonFilterBase = props => {
  return <Button {...props} />;
};

const ButtonFilter = styled(ButtonFilterBase)`
  &.MuiButton-containedPrimary {
    background-color: ${colors.button.secondary.active};
    margin: 14px 0;
  }

  &.MuiButton-textPrimary {
    color: ${colors.secondary};
    margin: 10px 0;
  }
`;
export default ButtonFilter;

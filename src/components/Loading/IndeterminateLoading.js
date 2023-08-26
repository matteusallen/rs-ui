//@flow
import React from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';

import colors from '../../styles/Colors';

const IndeterminateLoading = ({ className, size = 40 }) => {
  return <CircularProgress className={className} size={size} color="primary" />;
};

export default styled(IndeterminateLoading)`
    .MuiCircularProgress-colorPrimary {
      color: ${colors.border.tertiary}
    }
  }
`;

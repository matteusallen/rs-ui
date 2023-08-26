// @flow
import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

import { headingFive } from '../../styles/Typography';

type TypographyPropsType = {|
  className: string,
  label: string
|};

const HeadingFiveBase = (props: TypographyPropsType) => {
  return (
    <Typography className={props.className} variant="h5">
      {props.label}
    </Typography>
  );
};

const HeadingFive = styled(HeadingFiveBase)`
  &&& {
    ${headingFive}
  }
`;

export default HeadingFive;

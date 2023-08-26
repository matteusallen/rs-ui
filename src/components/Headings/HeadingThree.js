// @flow
import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

import { headingThree } from '../../styles/Typography';

type TypographyPropsType = {|
  className: string,
  label: string
|};

const HeadingThreeBase = (props: TypographyPropsType) => {
  return (
    <Typography className={props.className} variant="h3">
      {props.label}
    </Typography>
  );
};

const HeadingThree = styled(HeadingThreeBase)`
  &&& {
    ${headingThree}
  }
`;

export default HeadingThree;

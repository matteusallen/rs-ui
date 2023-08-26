// @flow
import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

import { headingFour } from '../../styles/Typography';

type TypographyPropsType = {|
  className: string,
  label: string
|};

const HeadingFourBase = (props: TypographyPropsType) => {
  return (
    <Typography className={props.className} variant="h4">
      {props.label}
    </Typography>
  );
};

const HeadingFour = styled(HeadingFourBase)`
  &&& {
    ${headingFour}
  }
`;

export default HeadingFour;

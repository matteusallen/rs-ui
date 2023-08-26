// @flow
import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { headingOne } from '../../styles/Typography';

type TypographyPropsType = {|
  className: string,
  label: string
|};

const HeadingOneBase = (props: TypographyPropsType) => {
  return (
    <Typography className={props.className} variant="h1">
      {props.label}
    </Typography>
  );
};

const HeadingOne = styled(HeadingOneBase)`
  &&& {
    ${headingOne}
  }
`;

export default HeadingOne;

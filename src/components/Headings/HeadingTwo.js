// @flow
import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { compose, spacing, color, palette, styleFunctionSx } from '@material-ui/system';

const styleFunction = styleFunctionSx(compose(spacing, palette, color));
const TypographyComponent = styled(Typography)(styleFunction);

import { headingTwo } from '../../styles/Typography';

type TypographyPropsType = {|
  className: string,
  label: string,
  styles?: React.CSSProperties,
  title?: string
|};

const HeadingTwoBase = (props: TypographyPropsType) => {
  return (
    <TypographyComponent className={props.className} variant="h2" sx={props.styles ? props.styles : false} title={props.title ? props.title : false}>
      {props.label}
    </TypographyComponent>
  );
};

const HeadingTwo = styled(HeadingTwoBase)`
  &&& {
    ${headingTwo}
  }
`;

export default HeadingTwo;

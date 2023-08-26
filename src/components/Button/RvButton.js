//@flow
import React from 'react';
import { Button } from '@material-ui/core';
import { Clear, Add } from '@material-ui/icons';
import styled, { css } from 'styled-components';

import colors from '../../styles/Colors';

type StyledButtonPropsType = {|
  id: string | number,
  isActive: boolean,
  // eslint-disable-next-line flowtype/no-weak-types
  onClick: (rv: Object) => void,
  // eslint-disable-next-line flowtype/no-weak-types
  rv: Object
|};

// eslint-disable-next-line flowtype/no-weak-types
export default function RvButton(props: StyledButtonPropsType): any {
  const { id, onClick, rv, isActive, unavailable = false } = props;

  if (!rv) return <EmptyRv id={`rv-button-${id}-empty`} />;

  const Icon = isActive ? Clear : Add;
  return (
    <StyledButton id={`rv-button-${id}`} onClick={() => onClick(rv)} isActive={isActive} unavailable={unavailable} endIcon={<Icon />}>
      {rv.name}
    </StyledButton>
  );
}

const activeStyles = css`
  background-color: ${colors.secondary};
  color: ${colors.white};
`;

const unavailableStyles = css`
  background-color: #ee5253;
  color: ${colors.white};
`;

const inactiveStyles = css`
  background-color: transparent;
  color: ${colors.text.secondary};
  border: 1px solid ${colors.text.secondary};
  border-radius: 3px;
`;

const StyledButton = styled(Button)`
  &&&& {
    width: 126px;
    height: 36px;
    margin: 4px;
    p {
      margin: 0;
    }
    span {
      justify-content: space-between;
    }
    ${(props: StyledButtonPropsType) => {
      if (props.isActive) return activeStyles;
      return inactiveStyles;
    }}
    ${props => {
      if (props.unavailable) return unavailableStyles;
    }}
  }
`;

const EmptyRv = styled.div`
  background-color: transparent;
  border: 2px dotted ${colors.border.primary};
  border-radius: 3px;
  width: 126px;
  margin: 4px;
  height: 38px;
`;

import React from 'react';
import { Button } from '@material-ui/core';
import { Clear, Add } from '@material-ui/icons';
import styled, { css } from 'styled-components';

import colors from '../../styles/Colors';

export default function StallButton(props) {
  const { onClick, stall, isActive, id, unavailable = false } = props;

  if (!stall) return <EmptyStall id={`stall-button-${id}-empty`} />;

  const Icon = isActive ? Clear : Add;
  return (
    <StyledButton id={`stall-button-${id}`} onClick={() => onClick(stall)} isActive={isActive} unavailable={unavailable} endIcon={<Icon />}>
      {stall.name}
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
    ${props => {
      if (props.isActive) return activeStyles;
      return inactiveStyles;
    }}
    ${props => {
      if (props.unavailable) return unavailableStyles;
    }}
  }
`;

const EmptyStall = styled.div`
  background-color: transparent;
  border: 2px dotted ${colors.border.primary};
  border-radius: 3px;
  width: 126px;
  margin: 4px;
  height: 38px;
`;

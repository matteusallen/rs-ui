// @flow
import React from 'react';
import Button from '@material-ui/core/Button';
import styled, { css } from 'styled-components';
import { ButtonProps, CircularProgress } from '@material-ui/core';

import colors from '../../styles/Colors';
import { paragraphReg } from '../../styles/Typography';

const baseButtonStyles = css`
  & {
    width: 160px;
    height: 36px;
    border-radius: 3px;
    ${paragraphReg}

    .progress-spinner {
      color: inherit;
      position: relative;
      left: -10px;
    }
  }
`;

const primaryActive = css`
  &&& {
    color: ${colors.white};
    background-color: ${colors.button.primary.active};
    ${baseButtonStyles}
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.16), 0 2px 5px 0 rgba(0,0,0,0.26);
  }
`;

const primaryDisabled = css`
  &&& {
    background-color: ${colors.button.primary.disabled};
    color: ${colors.text.secondary};
    ${baseButtonStyles}
  }
`;

const secondaryActive = css`
  &&& {
    background-color: ${colors.button.secondary.active};
    color: ${colors.white};
    ${baseButtonStyles}
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.16), 0 2px 5px 0 rgba(0,0,0,0.26);
  }
`;

const secondaryDisabled = css`
  &&& {
    background-color: ${colors.button.primary.disabled};
    color: ${colors.text.secondary};
    ${baseButtonStyles}
  }
`;

const tertiaryActive = css`
  &&& {
    background-color: ${colors.white};
    color: ${colors.text.primary};
    border: solid 1px ${colors.text.primary};
    ${baseButtonStyles}
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.16), 0 2px 5px 0 rgba(0,0,0,0.26);
  }
`;

const tertiaryDisabled = css`
  ${tertiaryActive}
  border-radius: 0.5;
`;

const warnActive = css`
  &&& {
    background-color: transparent;
    color: ${colors.error.primary};
    border: solid 1px ${colors.error.primary};
    ${baseButtonStyles}
    box-shadow: none;
  }
`;
const warnDisabled = css`
  &&& {
    background-color: transparent;
    color: ${colors.border.primary};
    border: solid 1px ${colors.border.primary};
    ${baseButtonStyles}
    box-shadow: none;
  }
`;
type StyledButtonPropsType = {|
  disabled?: boolean,
  primary?: boolean,
  secondary?: boolean,
  tertiary?: boolean,
  warn?: boolean,
  ...ButtonProps
|};

const ButtonComponent = (props: StyledButtonPropsType) => {
  // prettier-ignore
  // eslint-disable-next-line
  const { isLoading, primary, secondary, tertiary, warn, children, ...rest } = props
  return (
    <Button {...rest}>
      {isLoading ? (
        <>
          <CircularProgress size={24} className="progress-spinner" />
          Loading...
        </>
      ) : (
        children
      )}
    </Button>
  );
};

const StyledButton = styled(ButtonComponent)`
  ${(props: StyledButtonPropsType): ?string => {
    if (props.primary) {
      return props.disabled ? primaryDisabled : primaryActive;
    }
    if (props.secondary) {
      return props.disabled ? secondaryDisabled : secondaryActive;
    }
    if (props.tertiary) {
      return props.disabled ? tertiaryDisabled : tertiaryActive;
    }
    if (props.warn) {
      return props.disabled ? warnDisabled : warnActive;
    }
  }}
`;

export default StyledButton;

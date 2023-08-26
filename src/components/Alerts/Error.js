// @flow
import React from 'react';
import styled from 'styled-components';

import colors from '../../styles/Colors';
import { paragraphReg } from '../../styles/Typography';
import { displayFlex } from '../../styles/Mixins';

type ErrorAlertPropsType = {|
  className: string,
  id?: string,
  label: string
|};

const ErrorAlertBase = (props: ErrorAlertPropsType) => (
  <div className={props.className} id={props.id || 'error-alert'}>
    {props.label}
  </div>
);

const Error = styled(ErrorAlertBase)`
  &&& {
    ${displayFlex}
    align-items: center;
    width: 100%;
    height: auto;
    margin: 20px 0 25px;
    padding: 12px 0 11px 20px;
    ${paragraphReg}
    font-size: 14px;
    text-align: left;
    background-color: ${colors.error.primary};
    color: ${colors.white};
    border-radius: 3px;

    &.forgot-password {
      max-width: 415px;
    }
  }
`;

export default Error;

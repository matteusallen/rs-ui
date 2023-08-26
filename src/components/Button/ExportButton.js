// @flow
import React from 'react';
import styled from 'styled-components';
import GetApp from '@material-ui/icons/GetApp';

import IndeterminateLoading from '../Loading/IndeterminateLoading';

import colors from '../../styles/Colors';

import Button from './index';

type ExportButtonPropsType = {|
  className: string,
  label: string,
  loading: boolean,
  onClick: () => void
|};

const ExportButtonBase = (props: ExportButtonPropsType) => (
  <Button secondary className={props.className} onClick={props.onClick} disabled={props.loading}>
    {props.loading ? (
      <IndeterminateLoading size={20} />
    ) : (
      <>
        <GetApp />
        {props.label}
      </>
    )}
  </Button>
);

const ExportButton = styled(ExportButtonBase)`
  &&& {
    height: 36px;
    width: 205px;
    background-color: ${colors.secondary.active};
    border-radius: 3px;
    margin: 20px 0 25px;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.16), 0 2px 5px 0 rgba(0, 0, 0, 0.26);
    align-self: flex-end;
  }
`;

export default ExportButton;

// @flow
import React from 'react';
import styled from 'styled-components';
import InfoIcon from '@material-ui/icons/Info';

import colors from '../../styles/Colors';
import { paragraphReg } from '../../styles/Typography';
import { displayFlex } from '../../styles/Mixins';

type NoticeAlertPropsType = {|
  className: string,
  label: string,
  hideIcon: boolean
|};

const NoticeAlertBase = (props: NoticeAlertPropsType) => (
  <div className={props.className}>
    {props.hideIcon ? null : <InfoIcon />}
    <span className="notice-label">{props.label}</span>
  </div>
);

const Notice = styled(NoticeAlertBase)`
  &&& {
    ${displayFlex}
    align-items: center;
    width: 100%;
    height: auto;
    margin: 20px 0 25px;
    padding: 12px 0 11px 15px;
    ${paragraphReg}
    font-size: 14px;
    text-align: left;
    background-color: ${colors.border.tertiary};
    color: ${colors.white};
    border-radius: 3px;
  }
  .notice-label {
    margin-left: 13px;
    font-size: 13px;
    line-height: 16px;
  }
`;

export default Notice;

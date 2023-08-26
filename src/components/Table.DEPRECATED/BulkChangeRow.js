// @flow
import React, { useState, memo } from 'react';
import styled from 'styled-components';

import { headingFive, paragraphReg } from '../../styles/Typography';
import colors from '../../styles/Colors';
import { displayFlex } from '../../styles/Mixins';
import OptionButton from '../Button/OptionButton';

import type { SelectedRowsType } from './index';

const EnhancedBulkChangeRow = (props: SelectedRowsType) => {
  const [assignmentsModalVisible, toggleAssignmentsModalVisible] = useState(false);
  const [customMessageModalVisible, toggleCustomMessageModal] = useState(false);
  return (
    <>
      <StyledContainerDiv>
        <StyledRowTitle>{props.numberSelected} SELECTED</StyledRowTitle>
        {props.view === 'admin' ? (
          <StyledContainerDiv className="btns-container">
            <SendStallAssignments onClick={() => toggleAssignmentsModalVisible(!assignmentsModalVisible)}>SEND STALL ASSIGNMENTS</SendStallAssignments>
            <SendCustomMessage onClick={() => toggleCustomMessageModal(!customMessageModalVisible)}>SEND CUSTOM MESSAGE</SendCustomMessage>
          </StyledContainerDiv>
        ) : (
          <StyledContainerDiv className="btns-container">
            <StyledStatusTitle>SET STATUS TO:</StyledStatusTitle>
            {props.options.map(option => (
              <OptionButton key={option.value} primary variant="contained" size="large" onClick={() => props.onClick(option.value)}>
                {option.value}
              </OptionButton>
            ))}
          </StyledContainerDiv>
        )}
      </StyledContainerDiv>
    </>
  );
};

const StyledContainerDiv = styled.div`
  ${displayFlex}
  flex: 1;
  flex-direction: row;
  justify-content: ${props => (props.isAdminView ? 'space-between' : 'flex-end')};
  align-self: center;
  align-items: center;
  height: 80px;
  background-color: ${colors.border.primary};

  &&& {
    .btns-container {
      padding-right: 14px;
    }
  }
`;

const StyledRowTitle = styled.div`
  ${headingFive}
  &&& {
    color: ${colors.text.primary};
    margin: 0px 40px 0px 30px;
    flex: 0.5;
    overflow: hidden;
    line-height: normal;
    text-align: left;
  }
`;

const StyledStatusTitle = styled.div`
  ${paragraphReg}
  &&& {
    flex: 1.5;
    color: ${colors.text.primary};
    margin: 0px 20px;
    text-align: right;
  }
`;

const SendStallAssignments = styled(OptionButton)`
  &&& {
    background-color: ${colors.button.secondary.active};
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.16), 0 2px 5px 0 rgba(0, 0, 0, 0.26);
    color: ${colors.white};
    font-size: 16px;
    max-width: 255px;
  }
`;

const SendCustomMessage = styled(OptionButton)`
  &&& {
    background-color: ${colors.button.secondary.active};
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.16), 0 2px 5px 0 rgba(0, 0, 0, 0.26);
    color: ${colors.white};
    font-size: 16px;
    max-width: 230px;
  }
`;

export default memo(EnhancedBulkChangeRow);

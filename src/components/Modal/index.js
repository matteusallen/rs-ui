import React from 'react';
import { Modal as MaterialModal, Card } from '@material-ui/core';
import styled from 'styled-components';

import { displayFlex } from '../../styles/Mixins';
import { headingFour } from '../../styles/Typography';

const Modal = props => {
  const { heading, ...modalProps } = props;
  return (
    <MaterialModal className="modal-charge" {...modalProps}>
      <ModalCard width={props.width}>
        <ModalContent>
          {heading && <H4>{heading}</H4>}
          {props.children}
        </ModalContent>
      </ModalCard>
    </MaterialModal>
  );
};

const ModalCard = styled(Card)`
  ${displayFlex}
  flex-direction: row;
  width: ${props => (props.width ? props.width : '100vw')};
  padding: 20px;
  max-width: 670px;
  height: auto;
  outline: none;
  left: 50%;
  top: 50%;
  position: absolute;
  -webkit-transform: translate3d(-50%, -50%, 0);
  -moz-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
  @media screen and (max-width: 601px) {
    width: 80vw;
    height: auto;
  }
`;

const ModalContent = styled.div`
  ${displayFlex}
  flex-direction: column;
  width: 100%;
`;

const H4 = styled.h4`
  ${headingFour}
  margin: 16px 0 0;
  @media screen and (max-width: 601px) {
    margin: 0 0 20px;
  }
`;

export default Modal;

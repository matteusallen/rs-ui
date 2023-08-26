import React, { useState, memo } from 'react';
import styled from 'styled-components';
import { compose } from 'recompose';

import Modal from '../../Modal';
import Button from '../../Button';
import Field from '../../Fields/TextField';
import { displayFlex } from '../../../styles/Mixins';
import { paragraphReg } from '../../../styles/Typography';
import colors from '../../../styles/Colors';
import withOrdersCustomSMS from '../../../mutations/OrderCustomSMS';

export const SendCustomMessageBase = props => {
  const { className, open, toggleCustomMessageModal, selectedRows, onError, onSuccess } = props;
  const [customMessage, setCustomMessage] = useState(null);

  const closeThisModal = () => {
    toggleCustomMessageModal(false);
  };

  const handleError = message => {
    // Send the error message to callback
    onError(message);
    closeThisModal();
  };

  const sendCustomMessage = async () => {
    try {
      const result = await props.customSMSWithOrders({
        body: customMessage,
        orderIds: selectedRows
      });

      const response = result.data && result.data.customSMSWithOrders;

      if (!response.success || response.error) {
        handleError('Something went wrong sending your text message. Please try again.');
      }
      onSuccess('Text message sent');
      closeThisModal();
    } catch (error) {
      handleError('Something went wrong sending your text message. Please try again.');
    }
  };

  const getNumberThatWillBeTextedLabel = count => {
    if (count) {
      return (
        <>
          This message will be texted to
          <strong>
            {' '}
            {count} selected {count > 1 ? 'renters' : 'renter'}
          </strong>
        </>
      );
    }
    return null;
  };

  return (
    <Modal heading={'SEND CUSTOM MESSAGE'} open={open} className={`${className}__custom-message-modal`} data-testid="send-custom-message-modal">
      <FlexWrapper>
        <CancelReservationDetailsWrapper>
          <FlexRow>
            <span className={`${className}__modal-cta`}>Enter Message</span>
            <span className={`${className}__modal-char-count`}>{customMessage ? 320 - customMessage.length : 320} Characters Remaining</span>
          </FlexRow>
          <Field
            type="text"
            multiline
            rows="4"
            variant="filled"
            name="customMessage"
            inputProps={{ maxLength: 320 }}
            className={`${className}__custom-message-field`}
            value={customMessage || ''}
            onChange={e => setCustomMessage(e.target.value)}
          />
          <p className={`${className}__renter-count`}>{getNumberThatWillBeTextedLabel(selectedRows.length || 0)}</p>
        </CancelReservationDetailsWrapper>

        <FlexButtonWrapper>
          <CancelButton secondary variant="contained" size="large" onClick={closeThisModal}>
            CANCEL
          </CancelButton>
          <FormButton primary variant="contained" size="large" onClick={sendCustomMessage} disabled={!customMessage || customMessage.length < 1}>
            SEND
          </FormButton>
        </FlexButtonWrapper>
      </FlexWrapper>
    </Modal>
  );
};

const SendCustomMessageModal = styled(SendCustomMessageBase)`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  height: 100%;
  justify-content: space-around;
  &&& {
    width: 400px;
    color: ${colors.text.primary};
  }
  &__custom-message-modal {
    ${displayFlex}
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    & {
      div[class^='MuiCard-root'],
      div[class*='MuiCard-root'] {
        height: auto;
      }
    }
    h4 {
      margin-top: 0;
      margin-bottom: 20px;
    }
  }
  &__modal-cta {
    font-size: 18px;
    font-family: 'IBMPlexSans-SemiBold';
    text-transform: uppercase;
  }
  &__modal-char-count {
    font-size: 11px;
    text-transform: uppercase;
  }
  &__custom-message-field {
    &&& {
      margin: 10px 0;
    }
  }
  &__renter-count {
    margin-top: 0;
    font-size: 16px;
  }
`;

const FlexWrapper = styled.div`
  ${displayFlex}
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  &:first-child {
    margin: 0 0 30px 0;
  }
  @media screen and (max-width: 601px) {
    ${displayFlex}
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    &:first-child {
      margin: 0 0 30px 0;
    }
  }
`;

const CancelReservationDetailsWrapper = styled.div`
  ${displayFlex}
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`;

const FlexRow = styled.div`
  ${displayFlex}
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 20px;
  &&& p {
    ${paragraphReg}
    margin: 0;
  }
  width: 100%;
`;

const FlexButtonWrapper = styled(FlexWrapper)`
  ${displayFlex}
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  align-self: flex-end;
  width: 100%;
  position: unset;
  margin-top: 20px;
  @media screen and (max-width: 601px) {
    ${displayFlex}
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 20px 0 0;
  }
`;

const FormButton = styled(Button)`
  &&& {
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.16), 0 2px 5px 0 rgba(0, 0, 0, 0.26);
    font-size: 16px;
    line-height: 0;
    width: auto;
    margin-left: ${props => (props.primary ? 20 : 0)}px;
    &&&:first-child {
      width: auto;
    }
  }
`;

const CancelButton = styled(FormButton)`
  &&& {
    color: ${colors.white};
    font-size: 16px;
    height: 36px;
    width: 228px;
  }
`;

export default compose(withOrdersCustomSMS)(memo(SendCustomMessageModal));

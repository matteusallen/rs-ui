// @flow
import React, { memo } from 'react';
import styled from 'styled-components';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Modal from '../../../../components/Modal';
import Button from '../../../../components/Button';
import { displayFlex } from '../../../../styles/Mixins';
import { paragraphReg } from '../../../../styles/Typography';
import colors from '../../../../styles/Colors';
import Radio from 'src/containers/Event/Shared/Radio.js';
import type PaymentType from './RefundModal';

type CancelReservationModalPropsType = {|
  className: string,
  close: () => void,
  handleSubmit: () => void,
  heading: string,
  open: boolean,
  refundToggle: (boolean | null) => void,
  cancelWithRefund?: boolean,
  order: {
    payments: PaymentType
  },
  groupOrder?: boolean,
  hasBeenPaid: boolean
|};

export const CancelReservationModalBase = ({
  className,
  heading,
  open,
  close,
  handleSubmit,
  refundToggle,
  cancelWithRefund,
  groupOrder,
  order,
  hasBeenPaid
}: CancelReservationModalPropsType) => {
  const totalPaidMinusRefunds = Math.abs(Number(order.payments?.reduce((acc, curr) => (acc += curr.amount), 0)));
  const cancelOrder = async () => {
    handleSubmit();
  };

  return (
    <Modal heading={heading} open={open} className={`${className}__cancel-reservation-modal`}>
      <FlexWrapper>
        <CancelReservationDetailsWrapper>
          <FlexColumn>
            {groupOrder && !hasBeenPaid ? (
              <>
                <p>Are you sure want to cancel this entire reservation</p>
                <p>This reservation will be removed from the group bill.</p>
              </>
            ) : (
              <p>Select whether you want to issue a refund for this reservation when it is cancelled.</p>
            )}
          </FlexColumn>
        </CancelReservationDetailsWrapper>
        <RadioGroup name="refundOptions">
          {groupOrder && !hasBeenPaid ? (
            <>{refundToggle(false)}</>
          ) : (
            <>
              <FormControlLabel
                value="noRefund"
                control={<Radio onClick={() => refundToggle(false)} />}
                label={`Only cancel the reservation`}
                disabled={false}
              />
              <FormControlLabel
                value="withRefund"
                control={<Radio onClick={() => refundToggle(true)} />}
                label={`Cancel AND refund the reservation`}
                disabled={totalPaidMinusRefunds <= 0}
              />
            </>
          )}
        </RadioGroup>
        <FlexButtonWrapper>
          <FormButton
            secondary
            variant="contained"
            size="large"
            onClick={() => {
              refundToggle(null);
              close();
            }}>
            KEEP RESERVATION
          </FormButton>
          <CancelButton disabled={cancelWithRefund === null} deleteReservation secondary variant="contained" size="large" onClick={cancelOrder}>
            CANCEL RESERVATION
          </CancelButton>
        </FlexButtonWrapper>
      </FlexWrapper>
    </Modal>
  );
};

const CancelReservationModal = styled(CancelReservationModalBase)`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  height: 100%;
  justify-content: space-around;
  &__progress-spinner {
    &&& {
      bottom: 4%;
      color: ${colors.primary};
      left: 77%;
      position: absolute;
    }
  }
  &__cancel-reservation-modal {
    ${displayFlex}
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    & {
      div[class^='MuiCard-root'],
      div[class*='MuiCard-root'] {
        height: auto;
        width: 443px;
      }
    }
    h4 {
      margin-top: 0;
      margin-bottom: 20px;
    }
  }
`;

const FlexWrapper = styled.div`
  ${displayFlex}
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
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
`;

const FlexColumn = styled.div`
  ${displayFlex}
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  &&& p {
    ${paragraphReg}
    margin: 0;
  }
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
    line-height: 0;
    width: 175px;
    margin-left: ${props => (props.primary ? 20 : 0)}px;
    &&&:first-child {
      width: auto;
    }
  }
`;

const CancelButton = styled(Button)`
  &&& {
    width: 192px;
    height: 36px;
    margin-left: 20px;
    justify-content: center;
    align-items: center;
    background-color: ${colors.error.primary};
    letter-spacing: 0.7px;
    line-height: normal;
    white-space: nowrap;

    &:disabled {
      background-color: ${colors.button.primary.disabled};
    }
  }
`;

export default memo<{}>(CancelReservationModal);

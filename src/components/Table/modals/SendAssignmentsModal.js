// @flow
import React, { memo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled from 'styled-components';
import { compose } from 'recompose';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import type { AssignmentsSMSInputType } from '../../../mutations/SendReservationAssignmentsSMS';

import { RESERVATION_ASSIGNMENT_COUNTS_SMS } from '../../../queries/Admin/ReservationAssignmentCountsSMS';
import Modal from '../../Modal';
import Button from '../../Button';
import { displayFlex } from '../../../styles/Mixins';
import { paragraphReg } from '../../../styles/Typography';
import colors from '../../../styles/Colors';
import withReservationDetailsSMS from '../../../mutations/SendReservationAssignmentsSMS';

export type SMSCountReturnType = {|
  assignmentsAlreadySent: number,
  noSpacesAssigned: number,
  ordersToBeSentAssignment: Array<string | number>,
  productTypeNotPurchased: number
|};

export type AssignmentModalPropsType = {|
  className: string,
  onError: (message: string) => void,
  onSuccess: (message: string) => void,
  open: boolean,
  productType: 'stalls' | 'rvs',
  reservationDetailsSMS: (arg: AssignmentsSMSInputType) => void,
  selectedRows: Array<number | string>,
  toggleAssignmentsModalVisible: (arg: boolean) => void
|};

const FETCH_ERR_MESSAGE = 'Something went wrong getting assignment information. Please refresh and try again.';

const SEND_ERR_MESSAGE = 'Something went wrong texting assignment information. Please try again.';

const SUCCESS_MESSAGE_STALLS = 'Stall assignment information has been texted';
const SUCCESS_MESSAGE_RVS = 'RV Assignment information has been texted';

const getLoadingFeedback = className => {
  return <p className={`${className}__assignments-modal-text`}>Loading...</p>;
};

const getRenterLabel = count => {
  return count > 1 ? 'renters' : 'renter';
};

const getProductLabel = (isStalls, count) => {
  if (isStalls) {
    return count > 1 ? 'stalls' : 'stall';
  }
  return count > 1 ? 'RV spots' : 'RV spot';
};

const getNumberThatWillBeTextedLabel = (isStalls, numberRequiringAssignment) => {
  if (numberRequiringAssignment) {
    return (
      <>
        {isStalls ? 'Stall' : 'RV'} assignments will be sent to:
        <strong>
          {' '}
          {numberRequiringAssignment} {getRenterLabel(numberRequiringAssignment)}{' '}
        </strong>
      </>
    );
  }
  return `No ${isStalls ? 'stall' : 'RV spot'} assignments will be sent`;
};

const getProductSingularLabel = isStalls => {
  return getProductLabel(isStalls, 1);
};

const getProductPluralLabel = isStalls => {
  return getProductLabel(isStalls, 2);
};

// Single renter example: 1 renter has already received their current stall/rv assignments.
// Multiple renter example: 2 renters have already received their current stall/rv assignments.
const getAlreadyReceivedLabel = (isStalls, numberAlreadySent: number) => {
  if (numberAlreadySent > 0) {
    return (
      <div className="count-section">{`${numberAlreadySent} ${getRenterLabel(numberAlreadySent)} ${
        numberAlreadySent > 1 ? 'have' : 'has'
      } already received their current ${getProductSingularLabel(isStalls)} ${numberAlreadySent === 1 ? 'assignment.' : 'assignments.'}`}</div>
    );
  }
  return null;
};

const getNoSpacesAssignedLabel = (isStalls, ordersWithoutAssignments) => {
  if (ordersWithoutAssignments > 0) {
    return (
      <div className="count-section">
        {`${ordersWithoutAssignments} ${getRenterLabel(ordersWithoutAssignments)} ${
          ordersWithoutAssignments > 1 ? 'do' : 'does'
        } not have ${getProductPluralLabel(isStalls)} assigned.`}
      </div>
    );
  }
  return null;
};

// Example: 4 renters did not reserve stalls/rvs.
const getNoReservationsOfTypeRequestedLabel = (isStalls, numberWithoutReservationsOfType: number) => {
  if (numberWithoutReservationsOfType > 0) {
    return (
      <div className="count-section">
        {`${numberWithoutReservationsOfType} ${getRenterLabel(numberWithoutReservationsOfType)} did not reserve ${getProductPluralLabel(isStalls)}.`}
      </div>
    );
  }
  return null;
};

export const SendAssignmentsBase = (props: AssignmentModalPropsType) => {
  const { className, open, toggleAssignmentsModalVisible, selectedRows, productType, onError, onSuccess } = props;

  const isStalls = productType === 'stalls';

  const closeThisModal = () => {
    toggleAssignmentsModalVisible(false);
  };

  const handleError = (message: string) => {
    // Send the error message to callback
    onError(message);
    closeThisModal();
  };

  const { loading, error, data } = useQuery(RESERVATION_ASSIGNMENT_COUNTS_SMS, {
    variables: {
      input: { orderIds: selectedRows, reservationType: productType }
    }
  });

  if (loading) {
    return 'Loading...';
  }

  if (error) {
    handleError(FETCH_ERR_MESSAGE);
  }

  const { ordersToBeSentAssignment, assignmentsAlreadySent, productTypeNotPurchased, noSpacesAssigned } = data.reservationAssignmentSMSCounts;

  const sendAssignments = async () => {
    try {
      const result = await props.reservationDetailsSMS({
        orderIds: selectedRows,
        reservationType: productType
      });
      if (result && !result.data.reservationDetailsSMS.success) {
        handleError(SEND_ERR_MESSAGE);
      }
      onSuccess(isStalls ? SUCCESS_MESSAGE_STALLS : SUCCESS_MESSAGE_RVS);
      closeThisModal();
    } catch (error) {
      handleError(SEND_ERR_MESSAGE);
    }
  };

  return (
    <Modal
      heading={isStalls ? 'SEND STALL ASSIGNMENTS' : 'SEND RV SPOT ASSIGNMENTS'}
      open={open}
      className={`${className}__send-assignments-modal`}
      width={'400px'}
      data-testid="send-assignments-modal">
      <FlexWrapper>
        <SendAssignmentsModalWrapper>
          <FlexRow>
            {loading && getLoadingFeedback(className)}
            <div className={`${className}__assignments-modal-text`}>{getNumberThatWillBeTextedLabel(isStalls, ordersToBeSentAssignment.length)}</div>
          </FlexRow>

          {(assignmentsAlreadySent > 0 || productTypeNotPurchased > 0 || noSpacesAssigned > 0) && (
            <FlexRow>
              <div className={`${className}__assignments-modal-not-sending-content`}>
                <div className={`${className}__not-sending-title`}>
                  <InfoOutlinedIcon style={{ marginRight: 5 }} />
                  <span>{"Why won't some renters be texted?"}</span>
                </div>

                {getAlreadyReceivedLabel(isStalls, assignmentsAlreadySent)}

                {getNoSpacesAssignedLabel(isStalls, noSpacesAssigned)}

                {getNoReservationsOfTypeRequestedLabel(isStalls, productTypeNotPurchased)}
              </div>
            </FlexRow>
          )}
        </SendAssignmentsModalWrapper>

        <FlexButtonWrapper>
          <CancelButton secondary variant="contained" size="large" onClick={closeThisModal}>
            CANCEL
          </CancelButton>
          <FormButton primary variant="contained" size="large" onClick={sendAssignments} disabled={error || ordersToBeSentAssignment.length < 1}>
            SEND
          </FormButton>
        </FlexButtonWrapper>
      </FlexWrapper>
    </Modal>
  );
};

const SendAssignmentsModal = styled(SendAssignmentsBase)`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  height: 100%;
  justify-content: space-around;
  &&& {
    width: 400px;
  }
  &__progress-spinner {
    &&& {
      bottom: 4%;
      color: ${colors.primary};
      left: 77%;
      position: absolute;
    }
  }
  &__send-assignments-modal {
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
  &__assignments-modal-text {
    font-size: 16px;
    padding-bottom: 20px;
    &&& {
      width: 100%;
    }
    &.error {
      padding: 0;
    }
  }
  &__assignments-modal-not-sending-content {
    background-color: #eaf2fb;
    border-radius: 5px;
    padding: 10px;
    &&& p {
      font-size: 13px !important;
      padding: 10px 5px;
    }
    &&& {
      width: 100%;
    }

    .count-section {
      margin: 3px 0 5px 8px;
    }
  }
  &__not-sending-title {
    &&& {
      ${displayFlex}
      width: 100%;
      height: auto;
      ${paragraphReg}
      font-size: 14px;
      letter-spacing: 0.5px;
      text-align: left;
      font-weight: 900;
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

const SendAssignmentsModalWrapper = styled.div`
  ${displayFlex}
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`;

const FlexRow = styled.div`
  ${displayFlex}
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
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

export default compose(withReservationDetailsSMS)(memo(SendAssignmentsModal));

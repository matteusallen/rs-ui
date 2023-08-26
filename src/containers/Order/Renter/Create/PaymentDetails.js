import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Checkbox } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import CheckIcon from '@material-ui/icons/Check';
import { useFormikContext, Field } from 'formik';
import { useMutation } from '@apollo/react-hooks';
import WarningModal from '../../../../components/WarningModal/WarningModal';
import PaymentSection from '../../shared/PaymentSection';
import FormCard from '../../../../components/Cards/FormCard';
import { HeadingTwo } from '../../../../components/Headings';
import OSTooltip from '../../../../components/Tooltip/OSTooltip';
import { FormikField } from '../../../../components/Fields';
import colors from '../../../../styles/Colors';
import { VALIDATE_CODE } from '../../../../mutations/ValidateCode';
import { GROUP_BY_UNIQUE_TEXT } from '../../../../mutations/GetGroupByUniqueText';

const ERROR_MESSAGE = 'Invalid group code; please check and try again';

function PaymentDetailsBase(props) {
  const TOOLTIP_TEXT =
    props.isGroupCodeRequired === false
      ? 'Select box to settle your payment later. Credit/Debit card info needs to be saved to use this feature.'
      : 'Select box if you are approved by the Group Leader or Venue Admin to defer your payment to the group bill';
  const [newCard, setNewCard] = useState(false);
  const [delayPayment, setDelayPayment] = useState(false);
  const [code, setCode] = useState(null);
  const [groupSelected, setGroupSelected] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [modalShown, setModalShown] = useState(false);
  const { setFieldValue } = useFormikContext();
  const [validateCode, { data }] = useMutation(VALIDATE_CODE);
  const [groupUniqueText, { data: groupData }] = useMutation(GROUP_BY_UNIQUE_TEXT);

  useEffect(() => {
    if (data) {
      if (!data.group) {
        setGroupSelected(null);
        return setErrorCode(ERROR_MESSAGE);
      }

      setGroupSelected(data.group);
      setCode(code);
      setErrorCode(null);
    }
  }, [data]);

  useEffect(() => {
    if (groupData) {
      if (!groupData.group) {
        setGroupSelected(null);
        return setErrorCode(ERROR_MESSAGE);
      }

      setGroupSelected(groupData.group);
      setCode(groupData.group.code);
      setErrorCode(null);
    }
  }, [groupData]);

  useEffect(() => {
    if (delayPayment) {
      clearGroupInformation();
      if (props.isGroupCodeRequired === false) {
        groupUniqueText({
          variables: {
            input: {
              name: props.event.name,
              venueId: props.event.venue.id
            }
          }
        });
      } else {
        return clearCardInformation();
      }
    }

    setGroupSelected(null);
  }, [delayPayment]);

  useEffect(() => {
    if (groupSelected) {
      setGroupInformation();
    } else {
      clearGroupInformation();
      clearCardInformation();
    }
  }, [groupSelected, code]);

  const clearCardInformation = () => {
    setFieldValue('ccInformation.selectedCard', null);
    setFieldValue('ccInformation.selectedCardBrand', null);
    setFieldValue('ccInformation.country', null);
  };

  const setGroupInformation = () => {
    setFieldValue('group.id', groupSelected.id);
    setFieldValue('group.code', code);
  };

  const clearGroupInformation = () => {
    setFieldValue('group', null);
  };

  const handleDelayPayment = () => {
    if (delayPayment) setDelayPayment(!delayPayment);
    else if (modalShown === false && props.isGroupCodeRequired === false) {
      setShowDelayModal(true);
    } else if (props.isGroupCodeRequired) {
      setDelayPayment(true);
      setFieldValue('ccInformation', {
        nameOnCard: null,
        saveCard: false,
        selectedCard: null,
        zipCode: null,
        useCard: true,
        country: ''
      });
    } else {
      setDelayPayment(true);
      setFieldValue('ccInformation.saveCard', true);
    }
  };

  const handleValidateCode = code => {
    setCode(code);
    validateCode({
      variables: {
        input: {
          code
        }
      }
    });
  };

  const handleOnGoBack = () => setShowDelayModal(false);

  const handleOnAgreeDelayed = () => {
    setDelayPayment(true);
    setModalShown(true);
    setFieldValue('ccInformation.saveCard', true);
    setShowDelayModal(false);
  };

  return (
    <FormCard dataTestId="renter_payment_details">
      <div className={`${props.className}__containerDiv`}>
        <div className={`${props.className}__headerDiv`}>
          <HeadingTwo label={`Payment Details`} />
        </div>
        <WarningModal
          isOpen={showDelayModal}
          onCancel={handleOnGoBack}
          continueLabel="AGREE"
          cancelLabel="GO BACK"
          header=""
          hideWarningIcon={true}
          text="In order to delay your payment, your credit card information will be saved. You won't be charged until later."
          onContinue={handleOnAgreeDelayed}
        />
        {(!delayPayment || (delayPayment && props.isGroupCodeRequired === false)) && <PaymentSection {...props} setNewCard={setNewCard} newCard={newCard} />}

        {props.isGroupCodeRequired != null && (
          <div className={`${props.className}__group-bill`}>
            <span>Pay Later</span>
            <StyleCheckbox data-testid="group-code-checkbox" onChange={handleDelayPayment} color="primary" checked={delayPayment} />
            <OSTooltip arrow title={TOOLTIP_TEXT} placement="top">
              <InfoIcon />
            </OSTooltip>
          </div>
        )}

        {delayPayment && props.isGroupCodeRequired && (
          <div className={`${props.className}__group-code`}>
            <p>Enter the unique group code tie to your payment to that group</p>
            <div className={`${props.className}__group-code-field`}>
              <Field
                data-testid="group-code-input"
                error={errorCode}
                helperText={errorCode}
                component={FormikField}
                label="GROUP CODE"
                name={'group.code'}
                type="text"
                variant="filled"
                required
                onChange={e => handleValidateCode(e.target.value)}
                style={{ width: '63%' }}
              />
            </div>
            {groupSelected && (
              <div data-testid="group-code-success" className={`${props.className}__group-code-field-confirm`}>
                <p>Your payment is connected to:</p>
                <p>
                  {groupSelected.name} <StyledCheckIcon />
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </FormCard>
  );
}

const PaymentDetails = styled(PaymentDetailsBase)`
  &__containerDiv {
    text-align: center;
  }

  &__headerDiv {
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__group-bill {
    display: flex;
    align-items: center;

    span {
      color: ${colors.text.primary};
      font-size: 18px;
    }
  }

  &__group-code {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    p {
      margin-bottom: 0;
    }

    &-field {
      display: flex;
      align-items: end;
      width: 100%;

      &&& div {
        margin-bottom: 0;
        margin-right: 10px;
      }

      &-confirm {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        &&& p:nth-child(1) {
          text-align: initial;
          font-size: 10px;
          width: 200px;
          line-height: 10px;
        }

        &&& p:nth-child(2) {
          margin-top: 0;
          text-transform: uppercase;
          display: flex;
        }
      }
    }
  }
`;

const InfoIcon = styled(ErrorIcon)`
  &&& {
    cursor: pointer;
  }
`;

const StyledCheckIcon = styled(CheckIcon)`
  &&& {
    color: ${colors.primary};
    margin-left: 5px;
  }
`;

const StyleCheckbox = styled(Checkbox)`
  &&& {
    span svg {
      color: ${colors.secondary};
    }
  }
`;

export default PaymentDetails;

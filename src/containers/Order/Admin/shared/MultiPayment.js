// @flow
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Field, useFormikContext } from 'formik';
import Tooltip from '@material-ui/core/Tooltip';
import ErrorIcon from '@material-ui/icons/Error';

import { FormikField } from '../../../../components/Fields';
import { CancelButtonAlt as ConfirmButton } from '../../../../components/Button/CancelLink';
import type { UserType } from '../../../../pages/Admin/Users';
import PaymentSection from '../../shared/PaymentSection';
import ChargePaymentSection from '../../shared/ChargePaymentSection';

const DOLLAR_SIGN = '$';
const CASH_ERROR = 'Amount must be equal to or greater than $1';
const CARD_ERROR = 'The amount entered is less than mandatory credit transaction fees of';

type MultiPaymentProps = {
  total: number,
  paymentOptions: { card: boolean, cash: boolean },
  user: UserType,
  setNewCard: (value: boolean) => void,
  newCard: boolean,
  fees: number,
  editView: boolean,
  groupOrderLast4: string
};

export function MultiPayment({ total, paymentOptions, user, setNewCard, newCard, fees = 0, editView = false, groupOrderLast4 }: MultiPaymentProps) {
  const { values, setFieldValue } = useFormikContext();

  const cardValue = values.multipayment?.totalToCard;
  const cashValue = values.multipayment?.totalToCash;

  const [showConfirmBtn, setShowConfirmBtn] = useState(false);
  const [amountInCash, setAmountInCash] = useState(cashValue ? `$${cashValue}` : null);
  const [amountInCard, setAmountInCard] = useState(cardValue ? `$${cardValue}` : null);
  const [cashError, setCashError] = useState(null);
  const [cardError, setCardError] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (!amountInCard) {
      clearCardInformation();
    }
  }, [values.ccInformation.selectedCard, amountInCard]);

  useEffect(() => {
    if (amountInCash) {
      const [, totalInCash] = amountInCash.split(DOLLAR_SIGN);

      if (totalInCash !== '' && totalInCash < 1) {
        setCashError(CASH_ERROR);
        clearCardInformation();
        setAmountInCard('');
      }
    }
  }, [amountInCash]);

  const clearCardInformation = () => {
    setFieldValue('ccInformation.selectedCard', null);
    setFieldValue('ccInformation.selectedCardBrand', null);
    setFieldValue('ccInformation.country', null);
  };

  const handleCalculateRemnant = () => {
    const [, totalInCash] = amountInCash.split(DOLLAR_SIGN);

    if (totalInCash && totalInCash >= 1) {
      const totalInCard = (total - totalInCash).toFixed(2);

      if (+totalInCard < +fees) {
        setCardError(`${CARD_ERROR} $${fees}`);
        clearCardInformation();
      } else {
        setCardError(null);
      }

      setAmountInCard(`$${totalInCard}`);
      setFieldValue('multipayment.totalToCard', totalInCard);
      handleShowConfirmBtn(false);
    } else {
      setAmountInCard('');
      clearCardInformation();
    }
  };

  const handleAmountInCash = value => {
    const [, totalInCash] = value.split(DOLLAR_SIGN);

    if (+totalInCash <= total) {
      setAmountInCash(value);
      setFieldValue('multipayment.totalToCash', totalInCash);
      setCashError(null);
    }
  };

  const handleShowConfirmBtn = value => setShowConfirmBtn(value);

  return (
    <div>
      {paymentOptions && paymentOptions.card && paymentOptions.cash && (
        <>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}>
            <Title>Cash or Check Amount</Title>
            <Field
              error={!!cashError}
              helperText={cashError}
              component={FormikField}
              label="AMOUNT IN CASH OR CHECK"
              type="text"
              multiline
              rows="1"
              variant="filled"
              name="cashOrCheck"
              inputProps={{ maxLength: 250 }}
              value={amountInCash}
              onFocus={() => {
                handleAmountInCash(`${amountInCash ? amountInCash : DOLLAR_SIGN}`);
                handleShowConfirmBtn(true);
              }}
              onChange={e => handleAmountInCash(e.target.value)}
            />
            {showConfirmBtn && (
              <ConfirmButton style={{ alignSelf: 'end' }} secondary variant="contained" size="large" onClick={handleCalculateRemnant}>
                CONFIRM
              </ConfirmButton>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Title>Credit Card Amount</Title>
              <Tooltip open={showTooltip} title="transaction fees will be applied to the credit card" placement="right">
                <InfoIcon
                  onMouseOver={() => setShowTooltip(true)}
                  onFocus={() => setShowTooltip(true)}
                  onBlur={() => setShowTooltip(true)}
                  onMouseOut={() => setShowTooltip(false)}
                  onMouseLeave={() => setShowTooltip(false)}
                />
              </Tooltip>
            </div>
            <Field
              error={!!cardError}
              helperText={cardError}
              component={FormikField}
              label="AMOUNT TO CHARGE CREDIT CARD"
              type="text"
              multiline
              rows="1"
              variant="filled"
              name="card"
              inputProps={{ maxLength: 250 }}
              value={amountInCard}
              InputLabelProps={{ shrink: amountInCard ? true : false }}
            />
            {editView ? (
              <ChargePaymentSection user={user} setNewCard={setNewCard} newCard={newCard} fees={fees} groupOrderLast4={groupOrderLast4} />
            ) : (
              <PaymentSection user={user} setNewCard={setNewCard} newCard={newCard} fees={fees} groupOrderLast4={groupOrderLast4} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

const Title = styled.p`
  font-family: 'IBMPlexSans-Bold';
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  margin-top: 20px;
`;

const InfoIcon = styled(ErrorIcon)`
  &&& {
    margin-top: 20px;
    margin-left: 10px;
    font-size: 20px;
    cursor: pointer;
  }
`;

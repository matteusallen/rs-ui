// @flow
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLazyQuery } from 'react-apollo';
import { Grid, RadioGroup, CircularProgress } from '@material-ui/core';
import { Form, Formik } from 'formik';
import { CardNumberElement, useStripe, useElements } from '@stripe/react-stripe-js';

import { ORDER_EDIT_COSTS } from '../../../../queries/OrderEditCosts';
import Modal from '../../../../components/Modal/ChargeModal';
import Button from '../../../../components/Button';
import WarningModal from '../../../../components/WarningModal/WarningModal';
import { displayFlex } from '../../../../styles/Mixins';
import colors from '../../../../styles/Colors';
import type { OrderType } from 'src/queries/Admin/OrderForOrderTableDetail.js';
import { createStripeToken } from '../../shared/sharedMethods';
import PaymentOptions from '../shared/PaymentOptions';
import { MultiPayment } from '../shared/MultiPayment';
import PaymentSection from '../../shared/ChargePaymentSection';

type ChargeModalBasePropsType = {|
  className?: string,
  onClose: () => void,
  open: boolean,
  order: OrderType,
  currentCharges?: number,
  handleSubmit?: (paymentDetails: {}, refundPayment: boolean, isGroupOrder: boolean, noRefund: {}) => void,
  reservationAdded: boolean,
  paymentOptions: { card: boolean, cash: boolean },
  setPaymentOptions: (value: bolean) => void
|};

export const TotalWithFees = total => (
  <div>
    <p className="_total-charge-text">
      Total including fees: <strong>{total.total}</strong>
    </p>
  </div>
);

export const ChargeModalBase = (props: ChargeModalBasePropsType) => {
  const { className = '', onClose, open, order = {}, currentCharges = 0, handleSubmit, reservationAdded, paymentOptions, setPaymentOptions } = props;
  const [getFees, { data: costFees }] = useLazyQuery(ORDER_EDIT_COSTS);
  const [fees, setCostFees] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const elements = useElements();
  const stripe = useStripe();

  const [newCard, setNewCard] = useState(false);

  useEffect(() => {
    getFees({
      variables: {
        input: {
          orderId: +order.id,
          isNonUSCard: false,
          useCard: props.paymentOptions.card,
          amount: currentCharges,
          reservationAdded: reservationAdded
        }
      }
    });
    if (costFees) {
      setCostFees(costFees.orderCostsFee.fee);
    }
  }, [currentCharges, costFees, props.paymentOptions.card]);

  const formatPrice = price => {
    if (price < 0) return `-$${Math.abs(price).toFixed(2)}`;
    return `$${price.toFixed(2)}`;
  };

  const buildStripeToken = async values => {
    const cardInfo = {
      card: elements.getElement(CardNumberElement),
      name: values.nameOnCard,
      zip: values.zipCode
    };
    const stripeToken = await createStripeToken(stripe, cardInfo);
    return stripeToken;
  };

  const handleOnClose = () => {
    if (paymentOptions.card && paymentOptions.cash) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  };

  const handleOnCloseDiscard = () => setShowDiscardModal(false);

  const handleOnContinueDiscard = () => {
    setShowDiscardModal(false);
    setPaymentOptions({ card: true });
    onClose();
  };

  const totalFees = fees.toFixed(2);

  return (
    <>
      <Modal heading={'Payment Method'} open={open} className={`${className}__charge-modal`}>
        <Formik
          onSubmit={async ({ ccInformation, adminId, multipayment }) => {
            try {
              setLoading(true);
              multipayment.isMultipayment = (paymentOptions.card && paymentOptions.cash) || false;
              if (ccInformation.selectedCard) {
                const paymentInput = {
                  token: '',
                  description: 'payment description',
                  saveCard: ccInformation.saveCard,
                  selectedCard: ccInformation.selectedCard,
                  useCard: ccInformation.useCard,
                  isNonUSCard: false,
                  adminId
                };

                await handleSubmit(null, false, ccInformation.groupBill, null, paymentInput, multipayment);
                onClose();
                setLoading(false);
              } else if (ccInformation.useCard && !ccInformation.selectedCard) {
                const stripeToken = await buildStripeToken(ccInformation);
                const paymentInput = {
                  token: stripeToken ? stripeToken.token.id : '',
                  description: 'payment description',
                  saveCard: ccInformation.saveCard,
                  selectedCard: stripeToken.token.card.last4,
                  useCard: ccInformation.useCard,
                  isNonUSCard: false,
                  adminId
                };
                await handleSubmit(null, false, ccInformation.groupBill, null, paymentInput, multipayment);
                onClose();
                setLoading(false);
              } else {
                const paymentInput = {
                  token: '',
                  description: 'payment description',
                  saveCard: ccInformation.saveCard,
                  selectedCard: null,
                  useCard: ccInformation.useCard,
                  isNonUSCard: false,
                  adminId
                };
                await handleSubmit(null, false, ccInformation.groupBill, null, paymentInput, multipayment);
                onClose();
                setLoading(false);
              }
            } catch (error) {
              setLoading(false);
            }
          }}
          initialValues={{
            ccInformation: {
              nameOnCard: null,
              saveCard: false,
              selectedCard: null,
              zipCode: null,
              useCard: true,
              stripeToken: null,
              groupBill: false,
              selectedCardBrand: ''
            },
            adminId: null,
            renterInformation: { ...order.user, savedCreditCards: [] },
            deferredGroupId: null,
            event: order.event,
            multipayment: {
              isMultipayment: false
            }
          }}>
          {({ dirty, isValid, values }) => (
            <Form>
              <RadioGroup id="payment-details-radio-group" aria-label="reservationType" name="reservationType" className={`${props.className}__radio-group`}>
                <Grid container spacing={2}>
                  <PaymentOptions paymentOptions={paymentOptions} setPaymentOptions={setPaymentOptions} className={props.className} />
                </Grid>
              </RadioGroup>
              {props.paymentOptions.card && !props.paymentOptions.cash && (
                <PaymentSection
                  {...props}
                  user={values.renterInformation}
                  setNewCard={setNewCard}
                  newCard={newCard}
                  fees={fees}
                  editView
                  groupOrderLast4={order.groupOrderLast4}
                />
              )}
              {props.paymentOptions.cash && !props.paymentOptions.card && <TotalWithFees total={formatPrice(currentCharges + fees)} />}
              {props.paymentOptions && props.paymentOptions.card && props.paymentOptions.cash && (
                <>
                  <TotalWithFees total={formatPrice(currentCharges + fees)} />
                  <MultiPayment
                    total={currentCharges + fees}
                    paymentOptions={props.paymentOptions}
                    user={values.renterInformation}
                    setNewCard={setNewCard}
                    newCard={newCard}
                    fees={totalFees}
                    editView
                    groupOrderLast4={order.groupOrderLast4}
                  />
                </>
              )}
              <FlexButtonWrapper>
                <FormButton secondary variant="contained" size="large" onClick={handleOnClose}>
                  GO BACK
                </FormButton>
                <FormButton
                  primary
                  className={`${className}__charge-button`}
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={isLoading || !dirty || !isValid}>
                  CHARGE
                  {isLoading && <CircularProgress size={24} className="progress-spinner" />}
                </FormButton>
              </FlexButtonWrapper>
            </Form>
          )}
        </Formik>
      </Modal>
      <WarningModal
        isOpen={showDiscardModal}
        handleClose={handleOnCloseDiscard}
        onCancel={handleOnCloseDiscard}
        continueLabel="CONTINUE"
        header="ARE YOU SURE?"
        text="You will loose the data you have input so far."
        onContinue={handleOnContinueDiscard}
      />
    </>
  );
};

const ChargeModal = styled(ChargeModalBase)`
  display: flex;
  flex-direction: column;
  height: auto;
  justify-content: space-around;

  &__field {
    margin: 10px 0 !important;
  }
  &__charge-modal {
    & {
      div[class^='MuiCard-root'],
      div[class*='MuiCard-root'] {
        max-width: 540px;
        font-size: 16px;
      }
      .MuiPaper-root.MuiCard-root {
        h4 {
          margin-top: 0;
          margin-bottom: 5px;
        }
      }
    }

    _total-charge-text {
      font-size: 16px;
      font-family: 'IBM Plex Sans';

      span {
        fontweight: bold;
      }
    }
  }
  &__no-fees-text {
    font-size: 12px;
  }
  &__original-payment-method.MuiGrid-item.MuiGrid-grid-xs-12 {
    padding: 20px 8px 0;
    p {
      margin: 0;
      margin-top: 5px;
      padding: 0;
      &:last-child {
        margin-top: 20px;
      }
    }
  }
  &__charge-actions.MuiGrid-item.MuiGrid-grid-xs-12 {
    padding: 20px 8px 10px;
  }
  &__charge-field-row.MuiGrid-item.MuiGrid-grid-xs-12 {
    padding: 0 8px;
    a {
      color: ${colors.secondary};
      text-decoration: underline;
      &:hover {
        cursor: pointer;
      }
    }
    .MuiTextField-root {
      &:last-child {
        margin: 10px 0 0;
      }
    }
  }
  &__charge-method {
    margin-bottom: 0;
  }
  &__charge-button {
    padding: 8px 16px !important;
  }
  &__radio-group {
    flex-wrap: nowrap;
    margin-bottom: -5px;
    white-space: nowrap;
    width: 80%;
  }

  &__payment-option-heading {
    &&& {
      margin-top: 15px;
    }
  }

  &__card-details-heading {
    &&& {
      margin-top: 20px;
      margin-bottom: 10px;
    }
  }

  &__payment-option {
    &&& {
      span {
        font-family: 'IBMPlexSans-Regular';
        font-size: 16px;
      }
    }
  }
`;

const FlexWrapper = styled.div`
  ${displayFlex}
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  &__field {
    width: 250px;
  }
  @media screen and (max-width: 601px) {
    ${displayFlex}
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

const FlexButtonWrapper = styled(FlexWrapper)`
  ${displayFlex}
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  @media screen and (max-width: 601px) {
    ${displayFlex}
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
  }
`;

const FormButton = styled(Button)`
  &&& {
    line-height: 0;
    width: 120px;
    margin-left: ${props => (props.primary ? 20 : 0)}px;
  }
`;

export default ChargeModal;

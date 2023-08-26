import React, { useEffect, useState, useContext } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import Switch from '@material-ui/core/Switch';
import styled from 'styled-components';
import { useFormikContext, Field } from 'formik';
import { useQuery } from '@apollo/react-hooks';
import StripeElementWrapper from '../../../components/StripeElements/StripeElementWrapper';
import CreditCardSelect from '../../../components/CreditCardSelect';
import { SAVED_CREDIT_CARDS_FROM_EMAIL } from '../../../queries/Renter/SavedCreditCardsByEmail';
import { FormikField } from '../../../components/Fields';
import IndeterminateLoading from '../../../components/Loading/IndeterminateLoading';
import { UserContext } from '../../../store/UserContext';
import colors from '../../../styles/Colors';

function PaymentSectionBase({ className, user, newCard, setNewCard, currentCharges, fees, editView = false, groupOrderLast4 }) {
  const { values, setFieldValue } = useFormikContext();
  const [ccInfoChange, setCCInfoChange] = useState(Number(values.ccChange || 0));
  const triggerFormRender = () => setCCInfoChange(ccInfoChange + 1);
  const { user: bookingUser } = useContext(UserContext);

  const { data: userCreditCards = {}, loading } = useQuery(SAVED_CREDIT_CARDS_FROM_EMAIL, {
    variables: { email: values.renterInformation.email, venueId: values.event?.venue?.id },
    fetchPolicy: 'network-only'
  });

  const formatPrice = price => {
    if (price < 0) return `-$${Math.abs(price).toFixed(2)}`;
    return `$${price.toFixed(2)}`;
  };

  useEffect(() => {
    setFieldValue('adminId', bookingUser.id);
  }, [bookingUser.id]);

  if (userCreditCards) user.savedCreditCards = userCreditCards?.user?.payload.savedCreditCards;

  if (loading) return <IndeterminateLoading />;

  return (
    <div className={`${className}__payment-info-container`}>
      {user.savedCreditCards && user.savedCreditCards.length >= 0 && (
        <>
          <div className={`${className}__card-details-header`}>
            {editView && (
              <div>
                <span>
                  Total including fees: <strong>{formatPrice(currentCharges + fees)}</strong>
                </span>
              </div>
            )}
            {((user.savedCreditCards && !user.savedCreditCards.length) || !user.savedCreditCards || newCard) && (
              <div>
                <span
                  style={{
                    fontFamily: 'IBMPlexSans-Regular',
                    fontSize: '16px'
                  }}>
                  Save Card?
                </span>
                <Switch size="small" className={`${className}__switch`} onChange={event => setFieldValue('ccInformation.saveCard', event.target.checked)} />
              </div>
            )}
          </div>
          {user.savedCreditCards && user.savedCreditCards.length > 0 && (
            <CreditCardSelect
              cards={user.savedCreditCards}
              setSelectedCard={(last4, brand) => {
                setFieldValue('ccInformation.selectedCard', last4);
                setFieldValue('ccInformation.selectedCardBrand', brand);
              }}
              setNewCard={setNewCard}
              newCard={newCard}
              cardValue={values.ccInformation.selectedCard}
              groupOrderLast4={groupOrderLast4}
            />
          )}
        </>
      )}
      {((user.savedCreditCards && !user.savedCreditCards.length) || !user.savedCreditCards || newCard) && (
        <>
          <div className={`${className}__card-name-container`}>
            <div className={`${className}__number-container`}>
              <StripeElementWrapper label="CARD NUMBER" component={CardNumberElement} changeCallback={() => triggerFormRender()} />
            </div>
            <Field
              component={FormikField}
              name={'ccInformation.nameOnCard'}
              label="NAME ON CARD"
              type="text"
              className={`${className}__name-field`}
              variant="filled"
            />
          </div>
          <div className={`${className}__exp-cvc-zip-container`}>
            <div className={`${className}__exp-container`}>
              <StripeElementWrapper label="EXP DATE" component={CardExpiryElement} changeCallback={() => triggerFormRender()} />
            </div>
            <div className={`${className}__cvc-container`}>
              <StripeElementWrapper label="CVV" component={CardCvcElement} changeCallback={() => triggerFormRender()} />
            </div>
            <Field
              component={FormikField}
              name={'ccInformation.zipCode'}
              label="ZIP CODE"
              type="text"
              className={`${className}__zip-field`}
              variant="filled"
              inputProps={{ maxLength: 5 }}
            />
          </div>
        </>
      )}
    </div>
  );
}

const PaymentSectionStyled = styled(PaymentSectionBase)`
  &__payment-info-container {
    @media screen and (min-width: 900px) {
      width: 100%;
    }
    p.Mui-error {
      bottom: -1.7rem;
      color: ${colors.error.primary};
      font-size: 12px;
      margin-left: 0;
      padding-left: 12px;
      position: absolute;
      white-space: nowrap;
    }
  }

  &__switch {
    .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track {
      background-color: ${colors.button.primary.active};
      opacity: 1;
    }
    .MuiSwitch-thumb {
      color: ${colors.white};
    }
  }

  &__card-name-container {
    display: flex;
    @media screen and (max-width: 768px) {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  &__number-container {
    width: 100%;
    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }

  &__exp-cvc-zip-container {
    display: flex;
    flex-direction: row !important;
    width: 100%;
    height: auto;
    margin-top: -12px;
    justify-content: space-between;
  }

  &__exp-container {
    width: 50%;
    @media screen and (max-width: 768px) {
      width: 107px;
    }
  }

  &__cvc-container {
    margin: 0;
    width: 20%;
    @media screen and (max-width: 768px) {
      margin: 0 15px;
    }
  }

  &__name-field {
    &&& {
      margin-top: 10px;
      margin-left: 0;
      @media screen and (max-width: 768px) {
        width: 100%;
        margin-left: 0;
      }
    }
    input {
      color: ${colors.text.primary};
      font-family: 'IBMPlexSans-Regular';
      font-size: 15px;
      text-transform: uppercase;
    }
    height: 57px;
    padding: 10px 5px 0 15px;
    width: 100%;
    @media screen and (max-width: 768px) {
      width: 325px;
    }
  }

  &__zip-field {
    &&& {
      height: 56px;
      input {
        color: ${colors.text.primary};
        font-family: 'IBMPlexSans-Regular';
        font-size: 15px;
      }
      .MuiFilledInput-input {
        padding-top: 25px;
        height: 100%;
      }
    }
    height: 57px;
    width: 20%;
  }

  &__card-details-header {
    display: flex;
    width: 100%;
    flex-direction: row !important;
    font-family: 'IBMPlexSans-regular';
    justify-content: space-between !important;
    font-weight: regular;
    margin-top: 20px;
  }
`;

export default PaymentSectionStyled;

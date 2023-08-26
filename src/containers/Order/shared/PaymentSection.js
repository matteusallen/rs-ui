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
import { ORDER_CREATE_COSTS } from '../../../queries/OrderCreateCosts';
import { buildOrderItems } from '../../../helpers';
import USER_ROLES from 'Constants/userRoles';
import colors from '../../../styles/Colors';

function PaymentSectionBase({ className, user, newCard, setNewCard }) {
  const { values, setFieldValue } = useFormikContext();
  const [ccInfoChange, setCCInfoChange] = useState(Number(values.ccChange || 0));
  const triggerFormRender = () => setCCInfoChange(ccInfoChange + 1);
  const { user: bookingUser } = useContext(UserContext);
  const isRenter = bookingUser?.role.name === USER_ROLES.RENTER;

  const { data: userCreditCards, loading } = useQuery(SAVED_CREDIT_CARDS_FROM_EMAIL, {
    variables: { email: values.renterInformation.email, venueId: values.event?.venue?.id },
    skip: !isRenter,
    fetchPolicy: 'network-only'
  });

  const orderItemsArray = buildOrderItems(values);
  const { data: orderCosts, loading: orderCostsLoading } = useQuery(ORDER_CREATE_COSTS, {
    variables: {
      input: {
        selectedOrderItems: orderItemsArray,
        useCard: false,
        isNonUSCard: false
      }
    },
    fetchPolicy: 'network-only'
  });
  const actualOrderCosts = orderCosts && orderCosts.orderCosts;
  const { total, discount } = actualOrderCosts ? actualOrderCosts : {};

  useEffect(() => {
    if (isRenter) user.savedCreditCards = userCreditCards?.user?.payload.savedCreditCards;
    setFieldValue('ccChange', ccInfoChange);
  }, [ccInfoChange, userCreditCards, loading]);

  if (loading || orderCostsLoading) return <IndeterminateLoading />;

  return (
    <div className={`${className}__payment-info-container`}>
      {total === 0 && discount > 0 && <div className={`${className}__no-payment-required`}>No payment required...</div>}
      {user.savedCreditCards && user.savedCreditCards.length > 0 && !(total === 0 && discount > 0) && (
        <CreditCardSelect
          cards={user.savedCreditCards}
          setSelectedCard={(last4, brand, country) => {
            setFieldValue('ccInformation.selectedCard', last4);
            setFieldValue('ccInformation.selectedCardBrand', brand);
            setFieldValue('ccInformation.country', country);
          }}
          setNewCard={setNewCard}
          newCard={newCard}
          cardValue={values.ccInformation.selectedCard}
        />
      )}
      {((user.savedCreditCards && !user.savedCreditCards.length) || !user.savedCreditCards || newCard) && !(total === 0 && discount > 0) && (
        <>
          <div className={`${className}__card-details-header`}>
            <span>Card Details</span>
            <div>
              <span
                style={{
                  fontFamily: 'IBMPlexSans-Regular',
                  fontSize: '16px'
                }}>
                Save Card?
              </span>
              <Switch
                size="small"
                className={`${className}__switch`}
                checked={values.ccInformation.saveCard}
                onChange={event => setFieldValue('ccInformation.saveCard', event.target.checked)}
              />
            </div>
          </div>
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
            <Field component={FormikField} name={'ccInformation.zipCode'} label="ZIP CODE" type="text" className={`${className}__zip-field`} variant="filled" />
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
    width: 358px;
    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }

  &__exp-cvc-zip-container {
    display: flex;
    margin-top: -12px;
    justify-content: start;
    @media screen and (max-width: 768px) {
      justify-content: space-between;
    }
  }

  &__exp-container {
    width: 120px;
    @media screen and (max-width: 768px) {
      width: 107px;
    }
  }

  &__cvc-container {
    margin: 0 25px;
    width: 94px;
    @media screen and (max-width: 768px) {
      margin: 0 15px;
    }
  }

  &__name-field {
    &&& {
      margin-top: 10px;
      margin-left: 25px;
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
    width: 50%;
    @media screen and (max-width: 768px) {
      width: 325px;
    }
  }

  &__zip-field {
    &&& {
      margin-top: 10px;
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
    width: 94px;
  }

  &__card-details-header {
    display: flex;
    font-family: 'IBMPlexSans-SemiBold';
    justify-content: space-between;
    margin-top: 15px;
    span {
      color: ${colors.text.primary};
      font-size: 18px;
    }
  }

  &__no-payment-required {
    font-weight: 400;
    font-size: 16px;
    line-height: 25px;
    color: #11181f;
    text-align: left;
  }
`;

export default PaymentSectionStyled;

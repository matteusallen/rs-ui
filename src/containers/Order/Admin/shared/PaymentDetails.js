import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { Grid, Radio, FormControlLabel } from '@material-ui/core';

import FormCard from '../../../../components/Cards/FormCard';
import { HeadingThree, HeadingFive } from '../../../../components/Headings';
import { Separator } from '../../../../components/Separator';
import { GroupSelect } from './GroupSelect';
import PaymentSection from '../../shared/PaymentSection';
import { UserContext } from '../../../../store/UserContext';
import IndeterminateLoading from '../../../../components/Loading/IndeterminateLoading';
import { MultiPayment } from './MultiPayment';
import PaymentOptions from './PaymentOptions';
import USER_ROLES from 'src/constants/userRoles.js';
import { useValidateAction } from '../../../../utils/actions';
import { actions } from '../../../../constants/actions';

function PaymentDetails(props) {
  const { user: adminUser } = useContext(UserContext);
  const { values, setFieldValue } = useFormikContext();
  const { renterInformation: user, ccInformation, deferredGroupId } = values;
  const { firstName, lastName, email } = user;
  const { groupBill } = ccInformation;
  const [newCard, setNewCard] = useState(false);
  const validRenterInformation = firstName && lastName && email;
  const isVenueAdmin = adminUser.role.name === USER_ROLES.VENUE_ADMIN;
  const isGroupLeader = adminUser.role.name === USER_ROLES.GROUP_LEADER;
  const isResAdmin = adminUser.role.name === USER_ROLES.RESERVATION_ADMIN;

  useEffect(() => {
    setFieldValue('newCard', newCard);
  }, [newCard]);

  const handleUseDeferred = () => {
    setFieldValue('deferredGroupId', null);
    setFieldValue('ccInformation.useCard', false);
    setFieldValue('ccInformation.groupBill', true);
    props.setPaymentOptions(null);
  };

  const totalProducts = +props.total - props.serviceFee;
  const totalFees = +props.totalWithFee - totalProducts;

  const canSelectCardPayment = useValidateAction('orders', actions.ORDER_PAYMENT);
  const canSelectCashPayment = useValidateAction('orders', actions.ORDER_PAYMENT);
  const isRoleValid = isVenueAdmin || isGroupLeader || isResAdmin;

  return (
    <FormCard className={props.className} dataTestId="card_payment_details">
      <HeadingThree label={'Payment Details'} />
      <Separator margin="0.625rem 0 1.375rem" />
      {validRenterInformation && !props.orderCostsLoading ? (
        <>
          {!(props.total === 0 && props.discount > 0) ? (
            <>
              <>
                <HeadingFive label="Payment Method" className={`${props.className}__payment-option-heading`} />
                <div className={`${props.className}__radio-group`}>
                  <Grid container spacing={2}>
                    {canSelectCardPayment && canSelectCashPayment && (
                      <>
                        <PaymentOptions paymentOptions={props.paymentOptions} setPaymentOptions={props.setPaymentOptions} className={props.className} />
                        <Divider />
                      </>
                    )}
                    {isRoleValid && (
                      <Grid item xs>
                        <FormControlLabel
                          id="deferred-payment-toggle"
                          value="deferredPayment"
                          control={<Radio color="primary" id={`radio-deferred-payment`} />}
                          checked={groupBill}
                          onChange={handleUseDeferred}
                          className={`${props.className}__payment-option`}
                          label={`Group Bill`}
                        />
                      </Grid>
                    )}
                  </Grid>
                </div>
              </>

              {canSelectCardPayment && props.paymentOptions && props.paymentOptions.card && !props.paymentOptions.cash && (
                <>
                  <div
                    style={{
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  />
                  <PaymentSection {...props} user={user} setNewCard={setNewCard} newCard={newCard} ccInformation={ccInformation} />
                </>
              )}

              {props.paymentOptions && props.paymentOptions.card && props.paymentOptions.cash && (
                <MultiPayment
                  total={props.totalWithFee}
                  paymentOptions={props.paymentOptions}
                  user={user}
                  setNewCard={setNewCard}
                  newCard={newCard}
                  fees={totalFees.toFixed(2)}
                />
              )}

              {groupBill && (
                <>
                  <div
                    style={{
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  />
                  <div style={{ marginTop: '10px' }}>
                    <GroupSelect className={props.className} onChange={e => setFieldValue('deferredGroupId', e.target.value)} selectedGroup={deferredGroupId} />
                  </div>
                </>
              )}
            </>
          ) : (
            <div className={`${props.className}__no-payment-required`}>No payment required...</div>
          )}
        </>
      ) : (
        <>{props.orderCostsLoading ? <IndeterminateLoading size={15} /> : <p>Complete Renter Information to select payment method</p>}</>
      )}
    </FormCard>
  );
}

export default styled(PaymentDetails)`
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

export const Divider = styled.div`
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 20px;

  &:after {
    content: '';
    width: 1px;
    height: 20px;
    background: #c8d6e5;
  }
`;

// @flow
import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { Grid, FormControlLabel, Checkbox } from '@material-ui/core';

import { useValidateAction } from '../../../../utils/actions';
import { actions } from '../../../../constants/actions';

type PaymentOptionsProps = {
  paymentOptions: { card: boolean, cash: boolean },
  setPaymentOptions: (value: boolean) => void,
  className: string
};

function PaymentOptions({ paymentOptions, setPaymentOptions, className }: PaymentOptionsProps) {
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    if (paymentOptions) {
      setFieldValue('deferredGroupId', null);
      setFieldValue('ccInformation.useCard', paymentOptions && paymentOptions.card ? true : false);
      setFieldValue('ccInformation.groupBill', false);
    }
  }, [paymentOptions]);

  const handleUseCash = () => {
    setPaymentOptions(prevState => {
      if (prevState && prevState.cash && prevState.card) {
        return { ...paymentOptions, cash: false };
      }

      return { ...paymentOptions, cash: true };
    });
  };

  const handleUseCard = () => {
    setPaymentOptions(prevState => {
      if (prevState && prevState.card && prevState.cash) {
        return { ...paymentOptions, card: false };
      }

      return { ...paymentOptions, card: true };
    });
  };

  const canSelectCashPayment = useValidateAction('orders', actions.DEFERRED_SETLEMENT_CASH_PAYMENT);

  return (
    <>
      <Grid item xs>
        <FormControlLabel
          id="credit-debit-control"
          value="creditOrDebitCard"
          control={<Checkbox color="primary" id={`check-credit-debit`} />}
          checked={paymentOptions && paymentOptions.card === true}
          onChange={handleUseCard}
          className={`${className}__payment-option`}
          label={`Credit/Debit Card`}
        />
      </Grid>
      {canSelectCashPayment && (
        <Grid item xs>
          <FormControlLabel
            id="cash-control"
            value="cash"
            control={<Checkbox color="primary" id={`check-cash`} />}
            checked={paymentOptions && paymentOptions.cash === true}
            onChange={handleUseCash}
            className={`${className}__payment-option`}
            label={`Cash or Check`}
          />
        </Grid>
      )}
    </>
  );
}

export default PaymentOptions;

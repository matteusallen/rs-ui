// @flow
import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import { Formik, Field, Form } from 'formik';
import Modal from '../../../../components/Modal';
import Button from '../../../../components/Button';
import { FormikField } from '../../../../components/Fields';
import { displayFlex } from '../../../../styles/Mixins';
import colors from '../../../../styles/Colors';
import type { OrderType } from 'src/queries/Admin/OrderForOrderTableDetail.js';
import { ORDER_EDIT_COSTS } from '../../../../queries/OrderEditCosts';
import { useLazyQuery } from 'react-apollo';

type GroupOrderEditModalPropsType = {|
  className?: string,
  onClose: () => void,
  open: boolean,
  order: OrderType,
  currentCharges: number,
  handleSubmit?: (paymentDetails: {}, refundPayment: boolean, isGroupOrder: boolean) => void
|};

export const GroupOrderEditModal = (props: GroupOrderEditModalPropsType) => {
  const { className = '', onClose, open, order = {}, currentCharges = 0, handleSubmit } = props;
  const [isLoading, setLoading] = useState<boolean>(false);
  const { payments = [] } = order;
  const payment = payments.find(payment => payment.amount > 0) || {};
  const [percentageFee, setPercentageFee] = useState(0);
  const currentChargesString = currentCharges < 0 ? `-$${Math.abs(currentCharges)?.toFixed(2)}` : `$${(currentCharges + percentageFee)?.toFixed(2)}`;
  const [getFees, { data: costFees }] = useLazyQuery(ORDER_EDIT_COSTS);

  useEffect(() => {
    getFees({
      variables: {
        input: {
          orderId: +order.id,
          isNonUSCard: false,
          useCard: false,
          amount: currentCharges
        }
      }
    });
    if (costFees) {
      if (order.group) {
        setPercentageFee(costFees.orderCostsFee.fee);
      }
    }
  }, [currentCharges, costFees]);

  if (!payment) {
    return null;
  }
  return (
    <Modal heading={'Adjust Group Bill'} open={open} className={`${className}__group-edit-modal`}>
      <Formik
        className={className}
        onSubmit={async ({ refundAmount, refundReason }) => {
          setLoading(true);
          const groupOrderPayment = {
            amount: refundAmount,
            notes: refundReason,
            isRefund: currentCharges < 0
          };
          handleSubmit && (await handleSubmit(groupOrderPayment, currentCharges < 0, true));
          onClose();
          setLoading(false);
        }}
        initialValues={{
          refundAmount: currentCharges,
          refundReason: ''
        }}>
        {({ isValid, values, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12} className={`${className}__original-payment-method`}>
                <p>
                  <strong>All changes will be adjusted to {order.group?.name}</strong>
                </p>
                <p data-testid="original-payment-label">
                  Adjusted total: <strong>{currentChargesString}</strong>
                </p>
              </Grid>
              <Grid item xs={12} className={`${className}__refund-field-row`}>
                <Field
                  data-testid="return-reason-field"
                  label="REASON FOR ADJUSTMENT (OPTIONAL)"
                  multiline
                  maxLength="255"
                  type="text"
                  name="refundReason"
                  variant="filled"
                  component={FormikField}
                  value={values.refundReason}
                  onChange={e => setFieldValue('refundReason', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} className={`${className}__refund-actions`}>
                <FlexButtonWrapper>
                  <FormButton data-testid="refund-cancel" secondary variant="contained" size="large" onClick={onClose}>
                    GO BACK
                  </FormButton>
                  <FormButton data-testid="refund-confirm" primary variant="contained" size="large" type="submit" disabled={isLoading || !isValid}>
                    Adjust
                  </FormButton>
                </FlexButtonWrapper>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const GroupModal = styled(GroupOrderEditModal)`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-around;

  &__field {
    margin: 10px 0 !important;
  }

  &__group-edit-modal {
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
  &__refund-actions.MuiGrid-item.MuiGrid-grid-xs-12 {
    padding: 20px 8px 10px;
  }
  &__refund-field-row.MuiGrid-item.MuiGrid-grid-xs-12 {
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

export default GroupModal;

import React from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { compose } from 'recompose';

import { useQuery } from '@apollo/react-hooks';

import FormCard from '../../../../components/Cards/FormCard';
import { Separator } from '../../../../components/Separator';

import { paragraphReg } from '../../../../styles/Typography';
import { displayFlex } from '../../../../styles/Mixins';
import colors from '../../../../styles/Colors';
import { formatPriceInformation } from '../../../../helpers';

import { ORDER_UPDATE_PRICING_DIFFS } from '../../../../queries/Admin/GetOrderUpdatePricingDiffs';

import { reportGraphqlError } from '../../../../helpers/graphqlResponseUtil';
import { withSnackbarContextActions } from '../../../../store/SnackbarContext';

const createUpdatedOrderQueryArgument = (updates, orderId) => {
  if (updates && Object.entries(updates).length > 0) {
    // Currently there can be one RV and one Stall product per reservation
    // But this method will support calculating mutiple product per reservation
    // if needed in the future
    const addOns = [];
    const rvs = [];
    const stalls = [];
    Object.keys(updates).map(item => {
      if (item === 'addOnUpdates' && updates.addOnUpdates) {
        updates.addOnUpdates.forEach(addOnUpdate => {
          addOns.push({
            id: Number(addOnUpdate.id),
            quantity: addOnUpdate.quantity
          });
        });
      }
      if (item === 'stallUpdates' && updates.stallUpdates.quantityDifference) {
        const { id, newQuantity } = updates.stallUpdates.quantityDifference;
        const stallQuantityUpdate = {
          id: Number(id),
          quantity: newQuantity
        };
        stalls.push(stallQuantityUpdate);
      }
      if (item === 'rvUpdates' && updates.rvUpdates.quantityDifference) {
        rvs.push({ quantity: updates.rvUpdates.quantityDifference.newQuantity });
      }
    });
    return {
      orderId: Number(orderId),
      updatedOrder: {
        addOns,
        rvs,
        stalls
      }
    };
  }
  return {};
};

const SummaryBase = ({ className, costs, isReview = false, updates = {}, showSnackbar }) => {
  const { values } = useFormikContext();
  const { initialOrder, reservationEdit } = values;
  const { addOnUpdates, stallUpdates, rvUpdates } = updates;
  const hasReviewChanges = !!addOnUpdates || !!stallUpdates || !!rvUpdates;
  let totalForReservationUpdate = 0.0;
  let transactionFeeForReservationUpdate = 0.0;

  const { data, error, loading } = useQuery(ORDER_UPDATE_PRICING_DIFFS, {
    variables: {
      input: hasReviewChanges ? createUpdatedOrderQueryArgument(updates, initialOrder.id) : {}
    },
    fetchPolicy: 'network-only',
    skip: !isReview && !hasReviewChanges
  });

  if (loading) return 'loading...';
  if (error) {
    reportGraphqlError(showSnackbar, 'There was a problem fetching pricing differences');
  }

  const { total } = costs || {};
  const reservationDataExists = true;

  const orderUpdatePricingDiffs = data && !!data.orderUpdatePricingDiffs ? data.orderUpdatePricingDiffs : {};

  transactionFeeForReservationUpdate = orderUpdatePricingDiffs.transactionFee || 0;

  const formatProductUpdates = updates => {
    return Object.values(updates).map(update => {
      if (update) {
        return (
          <div className={`${className}__update-total`} key={update.message}>
            <p className={'update'}>
              {`${update.type} `}
              <span className={'update-message'}>{update.message}</span>
            </p>
            <p className={'update-message'}>$0.00</p>
          </div>
        );
      }
    });
  };

  const getFormattedAddOnUpdates = (addOnUpdates, orderUpdatePricingDiffs) => {
    const result = [];
    if (addOnUpdates) {
      addOnUpdates.forEach((addOnUpdate, index) => {
        let price = 0.0;
        if (orderUpdatePricingDiffs && !!orderUpdatePricingDiffs.addOns) {
          const diff = orderUpdatePricingDiffs.addOns.filter(addOn => {
            return addOn.id === addOnUpdate.id;
          });
          price = diff[0].priceDelta;
          totalForReservationUpdate += price;
        }
        result.push(
          <div
            aria-label={addOnUpdate.description}
            className={`${className}__update-total`}
            key={`add-on-update-${addOnUpdate.id}`}
            id={`add-on-update-${index}`}>
            <p className={'update'}>
              {'Remove '}
              <span className={'update-message'}>{addOnUpdate.description.replace('-', '')}</span>
            </p>
            <p className={'update-message'}>${`${formatPriceInformation(price)}`}</p>
          </div>
        );
      });
    }
    return result;
  };

  return (
    <FormCard className={className}>
      {!reservationDataExists ? (
        <p>Select dates and stall options to see summary</p>
      ) : (
        <>
          {isReview && (
            <div className={`${className}__review-updates`}>
              {(stallUpdates.dateDifference || stallUpdates.quantityDifference) && (
                <>
                  <p>Stall updates</p>
                  {formatProductUpdates(stallUpdates)}
                </>
              )}
              {(rvUpdates.dateDifference || rvUpdates.quantityDifference) && (
                <>
                  <p>RV spot updates</p>
                  {formatProductUpdates(rvUpdates)}
                </>
              )}
              {orderUpdatePricingDiffs.addOns && orderUpdatePricingDiffs.addOns.length > 0 && (
                <>
                  <p>Add on updates</p>
                  {getFormattedAddOnUpdates(addOnUpdates, null)}
                </>
              )}

              {orderUpdatePricingDiffs.addOns && orderUpdatePricingDiffs.addOns.length > 0 && (
                <div aria-label={'transaction-fee'} className={`${className}__update-total`} key={'transaction-fee'} id={'transaction-fee'}>
                  <p>Transaction Fee</p>
                  <p className={'update-message'}>${formatPriceInformation(transactionFeeForReservationUpdate)}</p>
                </div>
              )}
            </div>
          )}

          {!isReview && (
            <div className={`${className}__review-updates`}>
              {
                <>
                  {
                    <div aria-label={'Add on updates'} className={`${className}__update-total`} key={`add-on-update-edit`} id={`add-on-update-edit`}>
                      <span className={'update-message'}>Add on updates</span>
                      {/* bring back formatAddOnsUpdatePrice() below once we add price change on edit reservation */}
                      <p className={'update-message'}>$0.00</p>
                    </div>
                  }
                </>
              }
            </div>
          )}

          <Separator />
          <div className={`${className}__total`}>
            <p>{!isReview ? 'Subtotal' : 'Total Due'}</p>
            {reservationEdit ? (
              <p>
                $
                {!isReview
                  ? // bring back formatAddOnsUpdatePrice() below once we add price change on edit reservation
                    '0.00'
                  : formatPriceInformation(totalForReservationUpdate + transactionFeeForReservationUpdate)}
              </p>
            ) : (
              <p>${formatPriceInformation(total)}</p>
            )}
          </div>
        </>
      )}
    </FormCard>
  );
};

const Summary = styled(SummaryBase)`
  p {
    ${paragraphReg}
    margin-top: 0;
  }
  &__ticket-line {
    color: ${colors.text.primary};
    font-size: 16px;
    margin-top: 5px;
    text-transform: uppercase;
    width: 100%;
    ${displayFlex}
    justify-content: space-between;
    p {
      margin: 0;
    }
  }
  &__total {
    color: #242424;
    font-size: 16px;
    width: 100%;
    text-transform: uppercase;
    ${displayFlex}
    justify-content: space-between;
    margin-top: 10px;
    &&& {
      p {
        font-family: 'IBMPlexSans-Bold';
        margin: 0;
      }
    }
  }
  &__update-total {
    font-size: 16px;
    width: 100%;
    ${displayFlex}
    justify-content: space-between;
  }
  &__review-updates {
    &&& {
      p {
        font-family: 'IBMPlexSans-Bold';
        margin: 0;
      }
      .update {
        margin-left: 20px;
      }
      .update-message {
        font-family: 'IBMPlexSans-Regular';
      }
    }
  }
`;

// export default Summary
export default compose(withSnackbarContextActions)(Summary);

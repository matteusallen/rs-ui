//@flow
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { useFormikContext } from 'formik';
import { Elements } from '@stripe/react-stripe-js';
import { FormControlLabel } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import FormCard from '../../../../components/Cards/FormCard';
import Button from '../../../../components/Button';
import { displayFlex, doMediaQuery } from '../../../../styles/Mixins';
import colors from '../../../../styles/Colors';
import FormikTicket from './FormikTicket';
import useReservationFlowRoutes from './useReservationFlowRoutes';
import { isPaymentInformationValid, isZeroRatePaymentValid } from '../../shared/sharedMethods';
import { isEmpty } from '../../../../helpers';
import Checkbox from '../../../../components/Checkbox';
import { RV_SOLD_OUT_STATUS } from '../../../../queries/Renter/RvSoldOutStatus.js';
import { ORDER_CREATE_COSTS } from '../../../../queries/OrderCreateCosts';
import { buildOrderItems } from '../../../../helpers';

import type { ReservationFormShapeType, ReservationFormWithZeroRateShapeType } from './index';

type CheckoutPropsType = {|
  className?: string,
  elements: Elements,
  stallQuestionsAreValid: boolean,
  rvQuestionsAreValid: boolean
|};

const ReservationSummary = (props: CheckoutPropsType) => {
  const { className = '', elements, stripe, setIsZeroRatesForm, stallQuestionsAreValid, rvQuestionsAreValid } = props;
  const { values, errors, isSubmitting, setFieldValue } = useFormikContext<ReservationFormShapeType>();
  const [checked, setChecked] = useState<boolean>(false);
  const {
    event,
    event: { venueAgreement },
    rvProductId,
    hasEmptyRVQuestions,
    hasEmptyStallQuestions,
    stallProductId
  } = values;
  const { isStallsUrl, isCheckoutUrl, isRvsUrl, goToRvs, goToCheckout } = useReservationFlowRoutes();
  const rvErrors = Boolean(errors.rv_spot) || !rvProductId;
  const stallErrors = Boolean(errors.stalls) || !stallProductId;
  const addOnErrors = Boolean(errors.addOns && errors.addOns.length > 0);
  const hasRvProducts = event.rvProducts.length > 0;

  const { data: eventProductData } = useQuery(RV_SOLD_OUT_STATUS, {
    variables: { id: event.id },
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

  setIsZeroRatesForm(total === 0 && discount > 0);

  let fCtx;
  if (total === 0 && discount > 0) {
    fCtx = useFormikContext<ReservationFormWithZeroRateShapeType>();
  } else {
    fCtx = useFormikContext<ReservationFormShapeType>();
  }

  const isSubmitDisabled = (): boolean => {
    if (isStallsUrl) {
      return stallErrors || addOnErrors || Object.keys(hasEmptyStallQuestions)?.length;
    }

    if (isRvsUrl) {
      return rvErrors || addOnErrors || Object.keys(hasEmptyRVQuestions)?.length;
    }

    if (isCheckoutUrl) {
      if (values.group) {
        if (!event.isGroupCodeRequired && !isPaymentInformationValid(values, elements)) return true;
        return !isZeroRatePaymentValid(total, discount, errors) && !isEmpty(errors);
      }

      return !isZeroRatePaymentValid(total, discount, errors) && (!isPaymentInformationValid(values, elements) || !isEmpty(errors));
    }

    return true;
  };

  const checkoutNextHandler = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isStallsUrl || isRvsUrl) {
      goToCheckout();
    }
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await fCtx.submitForm();
    window.scrollTo(0, 0);
  };

  const handleGoToRvs = () => {
    goToRvs();
    window.scrollTo(0, 0);
  };

  const setAgreementValue = () => {
    setChecked(!checked);
    setFieldValue('venueAgreement', !checked);
  };

  const isEditingStalls = stalls => {
    if (stalls.quantity > 0 && isSubmitDisabled()) {
      return true;
    }

    return false;
  };

  const areMinNightsValid = () => {
    if (values.isBelowMinNights.stalls || values.isBelowMinNights.rvs) {
      return true;
    }

    return false;
  };

  const venueAgreementCheckbox = (
    <>
      <FormControlLabel
        control={<StyledCheckbox checked={checked} color="primary" type="checkbox" name="venueAgreement" value={checked} onClick={setAgreementValue} />}
        label={
          <span>
            I confirm that I have read and accepted the{' '}
            <a href={`${venueAgreement ? venueAgreement.url : '#'}`} target="_blank" rel="noopener noreferrer">
              Venue Agreement
            </a>
            .
          </span>
        }
      />
    </>
  );

  return (
    <FormCard className={className} dataTestId="renter_reservation_summary">
      <div className={`${className} flex-checkout-container`}>
        <FormikTicket className={className} elements={elements} stripe={stripe} />
        {isCheckoutUrl && venueAgreementCheckbox}

        <div className={'actions'}>
          <Button
            data-testid="reservation-summary-contiune-btn"
            primary
            variant="contained"
            size="large"
            type={isCheckoutUrl ? 'submit' : 'button'}
            disabled={isSubmitDisabled() || isSubmitting || !stallQuestionsAreValid || !rvQuestionsAreValid || areMinNightsValid()}
            onClick={isCheckoutUrl ? handleSubmit : checkoutNextHandler}
            isLoading={isSubmitting && orderCostsLoading}>
            {(isStallsUrl || isRvsUrl) && 'CONTINUE TO CHECKOUT'}
            {isCheckoutUrl && 'SUBMIT'}
          </Button>
          {!(isRvsUrl || isCheckoutUrl) && (
            <Button
              data-testid="add-rvs-btn"
              className={hasRvProducts ? '' : 'unavailable-rv-button'}
              secondary
              variant="contained"
              size="large"
              type="button"
              disabled={
                isEditingStalls(values?.stalls) ||
                isSubmitting ||
                !hasRvProducts ||
                eventProductData?.event.rvSoldOut ||
                !stallQuestionsAreValid ||
                !rvQuestionsAreValid ||
                areMinNightsValid()
              }
              onClick={handleGoToRvs}>
              {!event.rvProducts.length ? 'RV SPOTS UNAVAILABLE' : eventProductData?.event.rvSoldOut ? 'RV SPOTS SOLD OUT' : 'BOOK RV SPOT(S)'}
            </Button>
          )}
        </div>
      </div>
    </FormCard>
  );
};

const ReservationSummaryStyled = styled(ReservationSummary)`
  &.flex-checkout-container {
    ${displayFlex}
    flex-direction: column;
    font-size: 16px;

    .unavailable-rv-button {
      border: none;
      background-color: white;
    }

    .actions {
      margin: 0;

      button {
        height: 36px;
        width: 100%;
        margin: 15px 0;
        &:first-child {
          margin: 25px 0 0;
        }
      }
    }

    .progress-spinner {
      &&& {
        bottom: 3%;
        color: ${colors.primary};
        left: 44%;
        position: absolute;
      }
    }
  }
`;

const StyledCheckbox = styled(Checkbox)`
  &&& {
    ${doMediaQuery(
      'BIG_TABLET_WIDTH',
      `
      top: -10px;
    `
    )}
    span svg {
      color: ${colors.secondary};
    }
    ${props => {
      if (props.disabled) {
        return css`
          opacity: 0.5;
        `;
      }
    }}
  }
`;

export default ReservationSummaryStyled;

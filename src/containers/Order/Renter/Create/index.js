//@flow
import React, { useState } from 'react';
import { compose } from 'recompose';
import { useStripe, useElements, CardNumberElement } from '@stripe/react-stripe-js';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useQuery } from '@apollo/react-hooks';
import { withRouter, RouteComponentProps } from 'react-router';
import { Moment } from 'moment';

import { getValueByPropPath } from '../../../../utils/objectHelpers';
import IndeterminateLoading from '../../../../components/Loading/IndeterminateLoading';
import Error from '../../../../components/Alerts/Error';
import ReservationForm from './ReservationForm';
import withStripe from '../../../../enhancers/withStripe';
import { withUserContext } from '../../../../store/UserContext';
import { EVENT_FOR_ORDER_CREATE } from '../../../../queries/Renter/EventForOrderCreate';
import { createStripeToken, handleSubmit } from '../../shared/sharedMethods';

import type { UserType } from '../../../../pages/Admin/Users';
import type { EventType, GetRenterEventReturnType } from '../../../../queries/Renter/EventForOrderCreate';
import { withOrderCheckout } from '../../../../mutations/OrderCheckout';
import type { OrderCheckoutPramsType } from '../../shared/sharedMethods';
import type { ShowSnackbarType } from '../../../../store/SnackbarContext';
import { withSnackbarContextActions } from '../../../../store/SnackbarContext';
import { reportGraphqlError } from '../../../../helpers/graphqlResponseUtil';

export type ReservationPropsType = {|
  eventId: string | number,
  orderCheckout: OrderCheckoutPramsType,
  // eslint-disable-next-line
  showSnackbar: ShowSnackbarType,
  user: UserType,
  ...RouteComponentProps
|};

export type ReservationFormShapeType = {|
  addOns: { [index: string]: string },
  ccInformation: {
    nameOnCard: string,
    saveCard: boolean,
    selectedCard: string,
    useCard: boolean,
    zipCode: string,
    groupBill: boolean,
    country: string
  },
  event: EventType,
  renterInformation: {
    email: string,
    firstName: string,
    id: string,
    lastName: string,
    phone: string
  },
  renterNotes: string,
  adminNotes?: string,
  rvProductId: null | string,
  rv_spot: {
    end?: Moment,
    quantity: number,
    start?: Moment,
    status?: string | number
  },
  sameDates: boolean,
  selectedRvs?: [],
  selectedStalls?: [],
  stallProductId: null | string,
  stalls: {
    end?: Moment,
    quantity: number,
    start?: Moment,
    status?: string | number
  },
  venueAgreement: boolean,
  deferredGroupId?: number,
  multipaymentInput?: {
    isMultipayment: boolean,
    totalInCash: string,
    totalInCard: string
  },
  group?: {
    id: string,
    code: string
  }
|};

export type ReservationFormWithZeroRateShapeType = {|
  addOns: { [index: string]: string },
  event: EventType,
  renterInformation: {
    email: string,
    firstName: string,
    id: string,
    lastName: string,
    phone: string
  },
  renterNotes: string,
  adminNotes?: string,
  rvProductId: null | string,
  rv_spot: {
    end?: Moment,
    quantity: number,
    start?: Moment,
    status?: string | number
  },
  sameDates: boolean,
  selectedRvs?: [],
  selectedStalls?: [],
  stallProductId: null | string,
  stalls: {
    end?: Moment,
    quantity: number,
    start?: Moment,
    status?: string | number
  },
  venueAgreement: boolean,
  deferredGroupId?: number
|};

function ReservationCreate(props: ReservationPropsType): string | React$Element<'Formik'> {
  const stripe = useStripe();
  const elements = useElements();
  const { eventId, user, orderCheckout } = props;
  const [isZeroRatesForm, setIsZeroRatesForm] = useState(false);
  const { loading, data = {}, error } = useQuery<GetRenterEventReturnType>(EVENT_FOR_ORDER_CREATE, {
    variables: {
      eventId
    },
    fetchPolicy: 'network-only'
  });

  if (loading) return <IndeterminateLoading />;

  if (error) return <Error label={error} />;

  const event = data.event || {};
  const initialValues = {
    event,
    ccInformation: {
      nameOnCard: null,
      saveCard: false,
      selectedCard: null,
      zipCode: null,
      useCard: true,
      country: ''
    },
    renterInformation: {
      id: user && user.id,
      firstName: user && user.firstName,
      lastName: user && user.lastName,
      phone: user && user.phone,
      email: user && user.email
    },
    renterNotes: null,
    rv_spot: {
      start: null,
      end: null,
      quantity: null
    },
    productQuestionAnswers: [],
    stalls: {
      start: null,
      end: null,
      quantity: null
    },
    addOns: {},
    hasEmptyRVQuestions: {},
    hasEmptyStallQuestions: {},
    stallProductId: null,
    rvProductId: null,
    sameDates: false,
    venueAgreement: false,
    selectedStallMinNights: 0,
    selectedRVMinNights: 0,
    isBelowMinNights: {
      stalls: false,
      rvs: false
    }
  };

  const RenterReservationCreateSchema = Yup.object().shape({
    type: Yup.string().oneOf(['fullEvent', 'nightly']),
    stallProductId: Yup.string().when('stalls.quantity', {
      is: (val: string | number) => Number(val) > 0,
      then: Yup.string().required('Stall Product not selected'),
      otherwise: Yup.string().nullable()
    }),
    rvProductId: Yup.string().when('rv_spot.quantity', {
      is: (val: string | number) => Number(val) > 0,
      then: Yup.string().required('RV Product not selected'),
      otherwise: Yup.string().nullable()
    }),
    ccInformation: Yup.object().shape({
      nameOnCard: Yup.string('Name on card is required').when('selectedCard', {
        is: val => val && val.length < 0,
        then: Yup.string()
          .min(2, 'Name on card is too short')
          .max(50, 'Name on card is too long')
          .nullable()
          .required('Name on card is required'),
        otherwise: Yup.string().nullable()
      }),
      saveCard: Yup.boolean().required(),
      selectedCard: Yup.string()
        .length(4)
        .nullable(),
      zipCode: Yup.string()
        .nullable()
        .when('selectedCard', {
          is: val => !val,
          then: Yup.string()
            .nullable()
            .required('Billing zip code is required'),
          otherwise: Yup.string().nullable()
        }),
      useCard: Yup.boolean().required()
    }),
    renterInformation: Yup.object().shape({
      id: Yup.number().cast(),
      firstName: Yup.string()
        .min(2, 'First name is too short')
        .max(50, 'First name is too long')
        .nullable()
        .required('First name is required'),
      lastName: Yup.string()
        .min(2, 'Last name is too short')
        .max(50, 'Last name is too long')
        .nullable()
        .required('Last name is required'),
      phone: Yup.string()
        .matches('^[0-9]+$', 'Enter a valid phone number')
        .length(10, 'Enter a valid phone number')
        .required('Enter a valid phone number'),
      email: Yup.string().email()
    }),
    renterNotes: Yup.string()
      .max(250)
      .nullable(),
    venueAgreement: Yup.boolean()
      .required()
      .oneOf([true], 'You must accept the venue agreement to continue')
  });

  const RenterZeroRatesReservationCreateSchema = Yup.object().shape({
    type: Yup.string().oneOf(['fullEvent', 'nightly']),
    stallProductId: Yup.string().when('stalls.quantity', {
      is: (val: string | number) => Number(val) > 0,
      then: Yup.string().required('Stall Product not selected'),
      otherwise: Yup.string().nullable()
    }),
    rvProductId: Yup.string().when('rv_spot.quantity', {
      is: (val: string | number) => Number(val) > 0,
      then: Yup.string().required('RV Product not selected'),
      otherwise: Yup.string().nullable()
    }),
    renterInformation: Yup.object().shape({
      id: Yup.number().cast(),
      firstName: Yup.string()
        .min(2, 'First name is too short')
        .max(50, 'First name is too long')
        .nullable()
        .required('First name is required'),
      lastName: Yup.string()
        .min(2, 'Last name is too short')
        .max(50, 'Last name is too long')
        .nullable()
        .required('Last name is required'),
      phone: Yup.string()
        .matches('^[0-9]+$', 'Enter a valid phone number')
        .length(10, 'Enter a valid phone number')
        .required('Enter a valid phone number'),
      email: Yup.string().email()
    }),
    renterNotes: Yup.string()
      .max(250)
      .nullable(),
    venueAgreement: Yup.boolean()
      .required()
      .oneOf([true], 'You must accept the venue agreement to continue')
  });

  const buildStripeToken = async values => {
    if (values.ccInformation.selectedCard) return;
    const cardInfo = {
      card: elements.getElement(CardNumberElement),
      name: values.ccInformation.nameOnCard,
      zip: values.ccInformation.zipCode
    };
    return await createStripeToken(stripe, cardInfo);
  };

  const onSubmit = async values => {
    let stripeToken;
    if (!values.ccInformation.selectedCard && !isZeroRatesForm && ((values.group && values.event.isGroupCodeRequired === false) || !values.group)) {
      const stripeTokenResponse = await buildStripeToken(values);
      stripeToken = stripeTokenResponse;
    }
    const result = await handleSubmit({
      orderCheckout,
      values,
      stripeToken,
      user,
      isZeroRatesForm
    });
    const errorResponse = getValueByPropPath(result, 'data.checkout.error');

    if (errorResponse) {
      reportGraphqlError(props.showSnackbar, errorResponse || 'Order could not be updated', errorResponse, user.role.name);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={isZeroRatesForm ? RenterZeroRatesReservationCreateSchema : RenterReservationCreateSchema}
      onSubmit={onSubmit}>
      {() => <ReservationForm stripe={stripe} elements={elements} user={user} setIsZeroRatesForm={setIsZeroRatesForm} />}
    </Formik>
  );
}

const ReservationCreateWithStripe = compose(withRouter, withStripe, withUserContext, withSnackbarContextActions, withOrderCheckout)(ReservationCreate);

export default ReservationCreateWithStripe;

//@flow
import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { Route, Switch, useHistory } from 'react-router';
import moment from 'moment-timezone';
import { useFormikContext } from 'formik';
import EventDetails from './EventDetails';
import StallProductSelect from '../../shared/StallProductSelect';
import PaymentDetails from './PaymentDetails';
import AddOns from './AddOns';
import SpecialRequests from './SpecialRequests';
import RenterInformation from './RenterInformation';
import ReservationFlowLayout from './ReservationFlowLayout';
import useReservationFlowRoutes from './useReservationFlowRoutes';
import CardSectionHeader from '../../../../components/Cards/CardSectionHeader';
import DateSelectDetails from './DateSelectDetails';
import RvProductSelect from '../../shared/RvProductSelect';
import RV from '../../../../assets/img/icons/RV.png';
import HorseShoe from '../../../../assets/img/icons/Horseshoe.png';
import ReservationSummary from './ReservationSummary';
import ReservationBackButton from './ReservationBackButton';
import type { UserType } from '../../../../pages/Admin/Users';
import { DATE_FORMAT } from '../../../../helpers';
import CheckoutSummaryPreview from './CheckoutSummaryPreview';
import ROUTES from '../../../../constants/routes';
import ProductQuestions from '../../shared/ProductQuestionsCard';

import type { ReservationFormShapeType } from './index';

function ReservationForm(props: {
  elements: Elements | null,
  stripe: string,
  user: UserType,
  setIsZeroRatesForm: React.Dispatch<React.SetStateAction<boolean>>
}): React$Element<'ReservationFlowLayout'> {
  const { user, elements, setIsZeroRatesForm, stripe } = props;
  const { stallsRoutePattern, checkoutRoutePattern, rvsRoutePattern } = useReservationFlowRoutes();
  const [, setStallIsBelowMinNights] = useState(false);
  const [, setRvIsBelowMinNights] = useState(false);
  const [stallQuestionsAreValid, setStallQuestionsAreValid] = useState(true);
  const [rvQuestionsAreValid, setRvQuestionsAreValid] = useState(true);

  const { push } = useHistory();

  const {
    values: { event }
  } = useFormikContext<ReservationFormShapeType>();

  const closeDate = event.closeDate || '';
  const venueTimezone = event && event.venue.timeZone ? event.venue.timeZone : null;

  useEffect(() => {
    const eventClosingDate = moment(closeDate, DATE_FORMAT);
    eventClosingDate.tz(venueTimezone);
    if (closeDate) {
      const isEventClosed = eventClosingDate.isBefore(moment(), 'day');
      if (isEventClosed) {
        push(ROUTES.ROOT);
      }
    }
  }, [closeDate, venueTimezone]);

  return (
    <ReservationFlowLayout
      backButton={<ReservationBackButton />}
      rightColumn={
        <ReservationSummary
          user={user}
          elements={elements}
          stripe={stripe}
          setIsZeroRatesForm={setIsZeroRatesForm}
          stallQuestionsAreValid={stallQuestionsAreValid}
          rvQuestionsAreValid={rvQuestionsAreValid}
        />
      }>
      <Switch>
        <Route path={stallsRoutePattern} exact>
          <EventDetails />
          <CardSectionHeader text="Book Stalls" headerIcon={HorseShoe} />
          <DateSelectDetails key={'stalls'} type={'stalls'} setIsBelowMinNights={setStallIsBelowMinNights} />
          <StallProductSelect />
          {event.stallQuestions.length > 0 && (
            <ProductQuestions productType="stalls" questions={event.stallQuestions} setProductQuestionsAreValid={setStallQuestionsAreValid} />
          )}
          <AddOns label="ADD ONS" />
        </Route>

        <Route path={rvsRoutePattern} exact>
          <EventDetails />
          <CardSectionHeader text="Book RV Spots" headerIcon={RV} />
          <DateSelectDetails key={'rvs'} type={'rvs'} setIsBelowMinNights={setRvIsBelowMinNights} />
          <RvProductSelect />
          {event.rvQuestions.length > 0 && (
            <ProductQuestions productType="rvs" questions={event.rvQuestions} setProductQuestionsAreValid={setRvQuestionsAreValid} />
          )}
          {!event.stallProducts.length && <AddOns label="ADD ONS" />}
        </Route>

        <Route path={checkoutRoutePattern} exact>
          <RenterInformation user={user} />
          <PaymentDetails user={user} elements={elements} isGroupCodeRequired={event && event.isGroupCodeRequired} event={event} />
          <SpecialRequests />
          <CheckoutSummaryPreview />
        </Route>
      </Switch>
    </ReservationFlowLayout>
  );
}

export default ReservationForm;

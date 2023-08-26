//@flow
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { Formik } from 'formik';
import { Redirect, useHistory } from 'react-router';

import { useMutation } from '@apollo/react-hooks';

import { EventStyles } from '../Shared/EventStyles';
import { Details } from '../Shared/Details/Details';
import { Stalls } from '../Shared/Stalls';
import { Navigation } from '../Shared/Navigation/Navigation';
import { RvSpots } from '../Shared/RvSpots';
import Review from '../Shared/Review';
import { initialValues, CreateValidationSchema } from '../Shared/Form';
import routeCodes, { subRouteCodes } from '../../../constants/routes';
import { SnackbarContext } from '../../../store/SnackbarContext';
import type { SnackbarContextActionsType } from '../../../store/SnackbarContext';
import { getValueByPropPath } from '../../../utils/objectHelpers';
import { CREATE_EVENT } from '../../../mutations/CreateEvent';
import type { CreateEventInputType, CreateEventReturnType } from '../../../mutations/CreateEvent';
import { mapFormToCreateEventInput } from '../Shared/Form/mapFormToCreateEventInput';
import { EventForm } from '../Shared/Form/EventForm';

type CreateEventPropsType = {|
  className?: string
|};

const CreateEvent = ({ className = '' }: CreateEventPropsType) => {
  const [createEvent, { data, called, loading, error }] = useMutation<CreateEventReturnType, CreateEventInputType>(CREATE_EVENT);
  const { showSnackbar } = useContext<SnackbarContextActionsType>(SnackbarContext);
  const createEventError = data?.createEvent?.error;
  const [stallQuestionsAreValid, setStallQuestionsAreValid] = useState(true);
  const [rvQuestionsAreValid, setRvQuestionsAreValid] = useState(true);
  const { push } = useHistory();

  const eventId = useMemo(() => getValueByPropPath(data, 'createEvent.event.id', null), [JSON.stringify(data)]);

  useEffect(() => {
    if (eventId) {
      showSnackbar('Event created successfully', {
        error: false,
        duration: 5000
      });
    }
  }, [eventId]);

  useEffect(() => {
    if (createEventError) {
      showSnackbar(`${createEventError}`, {
        error: true
      });
    }
  }, [createEventError]);

  useEffect(() => {
    if (error) {
      const message = error.message || '';
      const res = message.match(/Unauthenticated/i);
      if (res) {
        showSnackbar('Unauthenticated user', {
          duration: 4000,
          error: true
        });
        setTimeout(() => push(routeCodes.LOGIN), 4000);
      } else {
        showSnackbar('Something went wrong', { error: true });
      }
    }
  }, [error]);

  if (eventId) return <Redirect to={subRouteCodes.ADMIN.EVENTS} />;

  return (
    <Formik
      initialValues={initialValues(null)}
      validationSchema={CreateValidationSchema}
      onSubmit={async values => {
        await createEvent({
          variables: { input: mapFormToCreateEventInput(values) }
        });
      }}>
      {({ values: { step = '' } }) => {
        return (
          <EventForm className={className} isLoading={called && loading}>
            {step === 'review' ? (
              <Review />
            ) : (
              <>
                <div className={'title'}>CREATE EVENT</div>
                <Navigation stallQuestionsAreValid={stallQuestionsAreValid} rvQuestionsAreValid={rvQuestionsAreValid} displayStallsItem displayRvsItem />
                {step === 'details' && <Details displayNextStep />}
                {step === 'stalls' && <Stalls setStallQuestionsAreValid={setStallQuestionsAreValid} />}
                {step === 'rvs' && <RvSpots setRvQuestionsAreValid={setRvQuestionsAreValid} />}
              </>
            )}
          </EventForm>
        );
      }}
    </Formik>
  );
};

export default EventStyles(CreateEvent);

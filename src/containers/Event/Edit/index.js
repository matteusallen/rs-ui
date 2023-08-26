//@flow
import React, { useEffect, useContext, useState } from 'react';
import { Formik } from 'formik';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Redirect, useHistory } from 'react-router';
import IndeterminateLoading from 'Components/Loading/IndeterminateLoading';
import routeCodes, { subRouteCodes } from '../../../constants/routes';
import { SnackbarContext } from '../../../store/SnackbarContext';
import type { SnackbarContextActionsType } from '../../../store/SnackbarContext';
import { EVENT_BY_ID } from '../../../queries/Admin/EventById';
import { EventStyles } from '../Shared/EventStyles';
import { Details } from '../Shared/Details/Details';
import { Navigation } from '../Shared/Navigation/Navigation';
import Review from '../Shared/Review';
import { initialValues, ValidationSchema as EditValidationSchema } from '../Shared/Form';
import { EDIT_EVENT } from '../../../mutations/EditEvent';
import { mapFormToEditEventInput } from '../Shared/Form/mapFormToCreateEventInput';
import { EventForm } from '../Shared/Form/EventForm';
import { EditEventInputType, EditEventReturnType } from '../../../mutations/EditEvent';
import { unauthenticatedHelper } from '../../../helpers/unauthenticatedHelper';
import { Stalls } from '../Shared/Stalls';
import { RvSpots } from '../Shared/RvSpots';

type EditEventPropsType = {|
  className?: string,
  eventId: string
|};

const EditEvent = ({ className = '', eventId }: EditEventPropsType) => {
  const [editEvent, { data: editResponse, loading: loadingEdit, error: editError }] = useMutation<EditEventReturnType, EditEventInputType>(EDIT_EVENT);
  const { showSnackbar } = useContext<SnackbarContextActionsType>(SnackbarContext);
  const [stallQuestionsAreValid, setStallQuestionsAreValid] = useState(true);
  const [rvQuestionsAreValid, setRvQuestionsAreValid] = useState(true);
  const [changesInBasicDetails, setChangesInBasicDetails] = useState({});
  const [rvSectionIsEdited, setRvSectionIsEdited] = useState(false);
  const { push } = useHistory();

  const { data, called, loading, error } = useQuery(EVENT_BY_ID, {
    fetchPolicy: 'network-only',
    variables: {
      eventId
    }
  });

  useEffect(() => {
    if (error) {
      showSnackbar(`Error getting event details.`, {
        error: true
      });
    }
  }, [error]);

  useEffect(() => {
    if (editResponse?.editEvent?.error) {
      showSnackbar(editResponse.editEvent.error, { error: true });
    }
  }, [editResponse]);

  useEffect(() => {
    if (editError) {
      if (unauthenticatedHelper(editError)) {
        showSnackbar('Unauthenticated user', { error: true });
        setTimeout(() => push(routeCodes.LOGIN), 4000);
      } else {
        showSnackbar('Something went wrong', { error: true });
      }
    }
  }, [editError]);

  if (loading || loadingEdit) {
    return <IndeterminateLoading />;
  }
  if (editResponse?.editEvent?.success) {
    showSnackbar('Event edited successfully');
    return <Redirect to={subRouteCodes.ADMIN.EVENTS} />;
  }

  const basicDetailsIsEdited = () => {
    return Object.keys(changesInBasicDetails).length !== 0;
  };

  return (
    <Formik
      initialValues={initialValues(data?.event)}
      validationSchema={EditValidationSchema}
      onSubmit={async values => {
        await editEvent({
          variables: { input: mapFormToEditEventInput(values, eventId) }
        });
      }}>
      {({ values: { step = '' } }) => {
        return (
          <EventForm className={className} isLoading={(called && loading) || loadingEdit}>
            {step === 'review' ? (
              <Review initialValues={initialValues(data?.event)} />
            ) : (
              <>
                <div className={'title'}>EDIT EVENT</div>
                <Navigation
                  initialValues={initialValues(data?.event)}
                  stallQuestionsAreValid={stallQuestionsAreValid}
                  rvQuestionsAreValid={rvQuestionsAreValid}
                  editView
                  displayStallsItem
                  displayRvsItem
                  changesInBasicDetails={changesInBasicDetails}
                  setChangesInBasicDetails={setChangesInBasicDetails}
                  basicDetailsIsEdited={basicDetailsIsEdited}
                  rvSectionIsEdited={rvSectionIsEdited}
                  setRvSectionIsEdited={setRvSectionIsEdited}
                />
                {step === 'details' && <Details displayNextStep />}
                {step === 'stalls' && <Stalls setStallQuestionsAreValid={setStallQuestionsAreValid} />}
                {step === 'rvs' && (
                  <RvSpots
                    setRvQuestionsAreValid={setRvQuestionsAreValid}
                    basicDetailsIsEdited={basicDetailsIsEdited}
                    rvSectionIsEdited={rvSectionIsEdited}
                    editView
                  />
                )}
              </>
            )}
          </EventForm>
        );
      }}
    </Formik>
  );
};

export default EventStyles(EditEvent);

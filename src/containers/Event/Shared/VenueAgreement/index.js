//@flow
import React, { useContext, useEffect } from 'react';

import { useLazyQuery } from '@apollo/react-hooks';

import { useFormikContext } from 'formik';

import { Redirect } from 'react-router';

import { SelectVenueAgreement } from './SelectVenueAgreement';
import { VenueAgreementUpload } from './VenueAgreementUpload';
import type { UserContextType } from '../../../../store/UserContextType';
import { UserContext } from '../../../../store/UserContext';
import type { VenueAgreementInputType, VenueAgreementReturnType } from '../../../../queries/Admin/CreateEvent/VenueAgreements';
import { VENUE_AGREEMENT } from '../../../../queries/Admin/CreateEvent/VenueAgreements';
import { getValueByPropPath } from '../../../../utils/objectHelpers';
import type { EventFormType } from '../Form';
import { unauthenticatedHelper } from '../../../../helpers/unauthenticatedHelper';
import routeCodes from '../../../../constants/routes';

export const VenueAgreement = () => {
  const {
    user: { venues = [] }
  } = useContext<UserContextType>(UserContext);
  const [firstVenue = {}] = venues;
  const { id: venueId } = firstVenue;
  const [loadAgreements, { data, error }] = useLazyQuery<VenueAgreementReturnType, VenueAgreementInputType>(VENUE_AGREEMENT, {
    fetchPolicy: 'network-only'
  });
  const {
    values: { venueAgreement },
    setFieldValue
  } = useFormikContext<EventFormType>();

  const agreements = getValueByPropPath(data, 'venue.venueAgreements', []);

  useEffect(() => {
    setFieldValue('agreements', agreements);
  }, [JSON.stringify(agreements)]);

  useEffect(() => {
    if (venueId) {
      loadAgreements({ variables: { id: venueId } });
    }
  }, [venueId]);

  if (unauthenticatedHelper(error)) return <Redirect to={routeCodes.LOGIN} />;

  return (
    <>
      <div className={'select-venue-agreement'}>
        <SelectVenueAgreement value={venueAgreement} name={'venueAgreement'} agreements={agreements} />
      </div>
      <VenueAgreementUpload venueId={venueId} agreements={agreements} reloadAgreements={() => loadAgreements({ variables: { id: venueId } })} />
    </>
  );
};

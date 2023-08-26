//@flow
import React, { useContext, useEffect } from 'react';

import { useLazyQuery } from '@apollo/react-hooks';

import { Redirect } from 'react-router';

import { EventCard } from '../Cards/EventCard';
import { UserContext } from '../../../../store/UserContext';
import type { UserContextType } from '../../../../store/UserContextType';
import { getValueByPropPath } from '../../../../utils/objectHelpers';
import { AddOnRows } from './AddOnRows';
import type { VenueAddOnsInputType, VenueAddOnsReturnType } from '../../../../queries/Admin/CreateEvent/VenueAddOns';
import { VENUE_ADD_ONS } from '../../../../queries/Admin/CreateEvent/VenueAddOns';
import { unauthenticatedHelper } from '../../../../helpers/unauthenticatedHelper';
import routeCodes from '../../../../constants/routes';

export const AddOns = () => {
  const {
    user: { venues = [] }
  } = useContext<UserContextType>(UserContext);
  const [firstVenue = {}] = venues;
  const { id: venueId } = firstVenue;
  const [loadAddOns, { data = {}, called, loading, error }] = useLazyQuery<VenueAddOnsReturnType, VenueAddOnsInputType>(VENUE_ADD_ONS);
  const addOns = getValueByPropPath(data, 'venue.addOns', []);

  useEffect(() => {
    if (venueId) {
      loadAddOns({
        variables: { id: venueId }
      });
    }
  }, [venueId]);

  if (unauthenticatedHelper(error)) return <Redirect to={routeCodes.LOGIN} />;

  return (
    <EventCard title={'Add Ons'} testId="event-create-addons">
      {addOns && addOns.length > 0 ? <AddOnRows addOns={addOns} /> : called && loading ? 'Loading...' : 'This venue does not have add ons'}
    </EventCard>
  );
};

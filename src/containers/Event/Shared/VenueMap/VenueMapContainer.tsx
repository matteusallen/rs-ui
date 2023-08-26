import React, { useContext, useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { useFormikContext } from 'formik';
import { Redirect } from 'react-router';
import { SelectVenueMap } from './SelectVenueMap';
import { VenueMapUpload } from './VenueMapUpload';
import { UserContextType } from '../../../../store/UserContextType';
import { UserContext } from '../../../../store/UserContext';
import { VenueMapInputType, VenueMapReturnType } from '../../../../queries/Admin/CreateEvent/VenueMaps';
import { VENUE_MAP } from '../../../../queries/Admin/CreateEvent/VenueMaps';
import { getValueByPropPath } from '../../../../utils/objectHelpers';
import { EventFormType } from '../Form';
import { unauthenticatedHelper } from '../../../../helpers/unauthenticatedHelper';
import routeCodes from '../../../../constants/routes';

export const VenueMap: React.FC = () => {
  const {
    user: { venues = [] }
  } = useContext<UserContextType>(UserContext);

  const [firstVenue = {}] = venues;
  const { id: venueId } = firstVenue;
  const [loadMaps, { data, error }] = useLazyQuery<VenueMapReturnType, VenueMapInputType>(VENUE_MAP, {
    fetchPolicy: 'network-only'
  });
  const {
    values: { venueMap },
    setFieldValue
  } = useFormikContext<EventFormType>();

  const maps = getValueByPropPath(data || {}, 'venue.venueMaps', []);

  useEffect(() => {
    setFieldValue('maps', maps);
  }, [JSON.stringify(maps)]);

  useEffect(() => {
    if (venueId) {
      loadMaps({ variables: { id: venueId } });
    }
  }, [venueId]);

  if (unauthenticatedHelper(error)) return <Redirect to={routeCodes.LOGIN} />;

  return (
    <>
      <div className={'select-venue-agreement'}>
        <SelectVenueMap value={venueMap} name={'venueMap'} maps={maps} />
      </div>
      <VenueMapUpload venueId={venueId} maps={maps} reloadMaps={() => loadMaps({ variables: { id: venueId } })} />
    </>
  );
};

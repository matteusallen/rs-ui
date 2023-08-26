//@flow
import React, { useContext, useEffect, useMemo } from 'react';
import { useFormikContext } from 'formik';
import { useLazyQuery } from '@apollo/react-hooks';
import { SelectRvLot } from './SelectRvLot';
import { ReservableSpots } from './ReservableSpots';
import { Redirect } from 'react-router';
import { BottomNavigation } from '../Navigation/BottomNavigation';
import type { EventFormType } from '../Form';
import type { UserContextType } from '../../../../store/UserContextType';
import { UserContext } from '../../../../store/UserContext';
import { VENUE_RV_LOTS } from '../../../../queries/Admin/CreateEvent/VenueRvLots';
import type { VenueRVLotsInputType, VenueRVLotsReturnType } from '../../../../queries/Admin/CreateEvent/VenueRvLots';
import { unauthenticatedHelper } from '../../../../helpers/unauthenticatedHelper';
import routeCodes from '../../../../constants/routes';
import { ProductSelectionToggle } from '../Cards/ProductSelectionToggle';
import RateCard from '../Stalls/RateCard';
import { HeadingFour } from 'Components/Headings';
import CustomQuestions from 'Components/CustomQuestions';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

export const RvSpots = ({ setRvQuestionsAreValid, basicDetailsIsEdited, rvSectionIsEdited, editView }) => {
  const {
    values: { hasRvs, rvQuestions, rvs = [] }
  } = useFormikContext<EventFormType>();
  const {
    user: { venues = [] }
  } = useContext<UserContextType>(UserContext);
  const [{ id: venueId }] = venues;

  const [loadRVLots, { data, error }] = useLazyQuery<VenueRVLotsReturnType, VenueRVLotsInputType>(VENUE_RV_LOTS);

  const rvLots = useMemo(() => (data ? data.venue.rvLots : []), [JSON.stringify(data)]);

  const renderLotNames = (inputId, disabled) => {
    return (
      <div className={'rvs-spots-form'}>
        <div className={'spot-details'}>
          <div className={'lot-select'}>
            <HeadingFour label="Lot" />
            <SelectRvLot inputId={inputId} rvLots={rvLots} name={`rvs[${inputId}].rvLotId`} disabled={disabled} />
          </div>
        </div>
      </div>
    );
  };

  const renderReservables = (rv, inputId) => {
    return (
      <div className={'rvs-spots-form'}>
        <div className={'reservable-spots'}>
          <ReservableSpots rvLots={rvLots} rvLotId={rv.rvLotId} name={`rvs[${inputId}].spots`} />
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (venueId) {
      loadRVLots({ variables: { id: venueId } });
    }
  }, [venueId]);

  if (unauthenticatedHelper(error)) return <Redirect to={routeCodes.LOGIN} />;

  const cards = rvs.map((rv, index) => {
    return (
      <RateCard
        index={index}
        key={index}
        productType="rvs"
        stallsPerBuilding={null}
        renderLotNames={disabled => renderLotNames(index, disabled)}
        renderReservables={() => renderReservables(rv, index)}
        scope="hasRvs"
      />
    );
  });

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <ProductSelectionToggle header="Configure RV Spots" scope="hasRvs" product="rvs" />
        {hasRvs && (
          <div data-testid="create-event-rvs">
            <CustomQuestions productType="rvs" questions={rvQuestions} setProductQuestionsAreValid={setRvQuestionsAreValid} />
            {cards}
          </div>
        )}
        <BottomNavigation
          back={'stalls'}
          backLabel={'BACK TO STALLS'}
          showSubmit
          editView={editView}
          basicDetailsIsEdited={basicDetailsIsEdited}
          rvSectionIsEdited={rvSectionIsEdited}
        />
      </DndProvider>
    </>
  );
};

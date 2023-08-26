//@flow
import React from 'react';
import { useFormikContext } from 'formik';
import { useQuery } from '@apollo/react-hooks';
import { Redirect } from 'react-router';
import { BottomNavigation } from '../Navigation/BottomNavigation';
import { ProductSelectionToggle } from '../Cards/ProductSelectionToggle';
import type { EventFormType } from '../Form';
import { STALLS_QUERY } from '../../../../queries/Admin/CreateEvent/CreateEventsStalls';
import RateCard from './RateCard';
import { getValueByPropPath } from '../../../../utils/objectHelpers';
import { useValidations } from '../Form/useValidations';
import routeCodes from '../../../../constants/routes';
import { unauthenticatedHelper } from '../../../../helpers/unauthenticatedHelper';
import CustomQuestions from 'Components/CustomQuestions';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

export const Stalls = ({ setStallQuestionsAreValid }) => {
  const {
    values: { stalls, hasStalls, stallQuestions }
  } = useFormikContext<EventFormType>();
  const { data, called, loading, error } = useQuery(STALLS_QUERY);
  const stallsPerBuilding = called && !loading && !error ? getValueByPropPath(data, 'venue.buildings') : null;
  const { isStallsValid: isValid } = useValidations();

  if (unauthenticatedHelper(error)) return <Redirect to={routeCodes.LOGIN} />;
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <ProductSelectionToggle header="Configure Stalls" scope="hasStalls" product="stalls" />
        {hasStalls && (
          <div data-testid="create-event-stalls">
            <CustomQuestions productType="stalls" questions={stallQuestions} setProductQuestionsAreValid={setStallQuestionsAreValid} />
            {stalls.map((stall, index) => {
              const key = `stall-rate-${index}`;
              return (
                <RateCard
                  renderLotNames={() => null}
                  renderReservables={() => null}
                  index={index}
                  key={key}
                  stallsPerBuilding={stallsPerBuilding}
                  productType="stalls"
                  scope="hasStalls"
                />
              );
            })}
          </div>
        )}
        <BottomNavigation next={'rvs'} nextLabel={'NEXT: ADD RV SPOTS'} back={'details'} backLabel={'BACK TO BASIC DETAILS'} isValid={isValid} />
      </DndProvider>
    </>
  );
};

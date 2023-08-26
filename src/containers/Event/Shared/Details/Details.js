//@flow
import React from 'react';

import { BasicInformation } from './BasicInformation';
import { Dates } from './Dates';
import { AddOns } from '../AddOns';
import { BottomNavigation } from '../Navigation/BottomNavigation';
import { useValidations } from '../Form/useValidations';

export const Details = ({ displayNextStep }) => {
  const { isDetailsValid: isValid } = useValidations();

  return (
    <>
      <BasicInformation />

      <Dates />

      <AddOns />

      {displayNextStep && <BottomNavigation next={'stalls'} nextLabel={'NEXT: ADD STALLS'} isValid={isValid} />}
    </>
  );
};

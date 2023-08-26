//@flow
import { useFormikContext } from 'formik';

import type { EventFormType } from './FormTypes';

export const useValidations = (): {
  isDetailsValid: boolean,
  isRvSpotsValid: boolean,
  isStallsValid: boolean
} => {
  const { errors, values } = useFormikContext<EventFormType>();
  const addOnErrors = errors.addOns || [];

  const isDetailsValid =
    !errors.eventName &&
    !errors.checkInTime &&
    !errors.eventDescription &&
    !errors.checkOutTime &&
    !errors.bookingWindow &&
    !errors.openTime &&
    !errors.closeTime &&
    !errors.eventDates &&
    !errors.stallQuestions &&
    !errors.venueAgreement &&
    addOnErrors.filter(e => !!e).length === 0 &&
    (!values.allowDefferedEnabled || (values.allowDefferedEnabled && values.renterGroupCodeMode.length));

  const stallErrors = errors.stalls || [];
  const isStallsValid = values.hasStalls ? stallErrors.length === 0 && !values.hasEmptyStallAnswer : true;

  const rvErrors = errors.rvs || [];
  const isRvSpotsValid = values.hasRvs ? rvErrors.length === 0 && !values.hasEmptyRvAnswer : true;

  return { isDetailsValid, isStallsValid, isRvSpotsValid };
};

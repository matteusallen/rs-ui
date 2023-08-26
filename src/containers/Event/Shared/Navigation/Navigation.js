//@flow
import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';

import { useHistory } from 'react-router';

import { Breadcrumbs } from './Breadcrumbs';
import Button from '../../../../components/Button';
import type { EventFormType } from '../Form';
import { subRouteCodes } from '../../../../constants/routes';
import { rvSectionHasChanged } from './rvSectionHasChanged';

export const Navigation = ({
  stallQuestionsAreValid,
  rvQuestionsAreValid,
  displayStallsItem,
  displayRvsItem,
  editView,
  initialValues = {},
  changesInBasicDetails,
  setChangesInBasicDetails,
  basicDetailsIsEdited,
  rvSectionIsEdited,
  setRvSectionIsEdited
}) => {
  const { touched, isSubmitting, setFieldValue, isValid, values, dirty } = useFormikContext<EventFormType>();

  const { push } = useHistory();

  useEffect(() => {
    if (editView) {
      hasBasicDetailsChanged();
      setRvSectionIsEdited(rvSectionHasChanged(initialValues, values));
    }
  }, [values]);

  const formFieldCurrentValues = Object.entries(values).filter(([key]) => {
    if (Object.keys(initialValues).findIndex(e => e === key) > 0) {
      return true;
    }

    return false;
  });

  const formFieldCurrentValueMap = new Map(formFieldCurrentValues);

  const hasBasicDetailsChanged = () => {
    const changed = {};

    if (formFieldCurrentValueMap.get('eventName') !== initialValues['eventName']) {
      changed.eventName = true;
    } else {
      delete changed.eventName;
    }

    if (formFieldCurrentValueMap.get('eventDescription') !== initialValues['eventDescription']) {
      changed.eventDescription = true;
    } else {
      delete changed.eventDescription;
    }

    const [ciChangedHour, ciChangedMinutes] = formFieldCurrentValueMap.get('checkInTime').split(':');
    const transformedChangedCheckIn = ciChangedHour + ':' + ciChangedMinutes;
    const [ciHour, ciMinutes] = initialValues['checkInTime'].split(':');
    const transformedCheckIn = ciHour + ':' + ciMinutes;

    if (transformedChangedCheckIn !== transformedCheckIn) {
      changed.checkInTime = true;
    } else {
      delete changed.checkInTime;
    }

    const [coChangedHour, coChangedMinutes] = formFieldCurrentValueMap.get('checkOutTime').split(':');
    const transformedChangedCheckOut = coChangedHour + ':' + coChangedMinutes;
    const [coHour, coMinutes] = initialValues['checkOutTime'].split(':');
    const transformedCheckOut = coHour + ':' + coMinutes;

    if (transformedChangedCheckOut !== transformedCheckOut) {
      changed.checkOutTime = true;
    } else {
      delete changed.checkOutTime;
    }

    if (formFieldCurrentValueMap.get('venueAgreement') !== initialValues['venueAgreement']) {
      changed.venueAgreement = true;
    } else {
      delete changed.venueAgreement;
    }

    if (formFieldCurrentValueMap.get('venueMap') !== initialValues['venueMap']) {
      changed.venueMap = true;
    } else {
      delete changed.venueMap;
    }

    if (formFieldCurrentValueMap.get('renterGroupCodeMode') !== initialValues['renterGroupCodeMode']) {
      changed.renterGroupCodeMode = true;
    } else {
      delete changed.renterGroupCodeMode;
    }

    if (
      formFieldCurrentValueMap.get('eventDates').startDate !== initialValues['eventDates'].startDate ||
      formFieldCurrentValueMap.get('eventDates').endDate !== initialValues['eventDates'].endDate
    ) {
      changed.eventDates = true;
    } else {
      delete changed.eventDates;
    }

    if (
      formFieldCurrentValueMap.get('bookingWindow').startDate !== initialValues['bookingWindow'].startDate ||
      formFieldCurrentValueMap.get('bookingWindow').endDate !== initialValues['bookingWindow'].endDate
    ) {
      changed.bookingWindow = true;
    } else {
      delete changed.bookingWindow;
    }

    if (formFieldCurrentValueMap.get('openTime') !== initialValues['openTime']) {
      changed.openTime = true;
    } else {
      delete changed.openTime;
    }

    if (formFieldCurrentValueMap.get('closeTime') !== initialValues['closeTime']) {
      changed.closeTime = true;
    } else {
      delete changed.closeTime;
    }

    if (formFieldCurrentValueMap.get('addOns').length !== initialValues['addOns'].length) {
      changed.addOnsLength = true;
    } else {
      delete changed.addOnsLength;
    }

    const addOnsChanged =
      formFieldCurrentValueMap.get('addOns').length &&
      initialValues['addOns'].filter(initialAddOn => {
        const [currentAddon] = formFieldCurrentValueMap.get('addOns').filter(innerAddOn => innerAddOn.addOnProductId === initialAddOn.addOnProductId);
        if (currentAddon) {
          if (currentAddon.id !== initialAddOn.id || +currentAddon.price !== +initialAddOn.price || currentAddon.disabled !== initialAddOn.disabled) {
            return true;
          }
        }

        return false;
      });

    if (addOnsChanged.length) {
      changed.addOns = true;
    } else {
      delete changed.addOns;
    }

    setChangesInBasicDetails(changed);
  };

  return (
    <div className={'sub-nav'}>
      <Breadcrumbs displayStallsItem={displayStallsItem} displayRvsItem={displayRvsItem} />
      <div className={'actions'}>
        <div className={'actions-item'}>
          <Button
            secondary
            disabled={!touched}
            onClick={() => {
              if (editView ? Object.keys(changesInBasicDetails).length : dirty) {
                const yes = confirm('are you sure you want to discard unsaved changes?');
                if (yes) push(subRouteCodes.ADMIN.EVENTS);
              } else {
                push(subRouteCodes.ADMIN.EVENTS);
              }
            }}>
            Cancel
          </Button>
        </div>
        <div className={'actions-item'}>
          <Button
            onClick={e => {
              e.preventDefault();
              window.scrollTo(0, 0);
              setFieldValue('step', 'review');
            }}
            primary
            isLoading={values.isLoading || isSubmitting}
            disabled={
              values.isLoading ||
              isSubmitting ||
              !isValid ||
              values.hasEmptyRvAnswer ||
              values.hasEmptyStallAnswer ||
              !stallQuestionsAreValid ||
              !rvQuestionsAreValid ||
              (editView && !basicDetailsIsEdited() && !rvSectionIsEdited)
            }>
            REVIEW & SAVE
          </Button>
        </div>
      </div>
    </div>
  );
};

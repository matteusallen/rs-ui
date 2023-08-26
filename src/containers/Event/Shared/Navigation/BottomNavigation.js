//@flow
import React from 'react';
import { useFormikContext } from 'formik';

import Button from '../../../../components/Button';
import type { EventFormType } from '../Form';

type BottomNavigationPropsType = {|
  back?: string,
  backLabel?: string,
  isValid?: boolean,
  next?: string,
  nextLabel?: string,
  showSubmit?: boolean
|};

export const BottomNavigation = ({
  next,
  back,
  nextLabel,
  backLabel,
  isValid,
  showSubmit,
  editView,
  rvSectionIsEdited,
  basicDetailsIsEdited
}: BottomNavigationPropsType) => {
  const {
    setFieldValue,
    values: { isLoading, hasEmptyRvAnswer, hasEmptyStallAnswer }
  } = useFormikContext<EventFormType>();
  const setStep = (step: string) => {
    window.scrollTo(0, 0);
    setFieldValue('step', step);
  };
  const { isSubmitting, isValid: isFormValid } = useFormikContext<EventFormType>();

  const reviewIsDisabled = () => {
    return isLoading || isSubmitting || !isFormValid || hasEmptyRvAnswer || hasEmptyStallAnswer || (editView && !basicDetailsIsEdited() && !rvSectionIsEdited);
  };
  return (
    <div className={`bottom-navigation ${!back && !!next ? 'solo' : ''}`}>
      {!!back && (
        <a tabIndex={0} role={'button'} onKeyPress={() => setStep(back)} onClick={() => setStep(back)}>
          {backLabel}
        </a>
      )}

      {!!next && (
        <Button type={'button'} className={'next'} tertiary onClick={() => setStep(next)} disabled={!isValid}>
          {nextLabel}
        </Button>
      )}
      {!!showSubmit && (
        <Button
          type={'submit'}
          onClick={e => {
            e.preventDefault();
            window.scrollTo(0, 0);
            setFieldValue('step', 'review');
          }}
          primary
          isLoading={isLoading || isSubmitting}
          disabled={reviewIsDisabled()}>
          REVIEW & SAVE
        </Button>
      )}
    </div>
  );
};

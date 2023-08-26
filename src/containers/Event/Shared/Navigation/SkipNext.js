//@flow
import React from 'react';
import { useFormikContext } from 'formik';

import type { EventFormType } from '../Form';

type SkipNextPropsType = {|
  step: string
|};

export const SkipNext = ({ step }: SkipNextPropsType) => {
  const {
    setFieldValue,
    values: { hasStalls }
  } = useFormikContext<EventFormType>();
  return (
    <div className={`skip ${hasStalls ? 'disabled' : ''}`}>
      <a
        tabIndex={0}
        role={'button'}
        onKeyPress={!hasStalls ? () => setFieldValue('step', step) : undefined}
        onClick={!hasStalls ? () => setFieldValue('step', step) : undefined}>
        {step === 'rvs' && 'SKIP TO RV SPOTS'}
      </a>
    </div>
  );
};

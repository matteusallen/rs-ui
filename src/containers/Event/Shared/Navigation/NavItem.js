//@flow
import React from 'react';
import { useFormikContext } from 'formik';

import type { EventFormType } from '../Form';
import { useValidations } from '../Form/useValidations';

type StepLinkPropsType = {|
  label: string,
  step: string
|};

export const NavItem = ({ step, label }: StepLinkPropsType) => {
  const {
    values: { step: stepFormikValue },
    setFieldValue
  } = useFormikContext<EventFormType>();

  const { isDetailsValid, isStallsValid, isRvSpotsValid } = useValidations();

  const allowedSteps = {
    details: [],
    stalls: ['details'],
    rvs: ['stalls', 'details']
  };
  const validSteps = {
    details: isDetailsValid,
    stalls: isDetailsValid && isStallsValid,
    rvs: isDetailsValid && isStallsValid && isRvSpotsValid
  };

  const handleClick = () => {
    if (clickAble() && stepFormikValue !== step) setFieldValue('step', step);
  };

  const clickAble = () => {
    const steps = allowedSteps[stepFormikValue] || [];
    const isValid = validSteps[step] || false;
    return isValid || steps.some(path => path === step) || stepFormikValue === step;
  };

  return (
    <a
      className={`breadcrumbs-item ${clickAble() ? '' : 'disabled'} ${stepFormikValue === step ? 'active' : ''}`}
      onClick={handleClick}
      onKeyPress={handleClick}
      tabIndex={0}
      role={'button'}>
      {label}
    </a>
  );
};

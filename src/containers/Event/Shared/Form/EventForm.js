//@flow
import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';

import type { EventFormType } from './FormTypes';

type EventFormPropsType = {|
  children: React$Node,
  className?: string,
  isLoading: boolean
|};

export const EventForm = ({ children, className, isLoading }: EventFormPropsType) => {
  const { setFieldValue } = useFormikContext<EventFormType>();
  useEffect(() => {
    setFieldValue('isLoading', isLoading);
  }, [isLoading]);
  return <form className={className}>{children}</form>;
};

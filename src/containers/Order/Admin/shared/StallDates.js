//@flow
import React, { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import { Moment } from 'moment';
import styled from 'styled-components';

import Checkbox from '../../../../components/Checkbox';
import colors from '../../../../styles/Colors';

type StallDatesPropsType = {|
  children: (values: {
    checked: boolean,
    showCheckbox: boolean,
    toggleCheckbox: () => void
  }) => React$Node,
  resEnd: Moment | null,
  resStart: Moment | null,
  rvEndDateStr: string | null,
  rvStartDateStr: string | null,
  stallsEndDateStr: string | null,
  stallsStartDateStr: string | null,
  checkMinNightsWithParams: () => void
|};

export const StallDates = ({
  children,
  rvStartDateStr,
  rvEndDateStr,
  stallsStartDateStr,
  stallsEndDateStr,
  resStart,
  resEnd,
  checkMinNightsWithParams
}: StallDatesPropsType) => {
  const { values, setFieldValue } = useFormikContext();
  const { sameDates } = values;
  const [checked, setResDatesChecked] = useState(sameDates);

  const setDatesFromStalls = (checked: boolean) => {
    if (checked && resStart && resEnd) {
      setFieldValue('rv_spot', {
        ...values.rv_spot,
        start: resStart,
        end: resEnd
      });
    }
  };

  const toggleCheckbox = () => {
    const newValue = !checked;
    setDatesFromStalls(newValue);
    setResDatesChecked(newValue);
    checkMinNightsWithParams({ startDate: resStart, endDate: resEnd });
  };

  useEffect(() => {
    if ((stallsStartDateStr !== rvStartDateStr || rvEndDateStr !== stallsEndDateStr) && checked) {
      setDatesFromStalls(checked);
    }
  }, [rvStartDateStr, rvEndDateStr, checked, stallsStartDateStr, stallsEndDateStr]);

  useEffect(() => {
    setFieldValue('sameDates', checked);
  }, [checked]);

  const showCheckbox = Boolean(resEnd && resStart);

  return <>{children({ checked, toggleCheckbox, showCheckbox })}</>;
};

export const StyledCheckbox = styled(Checkbox)`
  &&& {
    span svg {
      color: ${colors.secondary};
    }
  }
`;

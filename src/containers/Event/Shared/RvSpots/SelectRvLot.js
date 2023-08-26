//@flow
import React, { useEffect, useMemo } from 'react';
import { MenuItem, FormControl, InputLabel } from '@material-ui/core';
import { Field, useFormikContext } from 'formik';
import { Select } from 'formik-material-ui';

import type { RvLotType } from '../../../../queries/Admin/CreateEvent/VenueRvLots';
import type { EventFormType } from '../Form';
import { getValueByPropPath } from '../../../../utils/objectHelpers';

type SelectRvLotPropsType = {|
  inputId: number,
  name: string,
  rvLots: RvLotType[],
  disabled?: boolean
|};

export const SelectRvLot = ({ rvLots, name, inputId, disabled }: SelectRvLotPropsType) => {
  const { values, setFieldValue } = useFormikContext<EventFormType>();
  const value = getValueByPropPath(values, name);
  const { rvs, hasRvs } = values;

  const options = useMemo(
    () =>
      rvLots.map(({ id, name }) => {
        return (
          <MenuItem key={id} value={id}>
            {name}
          </MenuItem>
        );
      }),
    [JSON.stringify(rvLots), name, JSON.stringify(rvs)]
  );

  useEffect(() => {
    const rv = getValueByPropPath(values, `rvs[${inputId}]`, {});
    if (value) {
      const rvLot = rvLots.find(lot => rv.rvLotId && lot.id === rv.rvLotId);
      if (rvLot) setFieldValue(`rvs[${inputId}]`, { ...rv, rvLot: { ...rvLot } });
    } else {
      setFieldValue(`rvs[${inputId}]`, { ...rv, rvLot: undefined });
    }
  }, [value]);

  return (
    <div className={'select-field'}>
      <FormControl>
        <InputLabel htmlFor={name}>&nbsp;</InputLabel>
        <Field
          as="select"
          name={name}
          render={({ meta = {}, ...props }) => (
            <Select
              {...props}
              meta={meta}
              error={meta.touched && meta.error ? meta.error : null}
              disabled={!hasRvs || disabled}
              helperText={meta.touched && meta.error ? meta.error : null}>
              {options}
            </Select>
          )}
        />
      </FormControl>
    </div>
  );
};

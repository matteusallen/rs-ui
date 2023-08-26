//@flow
import React, { useEffect, useMemo } from 'react';
import { InputLabel, MenuItem } from '@material-ui/core';
import { Field, useFormikContext } from 'formik';
import FormControl from '@material-ui/core/FormControl';
import { Select } from 'formik-material-ui';

import type { AddOnType } from '../../../../queries/Admin/CreateEvent/VenueAddOns';
import type { EventFormType } from './FormTypes';
import { getValueByPropPath } from '../../../../utils/objectHelpers';

type CardSelectPropsType = {|
  addOns: AddOnType[],
  formId: number,
  name: string,
  disabled: boolean
|};

export const CardSelect = ({ formId, name, addOns, disabled }: CardSelectPropsType) => {
  const {
    values: { addOns: selectedAddOns },
    setFieldValue
  } = useFormikContext<EventFormType>();
  const currentId = getValueByPropPath({ addOns: selectedAddOns }, name);

  const items = useMemo(
    () =>
      addOns
        .filter(({ id }) => {
          if (currentId && id === currentId) return true;
          return !selectedAddOns.some(selectedItem => selectedItem.id === id);
        })
        .map(({ id, name }) => (
          <MenuItem key={id} value={id}>
            {name}
          </MenuItem>
        )),
    [JSON.stringify(addOns), currentId]
  );

  useEffect(() => {
    if (currentId) {
      const current = addOns.find(({ id }) => currentId && id === currentId) || { name: '', unitName: '' };
      setFieldValue(`addOns[${formId}].name`, current.name);
      setFieldValue(`addOns[${formId}].unitName`, current.unitName);
    }
  }, [currentId]);

  return (
    <div className={`card-select ${disabled && 'card-select__disabled'}`}>
      <FormControl>
        <InputLabel htmlFor="addOns">Add On</InputLabel>
        <Field
          as="select"
          name={name}
          render={({ meta, ...props }) => (
            <Select {...props} meta={meta} error={meta.touched && meta.error ? meta.error : null} helperText={meta.touched && meta.error ? meta.error : null}>
              {items}
            </Select>
          )}
        />
      </FormControl>
    </div>
  );
};

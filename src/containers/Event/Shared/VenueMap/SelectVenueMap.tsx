import React, { useMemo } from 'react';
import FormControl from '@material-ui/core/FormControl';
import { Field } from 'formik';
import { Select } from 'formik-material-ui';
import { InputLabel, MenuItem } from '@material-ui/core';
import { DocumentType } from '../../../../queries/Admin/CreateEvent/VenueMaps';

type VenueMapPropsType = {
  maps: DocumentType[];
  value?: string;
  name: string;
};

export const SelectVenueMap: React.FC<VenueMapPropsType> = ({ name, maps, value }) => {
  const items = useMemo<JSX.Element[]>(
    () =>
      maps?.map(({ id, name }) => (
        <MenuItem key={id} value={id}>
          {name}
        </MenuItem>
      )),
    [JSON.stringify(maps)]
  );

  return (
    <FormControl>
      <InputLabel htmlFor={name}>&nbsp;</InputLabel>
      <Field as="select" name={name} component={Select} value={value}>
        {items}
      </Field>
    </FormControl>
  );
};

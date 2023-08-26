//@flow
import React, { useMemo } from 'react';
import FormControl from '@material-ui/core/FormControl';
import { Field } from 'formik';
import { Select } from 'formik-material-ui';
import { InputLabel, MenuItem } from '@material-ui/core';

import type { DocumentType } from '../../../../queries/Admin/CreateEvent/VenueAgreements';

type VenueAgreementPropsType = {|
  agreements: DocumentType[],
  value?: string,
  name: string
|};

export const SelectVenueAgreement = ({ name, agreements, value }: VenueAgreementPropsType) => {
  const items = useMemo<React$Node[]>(
    () =>
      agreements?.map(({ id, name }) => (
        <MenuItem key={id} value={id}>
          {name}
        </MenuItem>
      )),
    [JSON.stringify(agreements)]
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

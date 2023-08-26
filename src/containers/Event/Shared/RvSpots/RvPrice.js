//@flow
import React from 'react';
import { Field, useFormikContext } from 'formik';

import FormikMoneyField, { cleanMoneyInput } from '../../../../components/Fields/FormikMoneyField';
import type { EventFormType } from '../Form';

type RvPricePropsType = {|
  name: string
|};

export const RvPrice = ({ name }: RvPricePropsType) => {
  const { setFieldValue, values } = useFormikContext<EventFormType>();
  return (
    <Field
      name={name}
      type="number"
      render={({ field, meta = {} }) => {
        return (
          <FormikMoneyField
            {...field}
            {...meta}
            className={'rv-price'}
            error={meta.touched && meta.error ? meta.error : undefined}
            helperText={meta.touched && meta.error ? meta.error : undefined}
            label="NIGHTLY PRICE PER SPOT"
            disabled={!values.hasRvs}
            variant="filled"
            onChange={e => {
              setFieldValue(name, cleanMoneyInput(e.target.value));
            }}
          />
        );
      }}
    />
  );
};

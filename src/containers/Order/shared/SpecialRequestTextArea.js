import React from 'react';
import { useFormikContext, Field } from 'formik';

import { FormikField } from '../../../components/Fields';

const SpecialRequestsTextArea = () => {
  const { values } = useFormikContext();

  return (
    <Field
      id="special-request-field"
      component={FormikField}
      label="SPECIAL REQUESTS"
      type="text"
      autoComplete="renterNotes"
      multiline
      rows="1"
      variant="filled"
      name="renterNotes"
      disabled={values.reservationEdit}
      inputProps={{ maxLength: 250 }}
    />
  );
};

export default SpecialRequestsTextArea;

import React from 'react';
import { Field } from 'formik';
import { TextField } from 'Components/Fields';
import IncrementerIcon from 'Components/NumberIncrementer/IncrementerIcon';
import styled from 'styled-components';

const MinNightsInput = ({ fieldName, setFieldValue, values, scope }) => {
  const quantityChange = async newValue => {
    let value = newValue;
    await setFieldValue(fieldName, Number(value) <= 0 ? '' : value.replace(/[^0-9]/g, ''));
  };

  const increment = async field => {
    let value = Number(field.value) + 1;
    quantityChange(value.toString());
  };

  const decrement = async field => {
    let value = Number(field.value) - 1;
    quantityChange(value.toString());
  };

  return (
    <div className="question-bloc">
      <Field name={fieldName} variant="filled">
        {({ field, meta }) => (
          <IncrementerContainer>
            <IncrementerIcon increment={() => increment(field)} decrement={() => decrement(field)} top={8} right={6} />
            <TextField
              {...field}
              {...meta}
              autoComplete={fieldName}
              disabled={!values[scope]}
              error={meta && meta.touched && meta.error ? 'Invalid min nights' : undefined}
              helperText={meta && meta.touched && meta.error ? 'Invalid min nights' : undefined}
              inputProps={{ maxLength: 3 }}
              label={'MIN NIGHTS'}
              onChange={e => quantityChange(e.target.value)}
              type={'number'}
              variant={'filled'}
            />
          </IncrementerContainer>
        )}
      </Field>
    </div>
  );
};

export default MinNightsInput;

const IncrementerContainer = styled.div`
  & {
    position: relative;
  }
`;

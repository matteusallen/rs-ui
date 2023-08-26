import React, { FC } from 'react';
import { Field } from 'formik';
import { TextField } from 'Components/Fields';
import styled from 'styled-components';

interface FieldProps {
  field: any;
  meta: any;
}

export interface LengthInputsProps {
  lengthChange: (newValue: string, fieldName: string) => void;
  minLengthfieldName: string;
  maxLengthfieldName: string;
  hasError: boolean;
}

export const LengthInputs: FC<LengthInputsProps> = ({ lengthChange, minLengthfieldName, maxLengthfieldName, hasError }) => {
  return (
    <>
      <Field name={minLengthfieldName} variant="standard">
        {({ field, meta }: FieldProps) => (
          <LengthInputContainer>
            <TextField
              {...field}
              {...meta}
              autoComplete={minLengthfieldName}
              error={hasError}
              helperText={hasError ? 'Invalid length' : ''}
              inputProps={{ maxLength: 3 }}
              label={'MIN LENGTH'}
              onChange={e => lengthChange(e.target.value, minLengthfieldName)}
              type={'number'}
              variant={'standard'}
              InputLabelProps={{
                shrink: true
              }}
            />
          </LengthInputContainer>
        )}
      </Field>
      <Field name={maxLengthfieldName} variant="standard">
        {({ field, meta }: FieldProps) => (
          <LengthInputContainer>
            <TextField
              {...field}
              {...meta}
              autoComplete={maxLengthfieldName}
              error={hasError}
              helperText={hasError ? 'Invalid length' : ''}
              inputProps={{ maxLength: 3 }}
              label={'MAX LENGTH'}
              onChange={e => lengthChange(e.target.value, maxLengthfieldName)}
              type={'number'}
              variant={'standard'}
              InputLabelProps={{
                shrink: true
              }}
            />
          </LengthInputContainer>
        )}
      </Field>
    </>
  );
};

const LengthInputContainer = styled.div`
  & {
    width: 95px;
    margin-left: 20px;

    > div {
      margin: 0 !important;
      background-color: #fff !important;
    }
  }
`;

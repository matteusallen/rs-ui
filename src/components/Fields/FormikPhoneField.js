import React from 'react';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';

import { paragraphReg } from '../../styles/Typography';
import colors from '../../styles/Colors';

const FormikPhoneField = props => {
  const { value, onChange, className, label, name, ...otherProps } = props;
  delete otherProps.initialError;
  delete otherProps.initialValue;
  delete otherProps.initialTouched;

  const maskPhoneNumber = () => {
    if (!value || value.length <= 3) return value;
    if (value.length <= 6) return `(${value.slice(0, 3)}) ${value.slice(3)}`;
    return `(${value.slice(0, 3)}) ${value.slice(3, 6)} - ${value.slice(6, 10)}`;
  };

  return (
    <TextField
      id="phone-field"
      {...otherProps}
      className={className}
      label={label}
      type="tel"
      name={name}
      autoComplete={name}
      variant="filled"
      value={maskPhoneNumber()}
      onChange={onChange}
      inputProps={{ maxLength: 16 }}
    />
  );
};

export default styled(FormikPhoneField)`
  width: 100%;
  &&& {
    margin-top: 20px;
    margin-bottom: 20px;

    .MuiFilledInput-root {
      background-color: ${colors.background.primary};
      font-family: 'IBMPlexSans-Regular';

      &:hover {
        background-color: ${colors.background.primary_hover};
      }
    }
    .MuiFilledInput-root.Mui-disabled {
      background-color: ${colors.background.primary_hover};
      opacity: 0.5;
    }
    .MuiFilledInput-input {
      color: ${colors.text.primary};
      '& $error': {
        color: ${colors.error.primary};
      }
    }
    .MuiFilledInput-underline.Mui-error:after {
      border-bottom-color: ${colors.error.primary};
    }
    .MuiFilledInput-underline:after {
      border-bottom-color: ${colors.border.secondary};
    }
    .MuiFormLabel-root {
      ${paragraphReg};
      color: ${colors.text.secondary};
      font-size: 0.9375rem;
      line-height: 24px;
    }
    .MuiFormLabel-root.Mui-disabled {
      opacity: 0.5;
    }
    .MuiFormHelperText-root {
      text-transform: uppercase;
    }
    .Mui-error {
      color: ${colors.error.primary};
    }
  }
`;

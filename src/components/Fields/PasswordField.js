import React, { useState } from 'react';
import styled from 'styled-components';

import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';

import { paragraphReg } from 'Styles/Typography';
import colors from 'Styles/Colors';

function PasswordField(props) {
  const [showPassword, setShowPassword] = useState(false);
  const { value, onChange, className, label, name, ...otherProps } = props;

  function handleMouseDownPassword(event) {
    event.preventDefault();
  }

  return (
    <TextField
      id="password-field"
      {...otherProps}
      className={className}
      classes={{
        root: 'password-field'
      }}
      label={label}
      type={showPassword ? 'text' : 'password'}
      name={name}
      autoComplete={name}
      variant="filled"
      value={value}
      onChange={onChange}
      InputProps={{
        classes: {
          adornedEnd: 'password-field__adorned-end'
        },
        endAdornment: (
          <InputAdornment
            position="end"
            classes={{
              root: 'password-field__adornment'
            }}>
            <IconButton
              classes={{
                root: 'password-field__adornment-button'
              }}
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              onMouseDown={handleMouseDownPassword}>
              {showPassword ? 'HIDE' : 'SHOW'}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
}

export default styled(PasswordField)`
  &&&.password-field {
    width: 100%;
    font-size: 15px;
    margin-bottom: 20px;
    text-transform: uppercase;
    background-color: ${colors.background.primary};
    .MuiInputLabel-formControl {
      color: #242424;
      font-size: 15px;
    }
    .MuiInputLabel-shrink {
      color: #adadad;
    }
    .MuiFormLabel-root.Mui-error {
      color: ${colors.error.primary};
    }
    .MuiFilledInput-underline.Mui-error:after {
      border-bottom-color: ${colors.error.primary};
    }
    .MuiFilledInput-underline:after {
      border-bottom-color: ${colors.border.secondary};
    }
    .Mui-error {
      color: ${colors.error.primary};
    }
    input,
    label {
      font-family: 'IBMPlexSans-Regular';
      background-color: ${colors.background.primary};
    }
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px ${colors.background.primary} inset !important;
    }

    .password-field__adornment {
      background-color: transparent;

      .password-field__adornment-button {
        &:hover {
          background-color: transparent;
        }
      }
    }
    .password-field__adorned-end {
      background-color: transparent;
    }
  }

  span[class^='MuiIconButton-label'],
  span[class*='MuiIconButton-label'] {
    ${paragraphReg}
    font-size: 0.9375rem;
    color: ${colors.text.link};
  }
`;

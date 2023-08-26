// @flow
import React from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormLabel from '@material-ui/core/FormLabel';

import colors from '../../../styles/Colors';

// eslint-disable-next-line
const TextFilterBase = ({ field, form, ...props }) => {
  const { className, fieldlabel, value, clear, ...rest } = props;

  return (
    <div className={`${className}__text-filter`}>
      <FormLabel>
        {fieldlabel}
        {value && (
          <button
            type="button"
            onClick={e => {
              clear(e, field.name, form);
            }}
            className="clear">
            clear
          </button>
        )}
      </FormLabel>
      <TextField
        {...rest}
        {...field}
        value={value}
        id={fieldlabel}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
      />
    </div>
  );
};

const TextFilter = styled(TextFilterBase)`
  &__text-filter {
    margin: 0 0 25px 0;

    .clear {
      color: #2875c3;
      float: right;
      text-transform: uppercase;
      font-family: 'IBMPlexSans-Bold';
      cursor: pointer;
      font-size: 12px;
      background: none;
      border: 0;
      padding: 0;
      position: relative;
      top: -2px;
    }

    .MuiTextField-root {
      width: 100%;
    }

    .Mui-disabled {
      background: #f2f4f7;

      svg {
        color: #576574;
      }
    }

    .MuiOutlinedInput-notchedOutline {
      border-color: ${colors.text.lightGray2};
    }

    .MuiOutlinedInput-adornedStart {
      padding-left: 10px;
    }

    svg {
      color: ${colors.text.accent};
    }

    label {
      display: block;
      text-transform: uppercase;
      font-family: 'IBMPlexSans-Bold';
      font-size: 12px;
      color: ${colors.text.secondary};
      margin-bottom: 10px;
    }

    input {
      padding: 10px 14px 10px 2px;
      font-size: 15px;
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 1000px white inset !important;
    }
  }
`;

export default TextFilter;

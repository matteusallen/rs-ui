// @flow
import React from 'react';
import styled from 'styled-components';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

import { paragraphReg } from '../../styles/Typography';
import colors from '../../styles/Colors';

export type OptionType = {|
  disabled: boolean,
  id: string,
  label: string,
  name: string,
  value: string | number
|};

export type SelectPropsType = {|
  cb: (option: OptionType) => void,
  className: string,
  label: string,
  options: Array<OptionType>,
  selectedOption: string
|};

const OutlinedSelect = (props: SelectPropsType) => {
  const { className } = props;
  return (
    <div className={className}>
      <FormControl variant="outlined" fullWidth>
        <InputLabel htmlFor={`${props.label}`}>{props.label}</InputLabel>
        <Select
          value={props.selectedOption}
          onChange={props.cb}
          labelWidth={200}
          inputProps={{
            name: props.label,
            id: props.label
          }}>
          {props.options &&
            (props.label === 'USER TYPE'
              ? props.options.map(option => {
                  return (
                    <MenuItem key={`${option.id}-${option.name}`} value={option.id}>
                      {option.name.toUpperCase()}
                    </MenuItem>
                  );
                })
              : props.options.map(option => {
                  return (
                    <MenuItem key={`${option.value}-${option.label}`} value={option.value}>
                      {option.label}
                    </MenuItem>
                  );
                }))}
        </Select>
      </FormControl>
    </div>
  );
};

export default styled(OutlinedSelect)`
  width: 100%;
  &&& {
    height: 40px;
    * {
      background: transparent;
    }
    .MuiInputBase-root {
      height: 40px;
      margin: 0 0 0 0;
      text-align: left;
    }
    .MuiInputLabel-formControl {
      top: -9px;
      ${paragraphReg}
      line-height: normal;
      font-size: 0.9375rem;
    }
    .MuiInputLabel-shrink {
      top: 0;
    }
    .Mui-focused {
      top 0;
    }
    .MuiFormLabel-filled {
      top: 0;
    }
    .MuiSelect-icon {
      color: ${colors.primary};
    }
  }
`;

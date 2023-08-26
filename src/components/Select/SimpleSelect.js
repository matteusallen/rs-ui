// @flow
import React from 'react';
import styled from 'styled-components';
import { FormControl, Select, MenuItem, Input, InputLabel } from '@material-ui/core';

import colors from '../../styles/Colors';
import { cellText } from '../../styles/Typography';

import type { SelectPropsType, OptionType } from './OutlinedSelect';

type SimpleSelectPropsType = {|
  ...SelectPropsType,
  firstMenuItemStyle?: string,
  hasLabel: boolean,
  id: string,
  isDisabled: boolean,
  options: { userRoles: Array<OptionType> },
  value: string
|};

const SimpleSelectBase = (props: SimpleSelectPropsType) => {
  const { id, value, label, cb, options, className, isDisabled, hasLabel, firstMenuItemStyle } = props;

  return (
    <FormControl className={className} disabled={isDisabled}>
      {hasLabel && <InputLabel htmlFor={`${id}-${label}`}>{label}</InputLabel>}
      <Select value={value} onChange={cb} input={<Input id={`${id}-${label}`} />}>
        {options.userRoles
          ? options.userRoles.map((option: OptionType) => (
              <MenuItem key={`${option.id}-${option.name}`} value={option.id}>
                {option.name.toUpperCase()}
              </MenuItem>
            ))
          : options.map((option: OptionType, index: number) => (
              <MenuItem
                key={`${id}-${option.value}-${option.label}`}
                value={option.value}
                disabled={option.disabled}
                style={firstMenuItemStyle && index === 0 ? firstMenuItemStyle : null}>
                {option.label}
              </MenuItem>
            ))}
      </Select>
    </FormControl>
  );
};

const SimpleSelect = styled(SimpleSelectBase)`
  &&& {
    div {
      ::before,
      ::after {
        border: none !important;
      }
    }
    * {
      ${cellText}
    }
    svg {
      font-size: 22px;
      color: ${props => {
        if (props.isDisabled) {
          return colors.primary.disabled;
        }
        return colors.primary;
      }};
    }
  }
`;

export default SimpleSelect;

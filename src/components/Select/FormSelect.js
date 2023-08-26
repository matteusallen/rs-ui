// @flow
import React from 'react';
import styled from 'styled-components';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { paragraphReg } from '../../styles/Typography';
import colors from '../../styles/Colors';

export type OptionType = {|
  label: string,
  value: string | number,
  disabled?: boolean,
  disabledText?: string,
  dataTestid?: string
|};

export type SelectPropsType = {|
  cb: (option: OptionType) => void,
  className: string,
  disabled: boolean,
  label: string,
  options: Array<OptionType>,
  selectedOption: string,
  shrink?: boolean,
  onBlur?: () => void,
  onFocus?: () => void,
  error?: string,
  emptyListMessage?: string,
  dataTestName?: string
|};

const FormSelect = (props: SelectPropsType) => {
  const { className, error, onBlur, onFocus, dataTestName } = props;

  const getDataTestId = index => {
    return dataTestName ? `${dataTestName}-${index}` : null;
  };

  return (
    <div className={className} data-testid={dataTestName}>
      <FormControl variant="filled" fullWidth onBlur={onBlur} onFocus={onFocus}>
        <InputLabel id={`select-label-${props.label.replace(/ /g, '-')}`} htmlFor={`${props.label}`} shrink={props.shrink}>
          {props.label}
        </InputLabel>
        <Select
          value={props.selectedOption || ''}
          onChange={props.cb}
          labelWidth={200}
          inputProps={{
            name: props.label,
            id: props.label
          }}
          disabled={props.disabled}>
          {props.options.length > 0 &&
            props.options.map((option, index) => {
              return (
                <MenuItem key={`${option.value}-${option.label}`} value={option.value} disabled={option.disabled} data-testid={getDataTestId(index)}>
                  <div data-testid={option.dataTestid}>
                    {option.label}
                    {option.disabled && (
                      <>
                        <p style={{ margin: 0 }} /> <p style={{ fontSize: '11px', margin: 0 }}>{option.disabledText}</p>
                      </>
                    )}
                  </div>
                </MenuItem>
              );
            })}
          {props.options.length === 0 && (
            <MenuEmptyItem value="" disabled>
              <div>{props.emptyListMessage ? props.emptyListMessage : 'No options'}</div>
            </MenuEmptyItem>
          )}
        </Select>
        {error && <p className="error-text">{error?.toUpperCase()}</p>}
      </FormControl>
    </div>
  );
};

export default styled(FormSelect)`
  width: 100%;
  &&& {
    * {
      background: transparent;
    }
    .MuiInputBase-root {
      height: 36px;
      margin: 7px 0 0 0;
    }
    .MuiInputLabel-formControl {
      top: -5px;
      ${paragraphReg}
      line-height: normal;
      font-size: 0.9375rem;
    }
    .MuiFormLabel-filled {
      top: 5px;
    }
    .MuiSelect-icon {
      color: ${colors.primary};
    }
    .error-text {
      color: #f44336;
      margin: 4px 0 0 10px;
      font-weight: 400;
      line-height: 1.66
      font-size: .75rem
    }
  }
`;

const MenuEmptyItem = styled(MenuItem)`
  && {
    &.Mui-selected {
      background-color: #fff;
    }

    &.Mui-disabled {
      opacity: 1;
    }
  }
`;

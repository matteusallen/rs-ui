//@flow
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import IncrementerIcon from 'Components/NumberIncrementer/IncrementerIcon';
import { TextField } from '../Fields';

export type AdditiveInputType = {|
  className: string,
  disabled: boolean,
  error?: string,
  id?: string,
  label?: string,
  onBlur: (e: SyntheticEvent<HTMLInputElement>) => void,
  onChange: (e: SyntheticEvent<HTMLInputElement>) => void,
  handleKeyPress: (e: SyntheticEvent<HTMLInputElement>) => void,
  onValueChange: (e: number) => void,
  value: number,
  maximumValue?: number,
  disabledIncrement: boolean,
  displayIncrementWarning: () => void
|};

const AdditiveInputComponent = (props: AdditiveInputType) => {
  const { className, disabled, error, id, label, onBlur, onChange, onValueChange, value, handleKeyPress, disabledIncrement, displayIncrementWarning } = props;

  const containerId = `${id || ''}-additive-input-container`;
  const minusId = `${id || ''}-additive-input-minus`;
  const inputId = `${id || ''}-additive-input-field`;
  const plusId = `${id || ''}-additive-input-plus`;
  const [currentValue, setCurrentValue] = useState(0);
  const [errorState, setErrorState] = useState(0);

  useEffect(() => {
    if (value > -1) {
      setCurrentValue(Number(value));
    }
  }, [value]);

  useEffect(() => {
    setErrorState(error);
  }, [error]);

  const handleIncrement = () => {
    if (!disabledIncrement) {
      const newValue = Number(currentValue) + 1;
      setCurrentValue(newValue);
      onValueChange(newValue);
    } else {
      displayIncrementWarning();
    }
    if (!error) {
      setErrorState(null);
    }
  };

  const handleDecrement = () => {
    if (currentValue > 0) {
      const newValue = Number(currentValue) - 1;
      onValueChange(newValue);
      if (newValue !== 0) setCurrentValue(newValue);
      if (!error) {
        setErrorState(null);
      }
      return;
    }
  };

  return (
    <div data-testid={containerId} className={className}>
      <div className={`${className}__quantity-field-wrapper`}>
        <IncrementerIcon increment={handleIncrement} decrement={handleDecrement} top={28} right={13} plus={plusId} minus={minusId} />
        <TextField
          data-testid={inputId}
          onKeyDown={handleKeyPress}
          type={'number'}
          error={Boolean(errorState)}
          helperText={!!errorState && errorState}
          label={label}
          autoComplete={label}
          variant="filled"
          disabled={disabled}
          onBlur={onBlur}
          onChange={onChange}
          value={currentValue > -1 ? currentValue : 0}
        />
      </div>
    </div>
  );
};

export const displayFlex = css`
  display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6, BB7 */
  display: -ms-flexbox; /* TWEENER - IE 10 */
  display: -webkit-flex; /* NEW - Safari 6.1+. iOS 7.1+, BB10 */
  display: flex; /* NEW, Spec - Firefox, Chrome, Opera */
`;

const AdditiveInput = styled(AdditiveInputComponent)`
  ${displayFlex}
  flex-direction: column;
  min-width: 220px;
  p.Mui-error {
    position: absolute;
    top: 58px;
    left: -60px;
    width: 220px;
    text-align: center;
  }
  .MuiIconButton-root:hover {
    background: none;
  }
  svg {
    fill: #2875c3;
  }
  .Mui-disabled {
    svg {
      fill: #c8d6e5;
    }
  }
  input[type='number'] {
    font-family: 'IBMPlexSans-Regular';
    padding: 27px 12px 10px;
    &::placeholder {
      font-family: 'IBMPlexSans-Regular';
    }
    &::-webkit-inner-spin-button,
    ::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
  &&&& {
    display: flex;
    flex-direction: row;
  }
  &__quantity-field-wrapper {
    position: relative;
  }
`;

export default AdditiveInput;

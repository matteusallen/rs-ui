//@flow
import React from 'react';
import { TextField } from '@material-ui/core';
import styled from 'styled-components';
import colors from '../../styles/Colors';
import { paragraphReg } from '../../styles/Typography';

type MoneyFieldPropsType = {|
  className: string,
  label: string,
  name: string,
  onChange: (e: SyntheticEvent<HTMLInputElement>) => void,
  value: string,
  type: string
|};

export const cleanMoneyInput = (value: string = '', canBeNegative?: boolean = false) =>
  value
    .replace(/\$/g, '')
    .replace(/\s/g, '')
    .replace(/[a-z]/i, '')
    .replace(/,/g, '')
    .replace(canBeNegative ? '' : /-/g, '');

const FormikMoneyField = (props: MoneyFieldPropsType) => {
  const { value = '', onChange, className, label, name, type, ...rest } = props;

  const split3Digits = (ints: string) => {
    if (ints.length <= 3) {
      return ints;
    }

    return ints
      .split('')
      .reverse()
      .map((char, index) => ((index + 1) % 3 === 0 && index + 1 !== ints.length ? `,${char}` : char))
      .reverse()
      .join('');
  };

  const parseMoney = (val = '') => {
    const valString = `${val}`;
    const [ints, decimals] = valString.split('.');
    if (!ints) {
      return decimals ? `0.${decimals.substr(0, 2)}` : valString;
    }

    if (ints.length > 3) {
      const withCommas = split3Digits(ints);
      return decimals ? `${withCommas}.${decimals.substr(0, 2)}` : valString.match(/\.$/) ? `${withCommas}.` : `${withCommas}`;
    }

    return decimals ? `${ints}.${decimals.substr(0, 2)}` : valString;
  };

  const maskedValue = () => `${value && type !== 'percent' ? '$' : ''}${parseMoney(value)}${value && type === 'percent' ? '%' : ''}`;

  return (
    <TextField
      id="money-field"
      {...rest}
      className={className}
      label={label}
      type="text"
      name={name}
      autoComplete={name}
      variant="filled"
      value={maskedValue()}
      onChange={onChange}
    />
  );
};

export default styled(FormikMoneyField)`
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
      opacity: 0.5;
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
    .MuiFilledInput-underline.Mui-error:after {
      border-bottom-color: ${colors.error.primary};
    }
    .MuiFilledInput-underline:after {
      border-bottom-color: ${colors.border.secondary};
    }
  }
`;

// @flow
import React, { memo } from 'react';
import styled from 'styled-components';

import type { FiltersType } from '../Table';
import { SingleDatePicker, RangeDatePicker } from '../DatePicker';

import { OutlinedSelect } from '../Select';
import { OutlinedTextField } from '../Fields';
import colors from '../../styles/Colors';

type FilterFieldsPropsType = {|
  className: string,
  filters: FiltersType
|};

export const FilterFieldsBase = (props: FilterFieldsPropsType) => {
  const { className } = props;
  return (
    <form className={props.className}>
      {props.filters.map(filter => {
        if (filter.type === 'text') {
          return (
            <div className={`${className}__field`} key={`${filter.label}__field`}>
              <OutlinedTextField id={filter.label} key={filter.label} label={filter.label} value={filter.value} onChange={e => filter.cb(e.target.value)} />
            </div>
          );
        }
        if (filter.type === 'date') {
          if (filter.plural) {
            return <RangeDatePicker {...filter} className={`${className}__DatePicker`} key={filter.label} readOnly />;
          }

          return <SingleDatePicker showPast {...filter} key={filter.label} readOnly />;
        }
        if (filter.type === 'select') {
          return (
            <div className={`${className}__field`} key={`${filter.label}__field`}>
              <OutlinedSelect {...filter} key={filter.label} />
            </div>
          );
        }
      })}
    </form>
  );
};

const FilterFields = styled(FilterFieldsBase)`
  display: flex;
  width: 100%;

  &__field {
    width: 200px;
    margin: 0 0.5rem 0 0;
    fieldset {
      border: 1px solid ${colors.text.secondary};
    }
  }

  &__DatePicker {
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #c8d6e4;

    .date-label-wrapper {
      display: none;
    }

    .DateRangePickerInput_arrow {
      position: static;
      align-self: center;
    }

    .DateInput_input[aria-label='TO'] {
      text-align: right;
    }
  }

  &&& {
    .SingleDatePickerInput__withBorder {
      border: 1px solid ${colors.text.secondary};
      border-radius: 4px;
      margin: 0 0.5rem 0 0;
    }
    .DateInput_input {
      background-color: transparent !important;
      font-size: 0.9375rem;
      padding: 7px 12px 5px;
      ::placeholder {
        font-size: 0.9375rem;
      }
    }
  }
`;

export default memo<{}>(FilterFields);

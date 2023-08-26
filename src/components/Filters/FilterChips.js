// @flow
import React from 'react';
import styled from 'styled-components';
import { Chip } from '@material-ui/core';
import { Clear } from '@material-ui/icons';

import colors from '../../styles/Colors';
import type { FiltersType } from '../Table';

type FilterChipsPropsType = {|
  className: string,
  filters: FiltersType,
  onClearSingleFilter: (key: string) => void
|};

export class FilterChipsBase extends React.PureComponent<FilterChipsPropsType> {
  // eslint-disable-next-line flowtype/no-weak-types
  getFilterValue = ({ value, options, label }: any) => {
    if (value.format) {
      return value.format('MM/DD/YYYY');
    }
    if (Array.isArray(value)) {
      return `${value.join(' — ')}`;
    }
    if (options && options.length) {
      if (label === 'USER TYPE') {
        const match = options.find(option => option.id === value);
        return match.name.toUpperCase();
      }
      const match = options.find(option => option.label === value);
      return match.label.toUpperCase();
    }
    return value;
  };

  render() {
    const { className, filters, onClearSingleFilter } = this.props;
    const chipsValues = filters.reduce((acc, filter) => {
      if (filter.value && (filter.value.length || filter.value.format)) {
        const removeFilter = () => {
          filter.cb('');
          onClearSingleFilter(filter.key);
        };
        const label = this.getFilterValue(filter);
        const chip = (
          <Chip
            className={className}
            data-testid={`chip-${filter.label}`}
            key={`${className}-${filter.label}`}
            label={label}
            onDelete={removeFilter}
            deleteIcon={<Clear />}
          />
        );
        acc.push(chip);
      }
      return acc;
    }, []);
    return <>{chipsValues}</>;
  }
}

const FilterChips = styled(FilterChipsBase)`
  &&& {
    display: ${props => (props.expanded ? 'none' : 'inline-flex')};
    background-color: ${colors.text.darkBlue};
    padding-right: 8px;
    margin-left: 16px !important;
    height: 24px;
    * {
      color: ${colors.white};
    }
    span {
      padding-right: 0;
    }
    svg {
      height: 18px;
      padding: 2px 0 0 4px;
    }
  }
`;

export default FilterChips;

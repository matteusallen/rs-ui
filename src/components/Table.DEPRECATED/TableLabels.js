// @flow
import React, { memo } from 'react';
import styled from 'styled-components';
import { Tooltip, TableSortLabel } from '@material-ui/core';

import colors from '../../styles/Colors';

import type { TablePropsType } from './index';

const SortableLabel = ({ onRequestSort, row, order, orderBy }: TablePropsType) => {
  const active = orderBy === row.id;
  return (
    <Tooltip title="Sort" placement={row.numeric ? 'bottom-end' : 'bottom-start'} enterDelay={300}>
      <SortLabel active={active} direction={active ? order : 'asc'} onClick={() => onRequestSort(row.id)}>
        {row.label}
      </SortLabel>
    </Tooltip>
  );
};

const SortLabel = styled(TableSortLabel)`
  &&& {
    color: ${props => (props.active ? colors.text.darkBlue : colors.text.primary)};
    && svg {
      opacity: 1;
      width: 16px;
      height: 16px;
      color: ${props => (props.active ? colors.text.darkBlue : colors.text.secondary)};
    }
  }
`;

export default memo(SortableLabel);

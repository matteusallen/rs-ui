// @flow
import React, { memo } from 'react';
import { TableHead, TableRow, TableCell, Checkbox } from '@material-ui/core';
import styled from 'styled-components';

import SortableLabel from './TableLabels';
import { columnHeaderText } from '../../styles/Typography';
import colors from '../../styles/Colors';

import type { TablePropsType } from './index';

const EnhancedTableHead = (props: TablePropsType) => (
  <TableHead>
    <TableRow>
      {props.rows.map(row => {
        let label;
        if (row.sortable) {
          label = <SortableLabel onRequestSort={props.onRequestSort} order={props.order} orderBy={props.orderBy} row={row} />;
        } else if (row.id === 'checkable') {
          let indeterminate = false;
          let checked = false;
          if (props.selectedRows.rows?.length === props.allTableRows?.length) {
            checked = true;
          } else if (props.selectedRows.rows.length > 0) {
            indeterminate = true;
          }
          label = (
            <Checkbox
              color="primary"
              checked={checked}
              indeterminate={indeterminate}
              onChange={() => props.onMasterCheckboxClick()}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          );
        } else {
          label = row.label;
        }

        return (
          <TableHeaderCell
            key={row.id}
            align={row.id === 'checkable' ? 'center' : 'left'}
            padding={row.disablePadding ? 'none' : 'default'}
            sortDirection={props.order && props.orderBy === row.id ? props.order : false}
            style={row.id === 'checkable' ? { width: '50px' } : {}}>
            {label}
          </TableHeaderCell>
        );
      })}
    </TableRow>
  </TableHead>
);

const TableHeaderCell = styled(TableCell)`
  &&& {
    height: 65px;
    color: ${colors.button.secondary.active};
    padding: 4px 30px 4px 20px;
    ${columnHeaderText}
  }
`;

export default memo(EnhancedTableHead);

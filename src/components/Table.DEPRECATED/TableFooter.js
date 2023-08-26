// @flow
import React, { memo } from 'react';

import { TablePagination } from '@material-ui/core';
import styled from 'styled-components';

import colors from '../../styles/Colors';

import type { TablePropsType } from './index';

const TableFooter = (props: TablePropsType) => {
  const { onChangePage, onChangeRowsPerPage, page, rowsPerPage, count } = props;

  return (
    <TablePaginationBase
      rowsPerPageOptions={[10, 25, 100]}
      component="div"
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={onChangePage}
      onChangeRowsPerPage={({ target }) => onChangeRowsPerPage(target.value)}
    />
  );
};

const TablePaginationBase = styled(TablePagination)`
  &&& {
    height: 67px;
    display: flex;
    justify-content: flex-end;
    align-item: center;

    p[class^='MuiTablePagination-caption'],
    p[class*='MuiTablePagination-caption'] {
      text-transform: uppercase;
    }

    svg[class^='MuiTablePagination-selectIcon'],
    svg[class*='MuiTablePagination-selectIcon'] {
      fill: ${colors.primary};
    }
  }
`;

export default memo(TableFooter);

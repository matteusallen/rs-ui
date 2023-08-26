// @flow
import React, { Component } from 'react';
import { Table, Paper, TableBody } from '@material-ui/core';
import styled from 'styled-components';

import BulkChangeRow from './BulkChangeRow';
import TableHead from './TableHead';
import TableRows from './TableRows';
import NoResults from './NoResults';

import Filters from '../Filters';
import TableFooter from './TableFooter';

export type SelectedRowsType = {|
  cb: (event: InputEventHandler) => void,
  options: Array<Type>,
  rows: Array<Type>
|};

type FilterType = {|
  cb: (event: InputEventHandler) => void,
  label: string,
  type: string,
  value: string
|};

export type FiltersType = Array<FilterType>;
export type RowType = {|
  disablePadding: boolean,
  id: string,
  label: string,
  numeric: boolean,
  sortable?: boolean
|};

export type TablePropsType = {|
  allTableRows: Array<Type>,
  className: string,
  count: number,
  data: Array<Type>,
  filters?: FiltersType,
  onChangePage: () => void,
  onChangeRowsPerPage: () => void,
  onCheckboxClick: (row: RowType) => void,
  onClearFilters: () => void,
  onClearSingleFilter: () => void,
  onDownloadClick: (row: RowType) => void,
  onEditClick: (row: RowType) => void,
  onMasterCheckboxClick: () => void,
  onRequestSort: () => void,
  onSubmit: () => void,
  order: string,
  orderBy: string,
  page: number,
  rows: Array<RowType>,
  rowsPerPage: number,
  selectedRows?: SelectedRowsType,
  view: string
|};

export class CustomTableBase extends Component<TablePropsType> {
  static defaultProps = {
    selectedRows: { rows: [] }
  };

  getRowMap = () =>
    this.props.rows.reduce((prev, curr) => {
      prev[curr.id] = true;
      return prev;
    }, {});

  mapDataToRows = () => {
    const { data } = this.props;
    return data.reduce((prev, item) => {
      const newItem = Object.keys(this.getRowMap()).reduce((obj, row) => {
        obj[row] = item[row];
        if (row === 'editable') {
          obj.editable = `editable-${item.id}`;
        }
        return obj;
      }, {});
      newItem.id = item.id;

      prev.push(newItem);
      return prev;
    }, []);
  };

  render() {
    const {
      filters,
      onEditClick,
      className,
      onSubmit,
      onClearFilters,
      onCheckboxClick,
      onDownloadClick,
      selectedRows,
      data,
      view,
      count,
      page,
      rowsPerPage,
      onChangePage,
      onChangeRowsPerPage,
      onClearSingleFilter,
      allTableRows,
      ...tableHeadProps
    } = this.props;

    return (
      <Paper className={className}>
        {selectedRows.rows.length > 0 && (
          <BulkChangeRow
            options={selectedRows.options}
            selectedRows={selectedRows.rows}
            numberSelected={selectedRows.rows.length}
            onClick={selectedRows.cb}
            view={view}
          />
        )}
        {filters && <Filters onClearFilters={onClearFilters} onSubmit={onSubmit} filters={filters} onClearSingleFilter={onClearSingleFilter} />}
        <Table>
          <TableHead selectedRows={selectedRows} allTableRows={allTableRows} {...tableHeadProps} />
          <TableBody>
            <TableRows
              rows={this.mapDataToRows()}
              onCheckboxClick={onCheckboxClick}
              onDownloadClick={onDownloadClick}
              onEditClick={onEditClick}
              selectedRows={selectedRows}
              data={data}
            />
          </TableBody>
        </Table>
        <TableFooter page={page} rowsPerPage={rowsPerPage} onChangePage={onChangePage} onChangeRowsPerPage={onChangeRowsPerPage} count={count} />
        {!data.length && <NoResults />}
      </Paper>
    );
  }
}

const CustomTable = styled(CustomTableBase)`
  width: 100%;
`;

export default CustomTable;

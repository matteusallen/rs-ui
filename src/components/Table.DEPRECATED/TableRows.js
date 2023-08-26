// @flow
import React, { memo } from 'react';

import { TableRow, TableCell } from '@material-ui/core';
import { Create, GetApp, Warning } from '@material-ui/icons';
import styled from 'styled-components';

import Checkbox from '../Checkbox';

import { cellText } from '../../styles/Typography';
import colors from '../../styles/Colors';
import { SimpleSelect } from '../Select';
import NotesPopover from './NotesPopover';
import hasPaymentErrors from '../../helpers/hasPaymentErrors';
import type { PaymentType } from '../../containers/Order/Admin/Edit/RefundModal';

import type { RowType } from './index';

type TableRowsPropsType = {|
  className?: string,
  data: { id: number | string, payments: PaymentType }[],
  onCheckboxClick: (row: RowType) => null,
  onDownloadClick: (row: RowType) => null,
  onEditClick: (row: RowType) => null,
  rows: Array<RowType>,
  selectedRows: Array<number>
|};

const EnhancedTableRows = (props: TableRowsPropsType) => {
  const { onCheckboxClick, onDownloadClick, onEditClick, selectedRows, data = [], rows, className = '' } = props;
  const getPaymentErrors = (reservationId: number | string): boolean => {
    const reservation = data.find(({ id }) => Number(id) === Number(reservationId)) || {};
    const { payments = [] } = reservation;
    return payments.some(p => hasPaymentErrors(reservation.payments, p));
  };
  return (
    <>
      {rows.map(row => (
        <TableRowStyled key={row.id}>
          {Object.keys(row).map((key, index) => {
            if (key === 'editable') {
              return (
                <TableCellIcon key={`${row[key]}-${key}-${row.id}`}>
                  <div className={`${className} flex-container`}>
                    <EditButton onClick={() => onEditClick(row)} disabled={row.status && row.status.label && row.status.label === 'canceled'}>
                      <Create />
                    </EditButton>
                    {getPaymentErrors(row.id) && <Warning style={{ color: colors.error.primary }} />}
                  </div>
                </TableCellIcon>
              );
            }
            if (key === 'download') {
              return (
                <TableCellIcon key={`${row[key]}-${key}-${row.id}`}>
                  <div className={`${className} flex-container`}>
                    <DownloadButton onClick={() => onDownloadClick(row)}>
                      <GetApp />
                    </DownloadButton>
                  </div>
                </TableCellIcon>
              );
            }
            if (key === 'checkable') {
              const checked = selectedRows.rows.some(selectedRow => {
                return selectedRow.id == row.id;
              });
              return (
                // eslint-disable-next-line react/no-array-index-key
                <TableCellComponent key={`${row.id}-${key}-${index}`}>
                  <Checkbox color="primary" checked={checked} onChange={() => onCheckboxClick(row)} inputProps={{ 'aria-label': 'secondary checkbox' }} />
                </TableCellComponent>
              );
            }
            if (row[key] !== undefined && row[key].options) {
              return (
                <TableCellComponent key={`${row.id}-${key}-${row.value}`}>
                  <SimpleSelectStyled {...row[key]} data={data} />
                </TableCellComponent>
              );
            }
            if (key == 'notes') {
              return (
                <TableCellComponent key={`${row[key]}-${key}-${row.id}`}>
                  <NotesPopover notesData={row[key]} />
                </TableCellComponent>
              );
            }
            if (key === 'role') {
              return <TableCellComponent key={`${row[key]}-${key}-${row.id}`}>{row[key].name}</TableCellComponent>;
            }
            if (key !== 'id') {
              return <TableCellComponent key={`${row[key]}-${key}-${row.id}`}>{row[key] || '-'}</TableCellComponent>;
            }
          })}
        </TableRowStyled>
      ))}
    </>
  );
};

const TableRowStyled = styled(TableRow)`
  &&& {
    height: 65px;

    td {
      div {
        button {
          padding-left: 20px;
          transition color .3s;
          &:hover {
            color: ${colors.button.edit.hover};
          }
        }
      }
    }
  }
`;

const TableCellIcon = styled(TableCell)`
  &&& {
    padding: 0;
    text-align: center;
    .flex-container {
      display: flex;
      flex-direction: row;
      justify-content: center;
      width: 50px;
    }
  }
`;

const TableCellComponent = styled(TableCell)`
  &&& {
    ${cellText}
    color: ${colors.text.primary};
    padding: 4px 15px 4px 20px;
    cursor: ${({ clickable }) => (clickable ? 'pointer' : 'auto')};
  }
`;

const SimpleSelectStyled = styled(SimpleSelect)`
  &&& {
    width: 140px;
  }
`;

const EditButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  background: transparent;
`;

const DownloadButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  background: transparent;
`;

export default memo(EnhancedTableRows);

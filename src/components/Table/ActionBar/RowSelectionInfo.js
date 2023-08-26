// @flow
import { Checkbox } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { TableContext } from '../TableContext';

type AllOrders = {|
  allOrders: Orders
|};

type Orders = {|
  orders: { orders: [] }
|};

export type BulkActionsPropsType = {|
  className: string,
  getAllOrders: () => AllOrders,
  allOrders: Orders
|};

const getSelectedLabel = (numberOfItems: number) => {
  return numberOfItems > 0 ? `${numberOfItems} selected` : '';
};

const RowSelectionsComponent = (props: BulkActionsPropsType) => {
  const { className, getAllOrders, allOrders } = props;
  const tableContextRef = useContext(TableContext);
  const hasSelections = tableContextRef.selectedRows && !!tableContextRef.selectedRows.length;
  const allSelected = hasSelections && tableContextRef.dataProvider.length === tableContextRef.selectedRows.length;
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (selected) {
      if (!allOrders) getAllOrders();
      else tableContextRef.selectAll(allOrders.orders.orders);
    }
  }, [allOrders, selected]);

  const handleCheckboxChange = () => {
    if (hasSelections) {
      tableContextRef.clearAllSelections();
      return setSelected(false);
    }
    setSelected(true);
  };

  return (
    <div className={`${className}__row-selection-info`} id="row-selection-info">
      <FormControlLabel
        control={
          <Checkbox checked={hasSelections} indeterminate={hasSelections && !allSelected} name="checked" color={'primary'} onChange={handleCheckboxChange} />
        }
        label={getSelectedLabel(tableContextRef.selectedRows ? tableContextRef.selectedRows.length : 0)}
      />
    </div>
  );
};

const RowSelectionInfo = styled(RowSelectionsComponent)`
  &__row-selection-info {
    min-width: 60px;
    height: 37px;
    margin-right: 5px;
    padding-left: 23px;
    display: flex;
    flex-direction: row;
    background-color: white;
    box-shadow: 0 2px 6px rgba(17, 24, 31, 0.03), 0 2px 3px rgba(17, 24, 31, 0.1);
    .blue-checkbox {
      color: blue[400];
    }
    .MuiFormControlLabel-root {
      margin-right: 8px;
    }
  }
`;

export default RowSelectionInfo;

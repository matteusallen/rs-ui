import React, { createContext, PureComponent } from 'react';

import { findIndex } from '../../utils/arrayHelpers';

const TableContext = createContext();
const { Provider } = TableContext;

const findRowDataIndexInSelectedRows = (rowData, selectedRowsCollection) => {
  return findIndex(selectedRowsCollection, item => {
    return item && rowData && item === rowData;
  });
};

class TableContextProvider extends PureComponent {
  state = {
    data: [],
    selectedRows: []
  };

  addSelection = selection => {
    if (findRowDataIndexInSelectedRows(selection, this.state.selectedRows) === -1) {
      // eslint-disable-next-line react/no-access-state-in-setstate
      this.setState({ selectedRows: this.state.selectedRows.concat(selection) });
      localStorage.setItem('selectedRows', JSON.stringify(this.state.selectedRows.concat(selection)));
    }
  };

  removeSelection = selection => {
    const index = findRowDataIndexInSelectedRows(selection, this.state.selectedRows);
    if (index > -1) {
      // eslint-disable-next-line react/no-access-state-in-setstate
      const newSet = this.state.selectedRows.filter(item => item !== selection);

      this.setState({ selectedRows: newSet });
      localStorage.setItem('selectedRows', JSON.stringify(newSet));
    }
  };

  /** Toggle selected state of individual selection **/
  toggleSelection = selection => {
    if (findRowDataIndexInSelectedRows(selection, this.state.selectedRows) === -1) {
      this.addSelection(selection);
    } else {
      this.removeSelection(selection);
    }
  };

  /** Remove all selections from state **/
  clearAllSelections = () => {
    this.setState({ selectedRows: [] });
    localStorage.setItem('selectedRows', []);
  };

  /** Set all data items as 'selected' **/
  selectAll = allOrders => {
    const orders = allOrders ? allOrders : this.state.data;
    if (orders.length) {
      // eslint-disable-next-line react/no-access-state-in-setstate
      const selectedRows = orders.reduce((acc, item) => {
        acc.push(item.id);
        return acc;
      }, []);
      this.setState({ selectedRows: selectedRows });
      localStorage.setItem('selectedRows', JSON.stringify(selectedRows));
    }
  };

  setDataProvider = data => {
    const localStore = localStorage.getItem('selectedRows') ? JSON.parse(localStorage.getItem('selectedRows')) : [];
    localStore && localStore.length ? this.setState({ data: data, selectedRows: localStore }) : this.setState({ data: data, selectedRows: [] });
  };

  render() {
    return (
      <Provider
        value={{
          selectedRows: this.state.selectedRows || [],
          clearAllSelections: this.clearAllSelections,
          toggleSelection: this.toggleSelection,
          selectAll: this.selectAll,
          setDataProvider: this.setDataProvider,
          dataProvider: this.state.data || []
        }}>
        {this.props.children}
      </Provider>
    );
  }
}

export { TableContextProvider, TableContext };

import React from 'react';
import moment from 'moment';

const withTableActions = ComposedComponent => {
  const WithTableActions = props => {
    const updateFilterTextField = setFunction => value => setFunction(value);

    const getVariables = state => {
      const { orderBy, filterBy, rowsPerPage, page } = state;
      const variables = { orderBy };
      // eslint-disable-next-line no-prototype-builtins
      if (filterBy && filterBy.hasOwnProperty('role')) {
        filterBy['roleId'] = filterBy['role'];
        delete filterBy['role'];
      }
      if (filterBy) {
        variables.filterBy = { ...filterBy };
      }
      if (rowsPerPage) variables.limit = rowsPerPage;
      if (page) variables.offset = page * rowsPerPage;
      return variables;
    };

    const onClearSingleFilter = (filterBy, setFilterBy) => key => {
      const updatedFilterBy = { ...filterBy };

      if (key === 'dates') {
        delete updatedFilterBy['endDate'];
        delete updatedFilterBy['startDate'];
      } else if (key === 'role') {
        delete updatedFilterBy['roleId'];
      } else {
        delete updatedFilterBy[key];
      }

      if (Object.entries(updatedFilterBy).length) {
        return setFilterBy(updatedFilterBy);
      }
      setFilterBy(null);
    };

    const onClearFilters = (filters, stateWithSets, setFilterBy) => (filterBy = null) => {
      filters.map(filter => {
        if (stateWithSets[filter]) {
          if (typeof stateWithSets[filter][0] === 'string' || typeof stateWithSets[filter][0] === 'number') {
            stateWithSets[filter][1]('');
          } else {
            stateWithSets[filter][1](null);
          }
        }
      });
      return setFilterBy(filterBy);
    };

    const onSubmitFilter = (filters, state, setFilterBy, setPage) => async () => {
      const filterBy = filters.reduce((obj, curr) => {
        if (state[curr]) {
          if (typeof state[curr] === 'number' || (typeof state[curr] === 'string' && state[curr].length)) {
            obj[curr] = state[curr];
          }
          if (state[curr].format) {
            obj[curr] = state[curr].format('YYYY-MM-DD');
          }
        }
        return obj;
      }, {});
      const hasFilters = Object.entries(filterBy).length;
      setPage(0);
      return setFilterBy(hasFilters && filterBy);
    };

    const onRequestSort = (state, setState) => name => {
      const { sortName, sortOrder } = state;
      const { setSortName, setSortOrder, setOrderBy } = setState;

      const newSortOrder = name === sortName && sortOrder === 'asc' ? 'desc' : 'asc';

      const orderBy = [name === 'status' ? 'statusId' : name, newSortOrder.toUpperCase()];

      setSortName(name);
      setSortOrder(newSortOrder);
      return setOrderBy(orderBy);
    };

    const handleTableChangeRowsPerPage = (setRowsPerPage, setPage) => rowsPerPage => {
      setPage(0);
      setRowsPerPage(rowsPerPage);
    };

    const handleTableChangePage = setPage => (event, page) => {
      setPage(page);
    };

    const updateDates = (type, setStartDate, setEndDate) => dates => {
      if (type === 'single') {
        if (dates) return setStartDate(dates);
        return setStartDate(null);
      }

      if (type === 'single-end') {
        if (dates) return setEndDate(dates);
        return setEndDate(null);
      }

      if (type === 'range' && (dates.startDate || dates.endDate)) {
        setStartDate(dates.startDate);
        return setEndDate(dates.endDate);
      }
      setStartDate(null);
      return setEndDate && setEndDate(null);
    };

    const updateSelect = setFunction => event => setFunction(event.target && event.target.value);

    const updateCheckedRows = (checkedRows, setCheckedRows) => clickedRow => {
      const newCheckedRows = [...checkedRows];
      const clickedIndex = checkedRows.findIndex(row => {
        return row.id == clickedRow.id;
      });
      if (clickedIndex > -1) {
        newCheckedRows.splice(clickedIndex, 1);
      } else {
        newCheckedRows.push(clickedRow);
      }
      return setCheckedRows(newCheckedRows);
    };

    const onMasterCheckboxClick = (allTableRows, checkedRows, setCheckedRows) => () => {
      let newCheckedRows = [];
      if (checkedRows.length < allTableRows.length) {
        newCheckedRows = allTableRows;
      }
      return setCheckedRows(newCheckedRows);
    };

    const formatFilterDates = ({ startDate, endDate }) => {
      return [startDate, endDate].reduce((acc, date) => {
        if (date) {
          const formattedDate = moment(date).format('MM/DD/YYYY');
          acc.push(formattedDate);
        }
        return acc;
      }, []);
    };

    return (
      <ComposedComponent
        updateFilterTextField={updateFilterTextField}
        getVariables={getVariables}
        formatFilterDates={formatFilterDates}
        updateDates={updateDates}
        onSubmitFilter={onSubmitFilter}
        onClearFilters={onClearFilters}
        onClearSingleFilter={onClearSingleFilter}
        onRequestSort={onRequestSort}
        updateSelect={updateSelect}
        updateCheckedRows={updateCheckedRows}
        onMasterCheckboxClick={onMasterCheckboxClick}
        handleTableChangePage={handleTableChangePage}
        handleTableChangeRowsPerPage={handleTableChangeRowsPerPage}
        {...props}
      />
    );
  };
  return WithTableActions;
};

export default withTableActions;

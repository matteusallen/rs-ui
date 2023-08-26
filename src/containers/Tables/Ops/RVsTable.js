// @flow
import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { compose } from 'recompose';
import styled from 'styled-components';

import Table from '../../../components/Table.DEPRECATED';
import { RVS_FOR_OPS_TABLE } from '../../../queries/Ops/RVsForOpsTable';
import withTableActions from '../../../enhancers/withTableActions';
import { HeadingOne } from 'Components/Headings';

type RVsTablePropsType = {|
  className: string,
  getVariables: ({
    filterBy: string | null,
    orderBy: string | [string, string],
    page: number,
    rowsPerPage: number
  }) => VariablesType,
  handleTableChangePage: (setPage: (val: number) => void) => void,
  handleTableChangeRowsPerPage: (setRowsPerPage: (val: number) => void, setPage: (val: number) => void) => void,
  onClearFilters: (filters: string[], {}, callback: (val: string) => void) => void,
  onClearSingleFilter: (filterBy: string | null, setFilterBy: (val: string | null) => void) => void,
  onEditClick: () => void,
  onRequestSort: (
    order: { sortName: string, sortOrder: string },
    callbacks: {
      setOrderBy: (val: string) => void,
      setSortName: (val: string) => void,
      setSortOrder: (val: string) => void
    }
  ) => void,
  onSubmitFilter: (
    availableFilters: string[],
    options: {
      name?: string,
      rvLotId?: string,
      startDate?: string
    },
    setFilterBy: (val: string | null) => void,
    setPage: (val: number) => void
  ) => void,
  updateDates: (val: string, setStartDate: (val: string) => void) => void,
  updateFilterTextField: (setName: (val: string) => void) => void
|};

type OrderByType = 'rvLot' | 'name' | 'name';

type FilterKeysType = 'rvLotId' | 'name' | 'startDate';

type FilterByType = {|
  [key: FilterKeysType]: string
|};

export type VariablesType = {|
  filterBy: FilterByType,
  orderBy: OrderByType
|};

export const RVsTableBase = (props: RVsTablePropsType) => {
  const {
    className,
    onEditClick,
    getVariables,
    updateFilterTextField,
    updateDates,
    onSubmitFilter,
    onClearFilters,
    onRequestSort,
    onClearSingleFilter,
    handleTableChangePage,
    handleTableChangeRowsPerPage
  } = props;
  const [sortName, setSortName] = useState('startDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(['name', 'ASC']);
  const [filterBy, setFilterBy] = useState(null);
  const [rvLotId, setrvLotId] = useState('');
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(0);

  const availableFilters = ['rvLotId', 'name', 'startDate'];

  const variables =
    getVariables &&
    getVariables({
      orderBy,
      filterBy,
      rowsPerPage,
      page
    });

  const { data, loading, error } = useQuery(RVS_FOR_OPS_TABLE, {
    variables: { ...variables },
    pollInterval: 5000,
    fetchPolicy: 'network-only'
  });

  const rows = [
    {
      id: 'rvLot',
      numeric: false,
      disablePadding: false,
      label: 'RV LOT',
      sortable: true
    },
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: 'RV NAME',
      sortable: true
    },
    {
      id: 'nextReservation',
      numeric: false,
      disablePadding: false,
      label: 'NEXT CHECK IN',
      sortable: false
    }
  ];

  const getRVLotName = rvLots => {
    if (!rvLotId) return '';
    const match = rvLots.find(rvLot => {
      return rvLot.id === rvLotId;
    });
    if (match) return match.name;
  };

  const getRVLotNameOptions = rvLots => {
    return rvLots.map(rvLot => {
      return { value: rvLot.id, label: rvLot.name };
    });
  };

  const reservationRVs = data && data.venue ? data.venue.rvs : [];

  const operationsTableData = () => {
    return reservationRVs.map(rvSpot => {
      const rvData = {
        id: rvSpot.id,
        nextReservation: rvSpot.nextOrder ? rvSpot.nextOrder.nextReservationDate : '-',
        rvLot: rvSpot.rvLot.name,
        name: rvSpot.name,
        disabled: rvSpot.disabled ? rvSpot.disabled : '-'
      };
      return {
        ...rvData
      };
    });
  };

  const updateRVLotFilter = (rvLots: { id: string }[]) => event => {
    if (event.target) {
      const { value } = event.target;
      const match = rvLots.find(rvLot => {
        return rvLot.id === value;
      });
      if (match) return setrvLotId(match.id);
    }
    return setrvLotId('');
  };

  const filters = [
    {
      key: 'rvLotId',
      label: 'RV LOT',
      type: 'select',
      value: getRVLotName(data ? data.venue.rvLots : []),
      selectedOption: rvLotId,
      options: getRVLotNameOptions(data ? data.venue.rvLots : []),
      cb: updateRVLotFilter(data ? data.venue.rvLots : [])
    },
    {
      key: 'name',
      label: 'RV NAME',
      type: 'text',
      value: name,
      cb: updateFilterTextField && updateFilterTextField(setName)
    },
    {
      key: 'startDate',
      label: 'CHECK IN',
      type: 'date',
      plural: false,
      value: startDate,
      showPast: false,
      cb: updateDates && updateDates('single', setStartDate)
    }
  ];

  if (loading) return 'Loading...';
  if (error) {
    // eslint-disable-next-line
    console.error(error);
    return 'uh oh...';
  }

  return (
    <>
      <div className={`${className}__page-header`}>
        <div className={`${className}__header-wrapper`}>
          <HeadingOne label="RVS" />
        </div>
      </div>
      <Table
        filters={filters}
        rows={rows}
        data={operationsTableData()}
        onSubmit={onSubmitFilter(availableFilters, { rvLotId, name: name, startDate }, setFilterBy, setPage)}
        onClearFilters={onClearFilters(
          availableFilters,
          {
            rvLotId: [rvLotId, setrvLotId],
            name: [name, setName],
            startDate: [startDate, setStartDate]
          },
          setFilterBy
        )}
        onEditClick={onEditClick}
        orderBy={sortName}
        order={sortOrder}
        onRequestSort={onRequestSort({ sortName, sortOrder }, { setSortName, setSortOrder, setOrderBy })}
        view="operations"
        onClearSingleFilter={onClearSingleFilter(filterBy, setFilterBy)}
        allTableRows={data.allVenueRVs.rvs}
        count={data.allVenueRVs.rvs.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onChangePage={handleTableChangePage(setPage)}
        onChangeRowsPerPage={handleTableChangeRowsPerPage(setRowsPerPage, setPage)}
      />
    </>
  );
};

const RVsTable = styled(RVsTableBase)`
  &__page-header {
    text-align: left;
    border-bottom: 1px solid rgb(200, 214, 229);
    &&& {
      margin: 0;
    }
  }

  &__header-wrapper {
    margin: 20px 0px !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

// eslint-disable-next-line prettier/prettier
export default compose(withTableActions)(RVsTable);

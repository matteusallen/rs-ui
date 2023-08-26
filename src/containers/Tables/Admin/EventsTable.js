// @flow
import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import styled from 'styled-components';
import { compose } from 'recompose';
import { FILTERED_VENUE_EVENTS } from '../../../queries/Admin/FilteredVenueEvents';
import Table from '../../../components/Table.DEPRECATED';
import withTableActions from '../../../enhancers/withTableActions';
import IndeterminateLoading from '../../../components/Loading/IndeterminateLoading';

export type VenueEventsType = {|
  checkInTime: string,
  checkOutTime: string,
  closeDate: string,
  createdAt: string,
  endDate: string,
  id: number | string,
  lastName: string,
  name: string,
  openDate: string,
  phone: string,
  pricePerEvent: number,
  pricePerNight: number,
  startDate: string,
  updatedAt: string
|};

type EventsTablePropsType = {|
  formatFilterDates: ({}) => void,
  getVariables: ({}) => void,
  handleTableChangePage: (setPage: (val: number) => void) => void,
  handleTableChangeRowsPerPage: (setRowsPerPage: (val: number) => void, setPage: (val: number) => void) => void,
  onClearFilters: (availableFilters: string[], {}, setFilterBy: (val: string | null) => void) => void,
  onClearSingleFilter: (filterBy: string | null, setFilterBy: (val: string | null) => void) => void,
  onEditClick: () => void,
  onRequestSort: ({}, {}) => void,
  onSubmitFilter: (availableFilters: string[], {}, setFilterBy: (val: string | null) => void, setPage: (val: number) => void) => void,
  updateDates: (val: string, setStartDate: (val: string) => void, setEndDate: (val: string) => void) => void,
  updateFilterTextField: (setName: (val: string) => void) => void
|};

export const EventsTable = (props: EventsTablePropsType) => {
  const {
    onEditClick,
    onClearFilters,
    onRequestSort,
    getVariables,
    updateFilterTextField,
    formatFilterDates,
    updateDates,
    onSubmitFilter,
    onClearSingleFilter,
    handleTableChangePage,
    handleTableChangeRowsPerPage
  } = props;
  const [sortName, setSortName] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(['createdAt', 'DESC']);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterBy, setFilterBy] = useState(null);
  const [name, setName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const availableFilters = ['name', 'startDate', 'endDate'];
  const variables =
    getVariables &&
    getVariables({
      orderBy,
      filterBy,
      rowsPerPage,
      page
    });

  const { data, loading, error } = useQuery(FILTERED_VENUE_EVENTS, {
    variables: { ...variables },
    fetchPolicy: 'network-only'
  });

  const rows = [
    {
      id: 'editable',
      numeric: false,
      disablePadding: false,
      label: ''
    },
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: 'EVENT NAME',
      sortable: true
    },
    {
      id: 'openDate',
      numeric: false,
      disablePadding: false,
      label: 'BOOKING WINDOW',
      sortable: true
    },
    {
      id: 'startDate',
      numeric: false,
      disablePadding: false,
      label: 'EVENT DATES',
      sortable: true
    },
    {
      id: 'checkInTime',
      numeric: false,
      disablePadding: false,
      label: 'CHECK IN'
    },
    {
      id: 'checkOutTime',
      numeric: false,
      disablePadding: false,
      label: 'CHECK OUT'
    },
    {
      id: 'totalStallCount',
      numeric: true,
      disablePadding: false,
      label: 'TOTAL STALLS'
    },
    {
      id: 'totalRvCount',
      numeric: true,
      disablePadding: false,
      label: 'TOTAL RV SPOTS'
    }
    // {
    //   id: 'buildingTotal',
    //   numeric: true,
    //   disablePadding: false,
    //   label: 'BARNS',
    // },
    // {
    //   id: 'stallTotal',
    //   numeric: true,
    //   disablePadding: false,
    //   label: 'STALLS',
    // },
  ];

  const eventTableData = venue => {
    const { events } = venue;
    return events.map(event => {
      const {
        openDate,
        closeDate,
        startDate,
        endDate
        // buildings,
        // stallCount,
      } = event;
      return {
        ...event,
        checkOutTime: moment(event.checkOutTime, 'H:m:s').format('h:mm a'),
        checkInTime: moment(event.checkInTime, 'H:m:s').format('h:mm a'),
        openDate: (
          <DatesCellData>
            {moment(openDate).format('MM/DD/YYYY hh:mm a')} <br></br>- {moment(closeDate).format('MM/DD/YYYY hh:mm a')}
          </DatesCellData>
        ),
        startDate: (
          <DatesCellData>
            {moment(startDate).format('MM/DD/YYYY')} <br></br>- {moment(endDate).format('MM/DD/YYYY')}
          </DatesCellData>
        ),
        totalStallCount: event.stallProducts.reduce((state, sp) => sp.stalls.length + state, 0),
        totalRvCount: event.rvProducts.reduce((state, rv) => rv.rvSpots.length + state, 0)
        // buildingTotal: `${buildings.length} Barns`,
        // stallTotal: stallCount || 0,
        // priceByNight: pricePerNight ? formatTablePrice(pricePerNight) : 'N/A',
        // priceByEvent: pricePerEvent ? formatTablePrice(pricePerEvent) : 'N/A',
      };
    });
  };

  const filters = [
    {
      key: 'name',
      label: 'NAME',
      type: 'text',
      value: name,
      cb: updateFilterTextField && updateFilterTextField(setName)
    },
    {
      key: 'dates',
      label: 'SELECT DATE',
      type: 'date',
      isFilter: true,
      plural: true,
      value: formatFilterDates && formatFilterDates({ startDate, endDate }),
      cb: updateDates && updateDates('range', setStartDate, setEndDate)
    }
  ];

  if (loading) return <IndeterminateLoading />;
  if (error) {
    // eslint-disable-next-line
    console.error(error);
    return 'uh oh...';
  }
  return (
    <Table
      filters={filters}
      rows={rows}
      data={eventTableData(data.venue)}
      onEditClick={onEditClick}
      orderBy={sortName}
      order={sortOrder}
      onRequestSort={onRequestSort({ sortName, sortOrder }, { setSortName, setSortOrder, setOrderBy })}
      onClearFilters={onClearFilters(
        availableFilters,
        {
          name: [name, setName],
          startDate: [startDate, setStartDate],
          endDate: [endDate, setEndDate]
        },
        setFilterBy
      )}
      onSubmit={onSubmitFilter(availableFilters, { name, startDate, endDate }, setFilterBy, setPage)}
      onClearSingleFilter={onClearSingleFilter(filterBy, setFilterBy)}
      page={page}
      rowsPerPage={rowsPerPage}
      onChangePage={handleTableChangePage(setPage)}
      onChangeRowsPerPage={handleTableChangeRowsPerPage(setRowsPerPage, setPage)}
      count={data.allVenueEvents.events.length}
      allTableRows={data.allVenueEvents.events}
    />
  );
};

const DatesCellData = styled.div`
  width: 160px;
`;

// eslint-disable-next-line prettier/prettier
export default compose(withTableActions)(EventsTable);

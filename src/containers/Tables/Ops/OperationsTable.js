// @flow
import React, { useState, useEffect, useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { compose } from 'recompose';
import styled from 'styled-components';

import { restAPI } from '../../../lib/api';
import { HeadingOne } from 'Components/Headings';
import Table from '../../../components/Table.DEPRECATED';
import ContextSnackbar from '../../../components/Snackbar';
import ExportButton from '../../../components/Button/ExportButton';
import { STALLS_FOR_OPS_TABLE } from '../../../queries/Ops/StallsForOpsTable';
import withTableActions from '../../../enhancers/withTableActions';
import withUpdateStallStatus, { type StallStatusUpdateType } from '../../../mutations/UpdateStallStatus';

import colors from '../../../styles/Colors';

import { withSnackbarContextActions } from '../../../store/SnackbarContext';
import type { ShowSnackbarType } from '../../../store/SnackbarContext';
import type { UserContextType } from '../../../store/UserContextType';
import { UserContext } from '../../../store/UserContext';

export type StallType = {|
  id: string,
  isActive: boolean,
  name: string,
  previouslySaved: ?boolean
|};

export type OpsVenueReservationsType = {|
  reservationStalls: StallType
|};

type OperationsTablePropsType = {|
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
  onMasterCheckboxClick: (reservationStalls: [], checkedRows: { id: string }[], setCheckedRows: (val: { id: string }[]) => void) => void,
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
      buildingId?: string,
      endDate?: string,
      name?: string,
      startDate?: string,
      status?: string
    },
    setFilterBy: (val: string | null) => void,
    setPage: (val: number) => void
  ) => void,
  showSnackbar: ShowSnackbarType,
  updateCheckedRows: (checkedRows: { id: string }[], setCheckedRows: (val: { id: string }[]) => void) => void,
  updateDates: (val: string, setStartDate: (val: string) => void, setEndDate: (val: string) => void) => void,
  updateFilterTextField: (setName: (val: string) => void) => void,
  updateStallStatus: (input: StallStatusUpdateType, variables: VariablesType) => void
|};

type OrderByType = 'building_ASC' | 'building_DESC' | 'name_ASC' | 'name_DESC' | 'status_ASC' | 'status_DESC' | 'nextReservation_ASC' | 'nextReservation_DESC';

type FilterKeysType = 'buildingId' | 'name' | 'status' | 'startDate' | 'endDate';

type FilterByType = {|
  [key: FilterKeysType]: string
|};

export type VariablesType = {|
  filterBy: FilterByType,
  orderBy: OrderByType
|};

export const OperationsTableBase = (props: OperationsTablePropsType) => {
  const {
    user: { venues = [], id }
  } = useContext<UserContextType>(UserContext);
  const [firstVenue = {}] = venues;
  const { id: venueId } = firstVenue;

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
    updateCheckedRows,
    onMasterCheckboxClick,
    handleTableChangePage,
    handleTableChangeRowsPerPage,
    showSnackbar
  } = props;
  const [sortName, setSortName] = useState('startDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(['name', 'ASC']);
  const [filterBy, setFilterBy] = useState(null);
  const [buildingId, setBuildingId] = useState('');
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [checkedRows, setCheckedRows] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(0);
  const [loadingReport, setLoadingReport] = useState(false);

  const availableFilters = ['buildingId', 'name', 'status', 'startDate', 'endDate'];

  useEffect(() => {
    if (loadingReport) {
      showSnackbar('Generating report. Download will begin shortly', {
        duration: 5000
      });
    }
  }, [loadingReport]);

  const variables =
    getVariables &&
    getVariables({
      orderBy,
      filterBy,
      rowsPerPage,
      page
    });

  const { data, loading, error } = useQuery(STALLS_FOR_OPS_TABLE, {
    variables: { ...variables },
    pollInterval: 5000,
    fetchPolicy: 'network-only'
  });

  const rows = [
    {
      id: 'checkable',
      numeric: false,
      disablePadding: false,
      label: ''
    },
    {
      id: 'building',
      numeric: false,
      disablePadding: false,
      label: 'STALL LOCATION'
    },
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: 'STALL #',
      sortable: true
    },
    {
      id: 'status',
      numeric: false,
      disablePadding: false,
      label: 'STATUS',
      sortable: true
    },
    {
      id: 'departureDate',
      numeric: false,
      disablePadding: false,
      label: 'CHECK OUT DATE',
      sortable: false
    },
    {
      id: 'nextReservation',
      numeric: false,
      disablePadding: false,
      label: 'NEXT CHECK IN',
      sortable: false
    }
  ];

  const statusOptions = [
    { value: 'clean', label: 'CLEAN' },
    { value: 'dirty', label: 'DIRTY' },
    { value: 'occupied', label: 'OCCUPIED' }
  ];

  const getBuildingName = buildings => {
    if (!buildingId) return '';
    const match = buildings.find(building => {
      return building.id === buildingId;
    });
    if (match) return match.name;
  };

  const getStallBuildingNameOptions = buildings => {
    return buildings.map(building => {
      return { value: building.id, label: building.name };
    });
  };

  const onBulkOptionClick = status => {
    const ids = checkedRows.map(row => row.id);
    ids.map(id => {
      return props.updateStallStatus({ id, status }, variables);
    });
    setCheckedRows([]);
  };

  const updateStallStatus = stall => event => {
    const { id } = stall;
    const status = event.target.value;
    return props.updateStallStatus({ id, status }, variables);
  };

  const reservationStalls = data?.venue?.stalls || [];

  const operationsTableData = () => {
    return reservationStalls.map(stall => {
      const stallData = {
        id: stall.id,
        status: {
          id: 'STATUS',
          value: stall.status,
          label: 'STATUS',
          cb: updateStallStatus(stall),
          options: statusOptions
        },
        departureDate: stall.currentOrder ? stall.currentOrder.lastDepartureDate : '-',
        nextReservation: stall.nextOrder ? stall.nextOrder.nextReservationDate : '-',
        building: stall.building.name,
        name: stall.name
      };
      return {
        ...stallData
      };
    });
  };

  const updateFilterStatus = event => {
    if (event.target) {
      const { value } = event.target;
      const match = statusOptions.find(option => option.value === value);
      if (match) return setStatus(match.value);
    }
    return setStatus('');
  };

  const updateStallLocationFilter = (buildings: { id: string }[]) => event => {
    if (event.target) {
      const { value } = event.target;
      const match = buildings.find(building => {
        return building.id === value;
      });
      if (match) return setBuildingId(match.id);
    }
    return setBuildingId('');
  };

  const filters = [
    {
      key: 'buildingId',
      label: 'STALL LOCATION',
      type: 'select',
      value: getBuildingName(data ? data.venue.buildings : []),
      selectedOption: buildingId,
      options: getStallBuildingNameOptions(data ? data.venue.buildings : []),
      cb: updateStallLocationFilter(data ? data.venue.buildings : [])
    },
    {
      key: 'name',
      label: 'STALL NUMBER',
      type: 'text',
      value: name,
      cb: updateFilterTextField && updateFilterTextField(setName)
    },
    {
      key: 'status',
      label: 'STATUS',
      type: 'select',
      value: status ? status.toUpperCase() : null,
      selectedOption: status,
      options: statusOptions,
      cb: updateFilterStatus
    },
    {
      key: 'endDate',
      label: 'CHECK OUT DATE',
      type: 'date',
      plural: false,
      value: endDate,
      showPast: false,
      cb: updateDates && updateDates('single-end', setStartDate, setEndDate)
    },
    {
      key: 'startDate',
      label: 'NEXT CHECK IN',
      type: 'date',
      plural: false,
      value: startDate,
      showPast: false,
      cb: updateDates && updateDates('single', setStartDate, setEndDate)
    }
  ];

  if (loading) return 'Loading...';
  if (error) {
    // eslint-disable-next-line
    console.error(error);
    return 'uh oh...';
  }

  const handleExportStalls = async () => {
    if (!venueId) return;

    setLoadingReport(true);
    let path = 'ops/stalls-report';
    let fileName = 'StallsReport.xlsx';

    const setFilters = { buildingId, name, status, startDate, endDate };
    const exportFilters = {};
    Object.keys(setFilters).forEach(filterKey => {
      if (setFilters[filterKey]) {
        exportFilters[filterKey] = setFilters[filterKey];
      }
    });

    try {
      await restAPI({
        path,
        method: 'POST',
        body: {
          venueId,
          userId: id,
          options: {
            filterBy: exportFilters,
            orderBy: ['stall', 'ASC']
          }
        },
        header: {
          responseType: 'blob'
        },
        isDownload: true,
        fileName
      });
    } catch (err) {
      showSnackbar('Unable to download report', {
        duration: 5000,
        error: true
      });
    }

    setLoadingReport(false);
  };

  return (
    <>
      <ContextSnackbar />
      <div className={`${className}__page-header`}>
        <div className={`${className}__header-wrapper`}>
          <HeadingOne label="STALLS" />
          <div>
            <ExportButtonBase label={'EXPORT REPORT'} onClick={handleExportStalls} loading={loadingReport} />
          </div>
        </div>
      </div>

      <Table
        filters={filters}
        rows={rows}
        data={operationsTableData()}
        onSubmit={onSubmitFilter(availableFilters, { buildingId, name: name, status, startDate, endDate }, setFilterBy, setPage)}
        onClearFilters={onClearFilters(
          availableFilters,
          {
            buildingId: [buildingId, setBuildingId],
            name: [name, setName],
            status: [status, setStatus],
            startDate: [startDate, setStartDate],
            endDate: [endDate, setEndDate]
          },
          setFilterBy
        )}
        onEditClick={onEditClick}
        orderBy={sortName}
        order={sortOrder}
        onRequestSort={onRequestSort({ sortName, sortOrder }, { setSortName, setSortOrder, setOrderBy })}
        onCheckboxClick={updateCheckedRows(checkedRows, setCheckedRows)}
        selectedRows={{
          rows: checkedRows,
          cb: onBulkOptionClick,
          options: statusOptions
        }}
        onMasterCheckboxClick={onMasterCheckboxClick(reservationStalls, checkedRows, setCheckedRows)}
        view="operations"
        onClearSingleFilter={onClearSingleFilter(filterBy, setFilterBy)}
        allTableRows={data.allVenueStalls.stalls}
        count={data.allVenueStalls?.stalls?.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onChangePage={handleTableChangePage(setPage)}
        onChangeRowsPerPage={handleTableChangeRowsPerPage(setRowsPerPage, setPage)}
      />
    </>
  );
};

const OperationsTable = styled(OperationsTableBase)`
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

const ExportButtonBase = styled(ExportButton)`
  &&& {
    background-color: ${colors.secondary.active};
    padding-top: 10px;

    svg {
      position: relative;
      top: -2px;
    }
  }
`;

// eslint-disable-next-line prettier/prettier
export default compose(withUpdateStallStatus, withTableActions, withSnackbarContextActions)(OperationsTable);

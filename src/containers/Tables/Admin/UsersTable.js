// @flow
import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { compose } from 'recompose';

import Table from '../../../components/Table.DEPRECATED';
import { FILTERED_VENUE_RENTERS } from '../../../queries/Admin/FilteredVenueRenters';
import withTableActions from '../../../enhancers/withTableActions';
import { formatPhoneNumber } from '../../../helpers/formatPhoneNumber';
import IndeterminateLoading from '../../../components/Loading/IndeterminateLoading';

export type VenueUsersType = {|
  email: string,
  firstName: string,
  id: number | string,
  lastName: string,
  phone: string
|};

type UsersTablePropsType = {|
  getVariables: (params: {
    filterBy: string | null,
    orderBy: string[],
    page: number,
    rowsPerPage: number
  }) => void,
  handleTableChangePage: (setPage: (page: number) => void) => void,
  handleTableChangeRowsPerPage: (setRows: (rows: number) => void, setPage: (page: number) => void) => void,
  onClearFilters: (
    availableFilters: ['firstName', 'lastName', 'role'],
    {
      firstName: [string, (val: string) => void],
      lastName: [string, (val: string) => void],
      role: [string, (val: string) => void]
    },
    setFilterBy: (filter: string | null) => void
  ) => void,
  onClearSingleFilter: (filter: string | null, setFilter: (filter: string | null) => void) => void,
  onEditClick: () => void,
  onRequestSort: (
    sort: { sortName: string, sortOrder: string },
    order: {
      setOrderBy: (order: string[]) => void,
      setSortName: (name: string) => void,
      setSortOrder: (order: string) => void
    }
  ) => void,
  onSubmitFilter: (
    availableFilters: ['firstName', 'lastName', 'role'],
    {
      firstName: string,
      lastName: string,
      role: string
    },
    setFilterBy: (val: string | null) => void,
    setPage: (val: number) => void
  ) => void,
  updateFilterTextField: (setLastName: (val: string) => void) => void,
  updateSelect: (setRole: (val: string) => void) => void,
  userRoles: string[]
|};

export const UsersTable = (props: UsersTablePropsType) => {
  const {
    userRoles,
    onEditClick,
    updateFilterTextField,
    updateSelect,
    getVariables,
    onSubmitFilter,
    onClearFilters,
    onRequestSort,
    onClearSingleFilter,
    handleTableChangePage,
    handleTableChangeRowsPerPage
  } = props;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [sortName, setSortName] = useState('firstName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(['firstName', 'ASC']);
  const [filterBy, setFilterBy] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(0);

  const availableFilters = ['firstName', 'lastName', 'role'];

  const variables =
    getVariables &&
    getVariables({
      orderBy,
      filterBy,
      rowsPerPage,
      page
    });

  const { data, loading, error } = useQuery(FILTERED_VENUE_RENTERS, {
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
      id: 'firstName',
      numeric: false,
      disablePadding: false,
      label: 'FIRST NAME',
      sortable: true
    },
    {
      id: 'lastName',
      numeric: false,
      disablePadding: false,
      label: 'LAST NAME',
      sortable: true
    },
    {
      id: 'email',
      numeric: false,
      disablePadding: false,
      label: 'EMAIL ADDRESS'
    },
    {
      id: 'phone',
      numeric: false,
      disablePadding: false,
      label: 'PHONE NUMBER'
    },
    {
      id: 'role',
      numeric: false,
      disablePadding: false,
      label: 'USER TYPE'
    }
  ];

  const renterTableData = venue => {
    const { users } = venue;
    return users.map(user => {
      return {
        id: `${user.id}`,
        role: user.role,
        firstName: `${user.firstName}`,
        lastName: `${user.lastName}`,
        email: `${user.email}`,
        phone: formatPhoneNumber(user.phone)
      };
    });
  };

  const filters = [
    {
      key: 'firstName',
      label: 'FIRST NAME',
      type: 'text',
      value: firstName,
      cb: updateFilterTextField && updateFilterTextField(setFirstName)
    },
    {
      key: 'lastName',
      label: 'LAST NAME',
      type: 'text',
      value: lastName,
      cb: updateFilterTextField && updateFilterTextField(setLastName)
    },
    {
      key: 'role',
      label: 'USER TYPE',
      type: 'select',
      value: role,
      options: userRoles ? Object.values(userRoles)[0] : null,
      cb: updateSelect && updateSelect(setRole),
      selectedOption: role
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
      data={renterTableData(data.venue)}
      onSubmit={onSubmitFilter(
        availableFilters,
        {
          firstName,
          lastName,
          role
        },
        setFilterBy,
        setPage
      )}
      onClearFilters={onClearFilters(
        availableFilters,
        {
          firstName: [firstName, setFirstName],
          lastName: [lastName, setLastName],
          role: [role, setRole]
        },
        setFilterBy
      )}
      onEditClick={onEditClick}
      orderBy={sortName}
      order={sortOrder}
      onRequestSort={onRequestSort({ sortName, sortOrder }, { setSortName, setSortOrder, setOrderBy })}
      onClearSingleFilter={onClearSingleFilter(filterBy, setFilterBy)}
      count={data.allVenueUsers.users.length}
      allTableRows={data.allVenueUsers.users}
      page={page}
      rowsPerPage={rowsPerPage}
      onChangePage={handleTableChangePage(setPage)}
      onChangeRowsPerPage={handleTableChangeRowsPerPage(setRowsPerPage, setPage)}
    />
  );
};

// prettier-ignore
export default compose(withTableActions)(UsersTable)

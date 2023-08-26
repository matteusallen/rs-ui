// @flow
import React, { useState, memo } from 'react';
import styled from 'styled-components';
import { compose } from 'recompose';

import { headingOne } from '../../styles/Typography';
import UsersTable from '../../containers/Tables/Admin/UsersTable';
import RenterForm from '../RenterFormModal';
import { displayFlex } from '../../styles/Mixins';
import AddButton from '../../components/Button/AddButton';
import { withUserContext } from '../../store/UserContext';
import { withUserRoleContext } from '../../store/UserRoleContext';
import ContextSnackbar from '../../components/Snackbar';
import { HeadingOne } from 'Components/Headings';

export type UserRoleType = {|
  id: string
|};
export type UserType = {|
  email: string,
  firstName: string,
  id: string,
  lastName: string,
  phone: string,
  // TODO - Define UserRoleType
  role: UserRoleType,
  // $FlowIgnore
  venues: Array
|};

type AdminUsersPropsType = {|
  className: string,
  user: UserType,
  // $FlowIgnore
  userRoles: Array
|};

const AdminUsersBase = (props: AdminUsersPropsType) => {
  const { className, user: adminUser, userRoles } = props;
  const [openAdd, onAddClick] = useState(false);
  const [openEdit, onEditClick] = useState(false);
  const [user, selectUser] = useState({});

  const closeAdd = () => onAddClick(false);
  const closeEdit = () => {
    selectUser({});
    onEditClick(false);
  };
  const openAddModal = () => onAddClick(true);
  const openEditModal = user => {
    selectUser(user);
    onEditClick(true);
  };

  return (
    <>
      <ContextSnackbar />
      <RenterForm adminUser={adminUser} heading={'ADD USER'} onClose={closeAdd} open={openAdd} user={{}} userRoles={userRoles} />
      <RenterForm adminUser={adminUser} heading={'EDIT USER'} onClose={closeEdit} open={openEdit} user={user} userRoles={userRoles} />
      <section className={className}>
        <FlexWrapper>
          <HeadingOne label="USERS" />
          <AddButton onClick={openAddModal} label={'ADD USER'} />
        </FlexWrapper>
        <UsersTable onEditClick={openEditModal} userRoles={userRoles} />
      </section>
    </>
  );
};

const AdminUsers = styled(AdminUsersBase)`
  margin: 85px 50px 50px;
  max-width: 1800px;
  min-width: 1130px;
  &__Header {
    ${headingOne}
    text-align: left;
    margin: 0;
  }
`;

const FlexWrapper = styled.div`
  ${displayFlex}
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

//prettier-ignore
export default memo<{}>(compose(withUserContext, withUserRoleContext)(AdminUsers))

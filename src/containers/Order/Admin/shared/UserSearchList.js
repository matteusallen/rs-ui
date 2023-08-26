//@flow
import React from 'react';

type UserType = {|
  email: string,
  firstName: string,
  id: string,
  lastName: string,
  phone?: string,
  savedCreditCards?: []
|};

type UserSearchListPropsType = {|
  className: string,
  setUser: UserType => void,
  tab: number | null,
  users: UserType[],
  visible?: boolean
|};

const UserSearchList = (props: UserSearchListPropsType) => {
  const { tab, visible, className, users = [], setUser } = props;
  const isTabActive = tab !== null;

  if (!visible || !users.length) return null;
  return (
    <div className={`${className}__user-list-container`}>
      {users.map((user, key) => (
        <div
          className={`${className}__user-list-item ${isTabActive && key === tab ? 'active' : ''}`}
          key={user.email}
          onClick={() => setUser(user)}
          onKeyPress={() => setUser(user)}
          role="button"
          tabIndex={0}>
          {user.email}
        </div>
      ))}
    </div>
  );
};

export default UserSearchList;

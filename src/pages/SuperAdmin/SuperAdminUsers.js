import React from 'react';
import styled from 'styled-components';
import { displayFlex } from '../../styles/Mixins';
import { paragraphReg } from '../../styles/Typography';
import colors from '../../styles/Colors';
import ContextSnackbar from '../../components/Snackbar';
import { HeadingOne } from 'Components/Headings';

const SuperAdminUsersBase = props => {
  const { className } = props;
  return (
    <div className={className}>
      <ContextSnackbar />
      <div className={`${className}__page-header`}>
        <div className={`${className}__header-wrapper`}>
          <HeadingOne label="SUPER ADMIN USERS" />
        </div>
      </div>
    </div>
  );
};

const SuperAdminUsers = styled(SuperAdminUsersBase)`
  &&& {
    ${displayFlex}
    align-items: center;
    width: 100%;
    height: auto;
    margin: 65px 0 25px;
    padding: 12px 0 11px 20px;
    ${paragraphReg}
    font-size: 14px;
    text-align: left;
    background-color: ${colors.background.primary};
    color: ${colors.text};
    border-radius: 3px;
  }

  &__page-header {
    text-align: left;
    width: 100%
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

export default SuperAdminUsers;

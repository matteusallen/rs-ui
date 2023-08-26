// @flow
import React from 'react';
import styled, { css } from 'styled-components';
import { ListItem, ListItemIcon, ListItemText, Button } from '@material-ui/core';
import { PowerSettingsNew } from '@material-ui/icons';

import { displayFlex } from '../../styles/Mixins';
import withLogout from '../../mutations/Logout';
import colors from '../../styles/Colors';
import { paragraphReg } from '../../styles/Typography';

type LogOutPropsType = {|
  className: string,
  isNavOpen: boolean,
  isRenter: boolean,
  logoutUser: () => void
|};

const LogOutBase = (props: LogOutPropsType) => {
  if (props.isRenter) {
    return (
      <Button className={`${props.className} e2e-logout-btn`} onClick={props.logoutUser}>
        <PowerSettingsNew />
      </Button>
    );
  }
  return (
    <ListItem button className={props.className} onClick={props.logoutUser} data-testid="admin-logout-btn">
      <ListItemIcon>
        <PowerSettingsNew />
      </ListItemIcon>
      {props.isNavOpen && <ListItemText primary={<p>SIGN OUT</p>} />}
    </ListItem>
  );
};

const LogOut = styled(LogOutBase)`
  &&& {
    ${({ isRenter }) =>
      isRenter
        ? css`
            position: absolute;
            right: 25px;
            margin: 0;
            color: ${colors.button.primary.disabled};
          `
        : css`
            ${displayFlex}
            align-items: center;
            justify-content: ${({ isNavOpen }) => (isNavOpen ? 'flex-start' : 'center')};
            height: 72px;
            .MuiListItemIcon-root {
              color: ${colors.button.primary.disabled};
              min-width: auto;
            }
            .MuiListItemText-root {
              p {
                color: ${colors.text.lightGray};
                ${paragraphReg}
                font-size: 1.125rem;
                padding-left: 27px;
                font-weight: 600;
                letter-spacing: 0.8px;
                text-align: left;
              }
            }
          `}
`;

export default withLogout(LogOut);

//@flow
import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import EventIcon from '@material-ui/icons/Event';
import MenuIcon from '@material-ui/icons/Menu';
import OSLogoIcon from '../../assets/img/icons/os-logo-icon';

import colors from '../../styles/Colors';
import { subRouteCodes as SUB_ROUTES } from '../../constants/routes';
import { BIG_TABLET_WIDTH, DESKTOP_WIDTH, SMALL_TABLET_WIDTH } from '../../styles/Mixins';

const Footer = ({ className = '' }) => {
  const theme = useTheme();
  const matchesMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <div className={`${className} footer-container`}>
      {matchesMobile && (
        <AppBar position="fixed" className="bottom-bar">
          <Toolbar>
            <IconButton component={NavLink} to={SUB_ROUTES.RENTER.EVENTS} color="inherit" aria-label="Help &amp; Support" activeClassName="active-link">
              <EventIcon />
            </IconButton>
            <IconButton
              component={NavLink}
              to={SUB_ROUTES.RENTER.RESERVATIONS}
              color="inherit"
              className="os-logo"
              aria-label="Reservations"
              activeClassName="active-link">
              <OSLogoIcon />

              {/* <SvgIcon component={OSLogo} viewBox='0 0 24 24' className='os-logo'/> */}
            </IconButton>
            <IconButton component={NavLink} to={SUB_ROUTES.RENTER.HELP} color="inherit" aria-label="Help &amp; Support" activeClassName="active-link">
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}
    </div>
  );
};

const AdminFooterStyles = styled(Footer)`
  &.footer-container {
    width: 100%;
    bottom: 0;
    z-index: 1210;
    position: fixed;

    header {
      color: ${colors.text.lightGray2};
      background: ${colors.white};
      height: 80px;
      position: relative;
      justify-content: center;


      .MuiToolbar-root {
        justify-content: space-between;
        padding: 20px;

        .MuiButtonBase-root {
          padding: 5px;

          &.active-link {
            color: ${colors.primary};
          }

          .MuiSvgIcon-root {
            height: 40px;
            width: 40px;
          }
        }
      }
    }

    @media screen and (min-width: ${SMALL_TABLET_WIDTH}) {
      flex-direction: row;
      padding: 0;
      margin: 0;
    }

    @media screen and (min-width: ${BIG_TABLET_WIDTH}) {
      // min-width: ${DESKTOP_WIDTH};
    }

    @media screen and (min-width: ${DESKTOP_WIDTH}) {
      justify-content: flex-start;
      padding: 0;
    }
  }
`;

export default AdminFooterStyles;

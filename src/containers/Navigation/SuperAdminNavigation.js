/* global DEPLOYMENT_ENV */
import React, { useState } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router';
import { NavLink, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import classNames from 'classnames';
import { AppBar, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, withStyles } from '@material-ui/core';
import { ChevronLeft, ChevronRight, LocationOn, Menu, Warning } from '@material-ui/icons';
import { green, yellow, red } from '@material-ui/core/colors';

import Can from '../../components/Can';
import OpenStallsLogo from '../../assets/img/open-stalls-white.png';

import Logout from '../Logout';
import ROUTES, { base, subRouteCodes as SUB_ROUTES } from '../../constants/routes';
import { withUserContext } from '../../store/UserContext';
import { IS_SUPER_ADMIN } from '../../constants/authRules';

import Logo from '../../assets/img/rodeo-logistics-logo-white.png';
import { paragraphReg } from '../../styles/Typography';

const ENV = DEPLOYMENT_ENV || process.env.NODE_ENV;

const SuperAdminNavigationBase = props => {
  const { classes, theme } = props;

  const [isOpen, setIsOpen] = useState(false);

  const handleDrawerOpen = () => {
    setIsOpen(true);
  };

  const handleDrawerClose = () => {
    setIsOpen(false);
  };

  const envColor = ENV.match('prod') ? red[500] : ENV.match('dev') ? green[500] : yellow[500];

  return (
    <div className={`${classes.root} admin-root-section`} data-testid="logged-in-header">
      <CssBaseline />
      <AppBar
        position="fixed"
        className={classNames(classes.appBar, {
          [classes.appBarShift]: isOpen
        })}>
        <Toolbar disableGutters={!isOpen}>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={handleDrawerOpen}
            className={classNames(classes.menuButton, {
              [classes.hide]: isOpen
            })}>
            <Menu />
          </IconButton>
          <div className={classes.openstallsEnv} style={{ color: envColor }}>
            <Warning style={{ fontSize: 35 }} />
            <span style={{ paddingLeft: 5, display: 'inline-block' }}>{ENV}</span>
          </div>
          <img src={OpenStallsLogo} alt="Open Stalls" className={classes.openstallsLogo} />
          <img src={Logo} alt="Rodeo Logistics Logo" className={classes.appLogo} />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={classNames(classes.drawer, {
          [classes.drawerOpen]: isOpen,
          [classes.drawerClose]: !isOpen
        })}
        classes={{
          paper: classNames({
            [classes.drawerOpen]: isOpen,
            [classes.drawerClose]: !isOpen
          })
        }}
        open={isOpen}>
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose} className={classes.drawerListItem}>
            {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </div>
        <Divider className={classes.drawerListItemBorder} />
        <List className={classes.mainNavContainer}>
          <Can
            perform={IS_SUPER_ADMIN}
            ignoreRoute
            yes={() => (
              <>
                <NavLinkBase to={SUB_ROUTES.SUPER_ADMIN.VENUES} className={classes.drawerListItem} activeClassName="active-link">
                  <ListItemButton button>
                    <ListItemIcon className={classes.drawerListItemIcon}>
                      <LocationOn />
                    </ListItemIcon>
                    <ListItemText>
                      <NavItemText>VENUES</NavItemText>
                    </ListItemText>
                  </ListItemButton>
                  <Divider className={classes.drawerListItemBorder} />
                </NavLinkBase>
              </>
            )}
            // If user is not super admin, redirect to main or login. Don't give them a clue where our super admin is
            no={() => <Redirect to={props.user ? base : ROUTES.LOGIN} />}
          />
        </List>
        <List className={classes.logoutContainer}>
          <Logout isNavOpen={isOpen} />
        </List>
      </Drawer>
      <PageContainer>{props.children}</PageContainer>
    </div>
  );
};

const PageContainer = styled.section`
  width: 100%;
`;

const drawerWidth = 240;

const NavItemText = styled.p`
  &&& {
    color: rgb(200, 214, 229);
    ${paragraphReg}
    font-size: 1.125rem;
    font-weight: 600;
    letter-spacing: 0.8px;
  }
`;

const NavLinkBase = styled(NavLink)`
  &.active-link {
    &&& {
      &:active div[class^='MuiListItemIcon-root'],
      div[class*='MuiListItemIcon-root'] {
        color: white;
      }
      div[class^='MuiListItemText-root'],
      div[class*='MuiListItemText-root'] {
        p {
          color: white;
        }
      }
    }
  }
`;

const ListItemButton = styled(ListItem)`
  &&& {
    padding: 0;
  }
`;

const styles = theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: 'black',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  appTitle: {
    fontFamily: 'IBMPlexSans-SemiBold',
    fontSize: '1.125rem',
    letterSpacing: '0.8px'
  },
  appLogo: {
    display: 'block',
    position: 'absolute',
    right: 0,
    marginRight: '25px',
    width: '212px',
    height: '30px'
  },
  openstallsEnv: {
    display: 'flex',
    position: 'absolute',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 25,
    left: 'calc(50% - 100px)'
  },
  openstallsLogo: {
    display: 'block',
    position: 'absolute',
    left: 0,
    marginLeft: '130px',
    width: '150px',
    height: '33px'
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerOpen: {
    backgroundColor: 'rgb(87, 101, 116)',
    color: 'rgb(200, 214, 229)',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    backgroundColor: 'rgb(87, 101, 116)',
    color: 'rgb(200, 214, 229)',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1
    }
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    backgroundColor: 'rgb(87, 101, 116)',
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  drawerListItem: {
    color: 'rgb(200, 214, 229)',
    marginRight: 0,
    padding: 0,
    textDecoration: 'none'
  },
  drawerListItemIcon: {
    color: 'rgb(200, 214, 229)',
    marginRight: 0,
    padding: '24px',
    width: '72px',
    height: '72px'
  },
  drawerListItemBorder: {
    backgroundColor: 'rgb(200, 214, 229)'
  },
  mainNavContainer: {
    paddingTop: 0,
    paddingBottom: 0
  },
  listItemButton: {
    padding: 0
  },
  logoutContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0
  }
});
export default compose(withStyles(styles, { withTheme: true }), withRouter, withUserContext)(SuperAdminNavigationBase);

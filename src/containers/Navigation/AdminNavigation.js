import React, { PureComponent } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import classNames from 'classnames';
import { CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, withStyles } from '@material-ui/core';
import { ChevronLeft, ChevronRight, Dashboard, Event } from '@material-ui/icons';
import Can from '../../components/Can';
import { subRouteCodes as SUB_ROUTES } from '../../constants/routes';
import { ADMIN_FULL_ACCESS } from '../../constants/authRules';
import { paragraphReg } from '../../styles/Typography';
import NavigationIcon from '../../components/Navigation/NavigationIcon';
import AppHeader from './AppHeader';

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

class AdminNavigation extends PureComponent {
  state = {
    open: false,
    showAccountDropdown: false
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  toggleAccountDropdown = () => {
    this.setState({ showAccountDropdown: !this.state.showAccountDropdown });
  };

  hideAccountDropdown = () => {
    this.setState({ showAccountDropdown: false });
  };

  render() {
    const { classes, theme, location } = this.props;
    const { showAccountDropdown } = this.state;
    const showHamburger = true;

    return (
      <div className={`${classes.root} admin-root-section`} data-testid="logged-in-header">
        <CssBaseline />
        <AppHeader
          showHamburger={showHamburger}
          drawerOpen={this.state.open}
          handleDrawerOpen={this.handleDrawerOpen}
          toggleAccountDropdown={this.toggleAccountDropdown}
          showAccountDropdown={showAccountDropdown}
        />
        <Drawer
          variant="permanent"
          className={classNames(classes.drawer, {
            [classes.drawerOpen]: this.state.open,
            [classes.drawerClose]: !this.state.open
          })}
          classes={{
            paper: classNames({
              [classes.drawerOpen]: this.state.open,
              [classes.drawerClose]: !this.state.open
            })
          }}
          onClick={this.hideAccountDropdown}
          open={this.state.open}>
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose} className={classes.drawerListItem}>
              {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
          </div>
          <Divider className={classes.drawerListItemBorder} />
          <List className={classes.mainNavContainer}>
            <NavLinkBase data-testid={SUB_ROUTES.ADMIN.ORDERS} to={SUB_ROUTES.ADMIN.ORDERS} className={classes.drawerListItem} activeClassName="active-link">
              <ListItemButton button>
                <ListItemIcon className={classes.drawerListItemIcon}>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText>
                  <NavItemText>ORDERS</NavItemText>
                </ListItemText>
              </ListItemButton>
              <Divider className={classes.drawerListItemBorder} />
            </NavLinkBase>
            <Can
              perform={ADMIN_FULL_ACCESS}
              ignoreRoute
              yes={() => (
                <>
                  <NavLinkBase
                    data-testid={SUB_ROUTES.ADMIN.EVENTS}
                    to={SUB_ROUTES.ADMIN.EVENTS}
                    className={classes.drawerListItem}
                    activeClassName="active-link">
                    <ListItemButton button>
                      <ListItemIcon className={classes.drawerListItemIcon}>
                        <Event />
                      </ListItemIcon>
                      <ListItemText>
                        <NavItemText>EVENTS</NavItemText>
                      </ListItemText>
                    </ListItemButton>
                    <Divider className={classes.drawerListItemBorder} />
                  </NavLinkBase>
                  <NavLinkBase
                    data-testid={SUB_ROUTES.ADMIN.USERS}
                    to={SUB_ROUTES.ADMIN.USERS}
                    className={classes.drawerListItem}
                    activeClassName="active-link">
                    <ListItemButton button>
                      <ListItemIcon className={classes.drawerListItemIcon}>
                        <NavigationIcon path={location.pathname} icon="renters" />
                      </ListItemIcon>
                      <ListItemText>
                        <NavItemText>USERS</NavItemText>
                      </ListItemText>
                    </ListItemButton>
                    <Divider className={classes.drawerListItemBorder} />
                  </NavLinkBase>
                </>
              )}
            />
            <NavLinkBase data-testid={SUB_ROUTES.OPS.STALLS} to={SUB_ROUTES.OPS.STALLS} className={classes.drawerListItem} activeClassName="active-link">
              <ListItemButton button>
                <ListItemIcon className={classes.drawerListItemIcon}>
                  <NavigationIcon path={location.pathname} icon="stalls" />
                </ListItemIcon>
                <ListItemText>
                  <NavItemText>STALLS</NavItemText>
                </ListItemText>
              </ListItemButton>
              <Divider className={classes.drawerListItemBorder} />
            </NavLinkBase>
            <NavLinkBase data-testid={SUB_ROUTES.OPS.RVS} to={SUB_ROUTES.OPS.RVS} className={classes.drawerListItem} activeClassName="active-link">
              <ListItemButton button>
                <ListItemIcon className={classes.drawerListItemIcon}>
                  <NavigationIcon path={location.pathname} icon="rvs" />
                </ListItemIcon>
                <ListItemText>
                  <NavItemText>RVs</NavItemText>
                </ListItemText>
              </ListItemButton>
              <Divider className={classes.drawerListItemBorder} />
            </NavLinkBase>
            <Can
              perform={ADMIN_FULL_ACCESS}
              ignoreRoute
              yes={() => (
                <>
                  <NavLinkBase
                    data-testid={SUB_ROUTES.ADMIN.GROUPS}
                    to={SUB_ROUTES.ADMIN.GROUPS}
                    className={classes.drawerListItem}
                    activeClassName="active-link">
                    <ListItemButton button>
                      <ListItemIcon className={classes.drawerListItemIcon}>
                        <NavigationIcon path={location.pathname} icon="groups" />
                      </ListItemIcon>
                      <ListItemText>
                        <NavItemText>GROUPS</NavItemText>
                      </ListItemText>
                    </ListItemButton>
                    <Divider className={classes.drawerListItemBorder} />
                  </NavLinkBase>
                </>
              )}
            />
            <Can
              perform={ADMIN_FULL_ACCESS}
              ignoreRoute
              yes={() => (
                <>
                  <NavLinkBase
                    data-testid={SUB_ROUTES.ADMIN.REPORTS}
                    to={SUB_ROUTES.ADMIN.REPORTS}
                    className={classes.drawerListItem}
                    activeClassName="active-link">
                    <ListItemButton button>
                      <ListItemIcon className={classes.drawerListItemIcon}>
                        <NavigationIcon path={location.pathname} icon="reports" />
                      </ListItemIcon>
                      <ListItemText>
                        <NavItemText>REPORTS</NavItemText>
                      </ListItemText>
                    </ListItemButton>
                    <Divider className={classes.drawerListItemBorder} />
                  </NavLinkBase>
                </>
              )}
            />
          </List>
        </Drawer>
        <PageContainer onClick={this.hideAccountDropdown}>{this.props.children}</PageContainer>
      </div>
    );
  }
}

const PageContainer = styled.section`
  width: 100%;
`;
export default compose(withStyles(styles, { withTheme: true }), withRouter)(AdminNavigation);

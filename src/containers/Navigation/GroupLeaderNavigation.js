import React, { PureComponent } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import classNames from 'classnames';
import { CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, withStyles } from '@material-ui/core';
import { ChevronLeft, ChevronRight, Dashboard } from '@material-ui/icons';
import Can from '../../components/Can';
import { subRouteCodes as SUB_ROUTES } from '../../constants/routes';
import { paragraphReg } from '../../styles/Typography';
import { IS_GROUP_LEADER } from '../../constants/authRules';
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
  },
  openstallsLogo: {
    display: 'block',
    position: 'absolute',
    left: 0,
    marginLeft: '130px',
    width: '150px',
    height: '33px'
  }
});

class GroupLeaderNavigation extends PureComponent {
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
      <div className={`${classes.root} admin-root-section`}>
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
          open={this.state.open}>
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose} className={classes.drawerListItem}>
              {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
          </div>
          <Divider className={classes.drawerListItemBorder} />
          <List className={classes.mainNavContainer}>
            <Can
              perform={IS_GROUP_LEADER}
              ignoreRoute
              yes={() => (
                <>
                  <NavLinkBase
                    data-testid={SUB_ROUTES.GROUP_LEADER.ORDERS}
                    to={SUB_ROUTES.GROUP_LEADER.ORDERS}
                    className={classes.drawerListItem}
                    activeClassName="active-link">
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
                  <NavLinkBase
                    to={SUB_ROUTES.GROUP_LEADER.GROUPS}
                    className={classes.drawerListItem}
                    activeClassName="active-link"
                    data-testid={SUB_ROUTES.GROUP_LEADER.GROUPS}>
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

export default compose(withStyles(styles, { withTheme: true }), withRouter)(GroupLeaderNavigation);

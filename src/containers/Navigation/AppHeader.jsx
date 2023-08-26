import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { AppBar, Button, Chip, IconButton, Toolbar, withStyles } from '@material-ui/core';
import { AccountCircle, ArrowDropDown, Menu } from '@material-ui/icons';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import OpenStallsLogo from '../../assets/img/open-stalls-white.png';
import Logo from '../../assets/img/rodeo-logistics-logo-white.png';
import accountDropdownRectangle from '../../assets/img/account-drop-down-rectangle.svg';
import { compose } from 'recompose';
import { withUserContext } from '../../store/UserContext';
import withLogout from '../../mutations/Logout';
import { subRouteCodes as SUB_ROUTES } from '../../constants/routes';
import USER_ROLES from 'Constants/userRoles';

const drawerWidth = 240;

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: 'black',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    height: 64
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    height: 64
  },
  appBarWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  appBarSectionBranding: {
    display: 'inline-flex',
    height: '100%',
    alignItems: 'center'
  },
  appBarSectionAccount: {
    display: 'inline-flex',
    height: '100%',
    alignItems: 'center',
    paddingRight: 42,
    position: 'relative',
    userSelect: 'none'
  },
  signOutButtonMobile: {
    fontSize: 16,
    marginTop: 10
  },
  accountDropdownRectangle: {
    position: 'absolute',
    right: 66,
    top: 41,
    zIndex: 1000
  },
  accountDropdownMenu: {
    position: 'absolute',
    right: 22,
    top: 50,
    minWidth: '210px',
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    background: '#FFFFFF',
    /* hover list item */
    boxShadow: '0px 2px 5px rgba(17, 24, 31, 0.3), 0px 0px 5px rgba(17, 24, 31, 0.1)',
    borderRadius: '3px'
  },
  dropDownLabel: {
    color: '#11181F',
    fontFamily: 'IBMPlexSans-Regular',
    fontSize: '16px',
    fontWeight: 500,
    letterSpacing: '0.7px',
    cursor: 'pointer'
  },
  dropDownUserName: {
    color: '#11181F',
    fontFamily: 'IBMPlexSans-Regular',
    fontSize: '16px',
    lineHeight: '25px',
    fontWeight: 700,
    letterSpacing: '0.7px',
    textTransform: 'capitalize',
    padding: '0 20px'
  },
  dropDownEmail: {
    color: '#8395A7',
    fontFamily: 'IBMPlexSans-Regular',
    fontSize: '12px',
    lineHeight: '11px',
    fontWeight: 400,
    textAlign: 'left',
    letterSpacing: '0.53px',
    textOverflow: 'ellipsis',
    width: '100%',
    overflow: 'hidden',
    marginBottom: '8px',
    padding: '0 20px'
  },
  dropDownDivider: {
    border: 0,
    borderTop: '1px solid #C8D6E5',
    height: 1,
    width: '100%',
    margin: 0
  },
  dropDownLink: {
    color: '#11181F',
    fontFamily: 'IBMPlexSans-Regular',
    fontSize: '16px',
    lineHeight: '44px',
    fontWeight: 500,
    letterSpacing: '0.7px',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    padding: '0 20px',
    '&.active-link': {
      fontWeight: 900
    },
    '&:hover': {
      backgroundColor: '#F5F5F5'
    }
  },
  dropDownAdminSignOutLink: {
    paddingLeft: '20px',
    color: '#2875C3',
    fontFamily: 'IBMPlexSans-Regular',
    fontSize: '16px',
    lineHeight: '25px',
    fontWeight: 700,
    letterSpacing: '0.7px',
    cursor: 'pointer'
  },
  appTitle: {
    fontFamily: 'IBMPlexSans-SemiBold',
    fontSize: '1.125rem',
    letterSpacing: '0.8px'
  },
  appLogo: {
    display: 'inline-flex',
    marginLeft: '25px',
    verticalAlign: 'middle',
    width: '212px',
    height: '30px'
  },
  openstallsLogo: {
    display: 'inline-flex',
    verticalAlign: 'middle',
    width: '150px',
    height: '33px'
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 12
  },
  userName: {
    paddingLeft: 12,
    fontSize: '16px',
    lineHeight: '25px',
    fontWeight: 400,
    textTransform: 'none'
  },
  dropDownArrow: {
    transform: 'translate(5px, 0)'
  },
  hide: {
    display: 'none'
  },
  menuChip: {
    color: 'white',
    borderColor: 'white',
    '& > *': {
      color: 'white'
    },
    '& > .MuiChip-icon': {
      marginLeft: 8
    },
    '& > .MuiChip-deleteIcon:hover': {
      color: 'white'
    }
  }
});

const AppHeader = ({ classes, showHamburger, drawerOpen, handleDrawerOpen, toggleAccountDropdown, showAccountDropdown, user, logoutUser }) => {
  const theme = useTheme();
  const matchesTabletDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const matchesMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  const dropDownShowStyles = { display: showAccountDropdown ? 'flex' : 'none' };
  const drawerOpenBarPaddingStyles = drawerOpen ? { marginLeft: 100 } : {};
  const brandingPaddingLeft = matchesMobile ? 25 : showHamburger ? 0 : 40;
  const accountSectionStyles = matchesMobile ? { paddingRight: 25 } : {};
  const hamburgerVisibilityStyles = showHamburger ? {} : { display: 'none' };
  const isRenter = user.role.name === USER_ROLES.RENTER;

  return (
    <AppBar
      position="fixed"
      className={classNames(classes.appBar, {
        [classes.appBarShift]: drawerOpen
      })}>
      <Toolbar disableGutters={true}>
        <div className={classes.appBarWrapper} style={drawerOpenBarPaddingStyles}>
          <div className={classes.appBarSectionBranding} style={{ paddingLeft: brandingPaddingLeft }}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={handleDrawerOpen}
              style={hamburgerVisibilityStyles}
              className={classNames(classes.menuButton, {
                [classes.hide]: drawerOpen
              })}>
              <Menu />
            </IconButton>
            <img src={OpenStallsLogo} alt="Open Stalls" className={classes.openstallsLogo} />
            {matchesTabletDesktop && <img src={Logo} alt="Rodeo Logistics Logo" className={classes.appLogo} />}
          </div>
          <div className={classes.appBarSectionAccount} data-testid="user-account" style={accountSectionStyles}>
            {matchesTabletDesktop && (
              <>
                {isRenter && (
                  <Chip
                    clickable
                    icon={<Menu />}
                    className={classes.menuChip}
                    onClick={toggleAccountDropdown}
                    onDelete={toggleAccountDropdown}
                    deleteIcon={<AccountCircle />}
                    variant="outlined"
                  />
                )}
                {!isRenter && (
                  <Button color="inherit" onClick={toggleAccountDropdown} data-testid="account-dropdown-button">
                    <AccountCircle />
                    <span className={classes.userName}>{userName}</span>
                    <ArrowDropDown className={classes.dropDownArrow} />
                  </Button>
                )}
              </>
            )}
            {matchesMobile && (
              <Button color="inherit" onClick={logoutUser} data-testid="sign-out-button-mobile" className={classes.signOutButtonMobile}>
                Sign Out
              </Button>
            )}
            <img src={accountDropdownRectangle} alt={'account-dropdown-down-arrow'} className={classes.accountDropdownRectangle} style={dropDownShowStyles} />
            <div className={classes.accountDropdownMenu} style={dropDownShowStyles}>
              <span className={classes.dropDownUserName} data-testid="account-dropdown-username">
                {userName}
              </span>
              <span className={classes.dropDownEmail} data-testid="account-dropdown-email">
                {user.email}
              </span>
              {isRenter && (
                <>
                  <NavLink data-testid={SUB_ROUTES.RENTER.EVENTS} to={SUB_ROUTES.RENTER.EVENTS} className={classes.dropDownLink} activeClassName="active-link">
                    Events
                  </NavLink>
                  <NavLink
                    data-testid={SUB_ROUTES.RENTER.RESERVATIONS}
                    to={SUB_ROUTES.RENTER.RESERVATIONS}
                    className={classes.dropDownLink}
                    activeClassName="active-link">
                    Reservations
                  </NavLink>
                  <hr className={classes.dropDownDivider} />
                  <NavLink data-testid={SUB_ROUTES.RENTER.HELP} to={SUB_ROUTES.RENTER.HELP} className={classes.dropDownLink} activeClassName="active-link">
                    Help
                  </NavLink>
                </>
              )}
              <span className={isRenter ? classes.dropDownLink : classes.dropDownAdminSignOutLink} data-testid="sign-out-button" onClick={logoutUser}>
                Sign Out
              </span>
            </div>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default compose(withStyles(styles, { withTheme: true }), withLogout, withUserContext)(AppHeader);

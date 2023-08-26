import React, { useState } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router';
import styled from 'styled-components';
import { CssBaseline } from '@material-ui/core';

import { SMALL_TABLET_WIDTH, BIG_TABLET_WIDTH } from '../../styles/Mixins';
import AppHeader from './AppHeader';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const RenterNavigationBase = props => {
  const theme = useTheme();
  const matchesTabletDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [showHamburger] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const { className } = props;

  const toggleAccountDropdown = () => {
    setShowAccountDropdown(!showAccountDropdown);
  };

  const hideAccountDropdown = () => {
    setShowAccountDropdown(false);
  };

  return (
    <div className={`${className}__root`}>
      <CssBaseline />
      {matchesTabletDesktop && (
        <AppHeader
          showHamburger={showHamburger}
          drawerOpen={false}
          handleDrawerOpen={() => {}}
          toggleAccountDropdown={toggleAccountDropdown}
          showAccountDropdown={showAccountDropdown}
        />
      )}
      <PageContainer onClick={hideAccountDropdown}>
        <div className={`${className}__pageContainerWrapper`}>{props.children}</div>
      </PageContainer>
    </div>
  );
};

const PageContainer = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
`;

const RenterNavigation = styled(RenterNavigationBase)`
  &__root {
    display: flex;
    flex-direction: column;
  }

  &__pageContainerWrapper {
    height: calc(100% - 100px);
  }

  @media screen and (min-width: ${SMALL_TABLET_WIDTH}) {
    &__toolbar {
      width: 100vw;
    }

    &__appLogoMobile {
      display: none;
    }

    &__appLogoDesktop {
      display: block;
      margin-left: 25px;
      width: 212px;
      height: 30px;
    }
  }

  @media screen and (min-width: ${BIG_TABLET_WIDTH}) {
    &__toolbar {
      width: 1215px;
    }
  }
`;
export default compose(withRouter)(RenterNavigation);

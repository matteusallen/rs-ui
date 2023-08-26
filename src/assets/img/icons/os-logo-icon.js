import React from 'react';
import { SvgIcon } from '@material-ui/core';
import { ReactComponent as OSLogo } from './os-logo.svg';

const OSLogoIcon = ({ className }) => {
  return <SvgIcon component={OSLogo} className={className} />;
};

export default OSLogoIcon;

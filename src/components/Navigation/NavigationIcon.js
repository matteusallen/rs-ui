//@flow
import React from 'react';
import { subRouteCodes as SUB_ROUTES } from '../../constants/routes';
import RentersGrey from '../../assets/img/renters-light-gray.svg';
import RentersWhite from '../../assets/img/renters-white.svg';
import HorseshoeWhiteIcon from '../../assets/img/icons/HorseshoeWhite.svg';
import HorseshoeGreyIcon from '../../assets/img/icons/HorseshoeGrey.svg';
import RvGreyIcon from '../../assets/img/icons/RvGrey.svg';
import RvWhiteIcon from '../../assets/img/icons/RvWhite.svg';
import GroupsWhiteIcon from '../../assets/img/icons/GroupsWhiteIcon.png';
import GroupsGreyIcon from '../../assets/img/icons/GroupsGreyIcon.png';
import ReportsWhiteIcon from '../../assets/img/icons/ReportsWhiteIcon.svg';
import ReportsGreyIcon from '../../assets/img/icons/ReportsGreyIcon.svg';

export type NavigationIconInputType = {|
  path: string,
  icon: number
|};

const NavigationIconComponent = (props: NavigationIconInputType) => {
  const { path, icon } = props;
  const renterIcon = path === SUB_ROUTES.ADMIN.USERS ? RentersWhite : RentersGrey;
  const rvIcon = path === SUB_ROUTES.OPS.RVS ? RvWhiteIcon : RvGreyIcon;
  const stallIcon = path === SUB_ROUTES.OPS.STALLS ? HorseshoeWhiteIcon : HorseshoeGreyIcon;
  const groupsIcon = path === SUB_ROUTES.ADMIN.GROUPS ? GroupsWhiteIcon : GroupsGreyIcon;
  const reportsIcon = path === SUB_ROUTES.ADMIN.REPORTS ? ReportsWhiteIcon : ReportsGreyIcon;

  switch (icon) {
    case 'renters':
      return <img src={renterIcon} alt="Renters Icon" />;
    case 'stalls':
      return <img src={stallIcon} alt="Stalls Icon" />;
    case 'rvs':
      return <img src={rvIcon} alt="Rv Icon" />;
    case 'groups':
      return <img src={groupsIcon} alt="Groups Icon" />;
    case 'reports':
      return <img src={reportsIcon} alt="Reports Icon" />;
    default:
      return <img src={null} alt="Invalid iconType" />;
  }
};

export default NavigationIconComponent;

//@flow
import React from 'react';
import { NavItem } from './NavItem';

type BreadcrumbsProps = {|
  displayStallsItem: boolean,
  displayRvsItem: boolean
|};

export const Breadcrumbs = ({ displayStallsItem, displayRvsItem }: BreadcrumbsProps) => (
  <div className={'breadcrumbs'}>
    <NavItem label={'BASIC DETAILS'} step={'details'} />
    {displayStallsItem && <NavItem label={'STALLS'} step={'stalls'} />}
    {displayRvsItem && <NavItem label={'RV SPOTS'} step={'rvs'} />}
  </div>
);

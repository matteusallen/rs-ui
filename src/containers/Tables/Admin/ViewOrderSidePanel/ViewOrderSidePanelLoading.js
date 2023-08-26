//@flow

import React from 'react';

import { SidePanelLayout as Layout } from './SidePanelLayout';
import IndeterminateLoading from '../../../../components/Loading/IndeterminateLoading';

export const ViewOrderSidePanelLoading = () => {
  return (
    <Layout>
      <div className="loading">
        <IndeterminateLoading />
      </div>
    </Layout>
  );
};

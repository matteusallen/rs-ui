import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import colors from '../../../../styles/Colors';
import { displayFlex } from '../../../../styles/Mixins';

import { subRouteCodes as SUB_ROUTES } from '../../../../constants/routes';

import AddButton from '../../../../components/Button/AddButton';
import ExportButton from '../../../../components/Button/ExportButton';
import { HeadingOne } from '../../../../components/Headings';

import ExportReportModal from './ExportReportModal';
import Snackbar from '../../../../components/Snackbar';

const ReservationTable = props => {
  const { className } = props;
  const [isExportModalOpen, setExportModalOpen] = useState(false);

  const openExportModalClicked = async () => {
    setExportModalOpen(true);
  };

  return (
    <>
      <FlexWrapper>
        <div className={`${className}__Page-Title`}>
          <HeadingOne className={`${className}__Header`} label="ORDERS" />
        </div>
        <div>
          <ExportButtonBase label={'EXPORT REPORT'} onClick={openExportModalClicked} />
          <CreateReservationLink to={SUB_ROUTES.ADMIN.CREATE_ORDER}>
            <AddButtonBase label={'CREATE ORDER'} />
          </CreateReservationLink>
        </div>
      </FlexWrapper>
      <ExportReportModal heading={'EXPORT TRANSACTION REPORT'} open={isExportModalOpen} close={() => setExportModalOpen(false)} />
      <Snackbar />
    </>
  );
};

const FlexWrapper = styled.div`
  ${displayFlex}
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const AddButtonBase = styled(AddButton)`
  &&& {
    width: 250px;
    margin-left: 20px;
  }
`;

const ExportButtonBase = styled(ExportButton)`
  &&& {
    background-color: ${colors.secondary.active};
  }
`;

const CreateReservationLink = styled(Link)`
  text-decoration: none;
`;

export default ReservationTable;

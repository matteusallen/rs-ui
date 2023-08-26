import React from 'react';
import ReportsList from './ReportsList';
import { HeadingOne } from 'Components/Headings';
import ContextSnackbar from 'Components/Snackbar';
import './css/AdminReports.scss';

const AdminReports: React.FC = () => {
  return (
    <div className="admin-reports">
      <ContextSnackbar />
      <div className="reports-header">
        <HeadingOne label="REPORTS" />
      </div>
      <ReportsList />
    </div>
  );
};

export default AdminReports;

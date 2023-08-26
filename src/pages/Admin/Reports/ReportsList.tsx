import React, { useState } from 'react';
import EventReportPreview from '../../../assets/img/reports/EventReport.png';
import ReconciliationPreview from '../../../assets/img/reports/Reconciliation.png';
import StallReportPreview from '../../../assets/img/reports/StallReport.png';
import RVReportPreview from '../../../assets/img/reports/RVReport.png';
import ReservationReportPreview from '../../../assets/img/reports/ReservationReport.png';
import AccountingReportPreview from '../../../assets/img/reports/AccountingReport.png';
import TransactionReportPreview from '../../../assets/img/reports/TransactionReport.png';
import { HeadingThree } from 'Components/Headings';
import { Report, REPORTS_BY_EVENT, REPORTS_HEADER } from 'Constants/reportType';
import TransReportModal from './TransReportModal';
import EventAndStallReport from './EventAndStallReportModal';

const ReportsList: React.FC = () => {
  const [reportType, setReportType] = useState('');

  const RenderReport = () => {
    if (!reportType) return <></>;
    const header = REPORTS_HEADER[reportType];

    if (isFilteredByEvent(reportType)) {
      return <EventAndStallReport isOpen handleClose={handleCloseModal} onCancel={handleCloseModal} header={header} reportType={reportType} />;
    }
    return <TransReportModal isOpen handleClose={handleCloseModal} onCancel={handleCloseModal} header={header} reportType={reportType} />;
  };

  const isFilteredByEvent = (reportType: string) => REPORTS_BY_EVENT.includes(reportType);

  const handleCloseModal = () => {
    setReportType('');
  };

  const financialReports = [
    {
      name: 'Transaction Report',
      img: TransactionReportPreview,
      testid: 'transaction-report',
      onClick: () => setReportType(Report.TRANSACTION)
    },
    {
      name: 'Accounting Report',
      img: AccountingReportPreview,
      testid: 'accounting-report',
      onClick: () => setReportType(Report.ACCOUNTING)
    },
    {
      name: 'Event Report',
      img: EventReportPreview,
      testid: 'event-report',
      onClick: () => setReportType(Report.EVENT)
    },
    {
      name: 'Reconciliation Report',
      img: ReconciliationPreview,
      testid: 'reconciliation-report',
      onClick: () => setReportType(Report.RECON)
    }
  ];
  const operationsReports = [
    {
      name: 'Stall & Add On Report',
      img: StallReportPreview,
      testid: 'stall-report',
      onClick: () => setReportType(Report.STALL)
    },
    {
      name: 'RV Report',
      img: RVReportPreview,
      testid: 'rv-report',
      onClick: () => setReportType(Report.RV)
    },
    {
      name: 'Reservation Report',
      img: ReservationReportPreview,
      testid: 'reservation-report',
      onClick: () => setReportType(Report.RESERVATION)
    }
  ];

  return (
    <div className="reports-list-container">
      <HeadingThree label="Financial Reports" />
      <div className="financial-reports">
        {financialReports.map(report => {
          const { onClick, name, testid, img } = report;
          return (
            <div key={report.name} className="reports" onClick={onClick}>
              <img src={img} alt={name} width="164px" height="208px" data-testid={testid} />
              <p>{name}</p>
              <span>Financial Reports</span>
            </div>
          );
        })}
        <RenderReport />
      </div>
      <HeadingThree label="Operations Reports" />
      <div className="operations-reports">
        {operationsReports.map(report => {
          const { onClick, name, testid, img } = report;
          return (
            <div key={report.name} className="reports" onClick={onClick}>
              <img src={img} alt={name} width="164px" height="208px" data-testid={testid} />
              <p>{name}</p>
              <span>Operations Reports</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportsList;

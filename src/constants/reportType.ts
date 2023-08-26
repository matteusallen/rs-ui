export const Report = {
  RECON: 'reconciliation',
  ACCOUNTING: 'accounting',
  EVENT: 'events-report',
  TRANSACTION: 'transaction',
  STALL: 'stalls-report',
  RV: 'rv-report',
  RESERVATION: 'reservation'
};

export const REPORTS_BY_EVENT = [Report.STALL, Report.RV, Report.EVENT];

export const REPORTS_HEADER = {
  [Report.RECON]: 'Reconciliation Report',
  [Report.ACCOUNTING]: 'Accounting Report',
  [Report.EVENT]: 'Event Report',
  [Report.TRANSACTION]: 'Transaction Report',
  [Report.STALL]: 'Stall & Add On Report',
  [Report.RV]: 'RV Report',
  [Report.RESERVATION]: 'Reservation Report'
};

export type ReportType = 'reconciliation' | 'event' | 'accounting' | 'transaction';

import React from 'react';
import WarningIcon from '@material-ui/icons/Warning';
import './BackDateWarning.scss';

const BackDateWarning: React.FC<any> = () => (
  <div className="back-date-warning">
    <WarningIcon />
    Reservation includes a past date
  </div>
);

export default BackDateWarning;

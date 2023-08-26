import React from 'react';

import PdfViewer from '../components/PdfViewer';

const EndUser = () => {
  return (
    <PdfViewer
      documentTitle="Rodeo Logistics – Website End User Agreement"
      documentUrl={'https://open-stalls.s3.us-east-2.amazonaws.com/docs/agreements/rodeo-logistics-end-user-agreement.pdf'}
      titleSize={41}
    />
  );
};

export default EndUser;

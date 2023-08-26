import React from 'react';

import PdfViewer from '../components/PdfViewer';

const Terms = () => {
  return (
    <PdfViewer
      documentTitle="Rodeo Logistics – Website Terms of Use"
      documentUrl={'https://open-stalls.s3.us-east-2.amazonaws.com/docs/agreements/rodeo-logistics-website-terms-of-use.pdf'}
      titleSize={41}
    />
  );
};

export default Terms;

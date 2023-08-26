import React from 'react';

import PdfViewer from '../components/PdfViewer';

const Privacy = () => {
  return (
    <PdfViewer
      documentTitle="Rodeo Logistics – Privacy Policy"
      documentUrl={'https://open-stalls.s3.us-east-2.amazonaws.com/docs/agreements/rodeo-logistics-privacy-policy.pdf'}
      titleSize={41}
    />
  );
};

export default Privacy;

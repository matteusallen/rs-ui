//@flow
import React, { useContext, useEffect, useState } from 'react';
import WarningModal from '../../../../components/WarningModal/WarningModal';
import { useFormikContext } from 'formik';
import { restAPI } from '../../../../lib/api';
import type { SnackbarContextActionsType } from '../../../../store/SnackbarContext';
import { SnackbarContext } from '../../../../store/SnackbarContext';

const uploadAgreement = async (file: File, venueId: string) => {
  const formData = new FormData();
  formData.append('venueId', venueId);
  formData.append('name', file.name);
  formData.append('description', 'Venue Agreement');
  formData.append('documentType', '1');
  formData.append('document', file);

  const response = await restAPI({
    path: 'admin/venue-agreement',
    method: 'POST',
    body: formData,
    cType: 'multipart/form-data'
  });

  return response;
};

type AgreementType = {
  description: string,
  id: string | number,
  url: string,
  name: string
};

type VenueAgreementUploadPropsType = {|
  reloadAgreements: () => void,
  venueId: string,
  agreements: AgreementType[]
|};

export const VenueAgreementUpload = ({ agreements, reloadAgreements, venueId }: VenueAgreementUploadPropsType) => {
  const [file, setFile] = useState<null | File>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [overwrite, setOverwrite] = useState<boolean>(false);
  const { showSnackbar } = useContext<SnackbarContextActionsType>(SnackbarContext);
  const { setFieldValue } = useFormikContext();
  const agreementNamesList = agreements?.map((file: AgreementType) => file.name);

  const handleSetFile = e => {
    const file = e.currentTarget.files && e.currentTarget.files[0];
    if (file?.type !== 'application/pdf') {
      showSnackbar('File type must be PDF', { error: true });
    } else setFile(e.currentTarget.files && e.currentTarget.files[0]);
  };

  const handleModalCancel = () => {
    setFile(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (file) {
      if (agreementNamesList.includes(file.name) && !overwrite) setIsModalOpen(true);
      else {
        showSnackbar('Uploading file...', { error: false, duration: 5000 });
        uploadAgreement(file, venueId).then(response => {
          showSnackbar(response.success ? 'File uploaded successfully' : 'File uploaded failed', { error: !response.success });
          if (response.success) {
            reloadAgreements();
            setFieldValue('venueAgreement', response.document?.id || response.document[0]?.id);
          }
          setFile(null);
          setOverwrite(false);
        });
      }
    }
  }, [JSON.stringify(file), overwrite]);

  return (
    <div className={'upload-venue-agreement'}>
      <WarningModal
        isOpen={isModalOpen}
        handleClose={handleModalCancel}
        onCancel={handleModalCancel}
        continueLabel="REPLACE"
        header="ARE YOU SURE?"
        text={`${file?.name || ''} already exists. Do you want to replace it? Replacing it will overwrite its current contents.`}
        onContinue={() => {
          setOverwrite(true);
          setIsModalOpen(false);
        }}
      />
      or{' '}
      <label htmlFor="venue-agreement-file">
        upload new agreement
        <input onChange={e => handleSetFile(e)} value="" accept="application/pdf" className="agreement-input" id="venue-agreement-file" multiple type="file" />
      </label>
    </div>
  );
};

import React, { useContext, useEffect, useState } from 'react';
import { restAPI } from '../../../../lib/api';
import { SnackbarContextActionsType } from '../../../../store/SnackbarContext';
import { useFormikContext } from 'formik';
import { SnackbarContext } from '../../../../store/SnackbarContext';
import WarningModal from '../../../../components/WarningModal/WarningModal';

type MapType = {
  description: string;
  id: string | number;
  url: string;
  name: string;
};

const uploadMap = async (file: File, venueId: string) => {
  const formData = new FormData();
  formData.append('venueId', venueId);
  formData.append('name', `${file.name}`);
  formData.append('description', 'Venue Map');
  formData.append('documentType', '2');
  formData.append('document', file);

  const response = await restAPI({
    path: 'admin/venue-map',
    method: 'POST',
    body: formData,
    cType: 'multipart/form-data'
  });
  return response;
};

type VenueMapUploadPropsType = {
  reloadMaps: () => void;
  venueId: string;
  maps: MapType[];
};

export const VenueMapUpload: React.FC<VenueMapUploadPropsType> = ({ reloadMaps, venueId, maps }) => {
  const [file, setFile] = useState<null | File>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [overwrite, setOverwrite] = useState<boolean>(false);
  const { showSnackbar } = useContext<SnackbarContextActionsType>(SnackbarContext);
  const mapNamesList = maps?.map((file: MapType) => file.name);
  const { setFieldValue } = useFormikContext();

  const handleSetFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files && e.currentTarget.files[0];
    if (file?.type !== 'application/pdf') {
      showSnackbar('File type must be PDF', { error: true });
    } else {
      setFile(e.currentTarget.files && e.currentTarget.files[0]);
    }
  };
  useEffect(() => {
    if (file) {
      if (mapNamesList.includes(file.name) && !overwrite) setIsModalOpen(true);
      else {
        showSnackbar('Uploading file...', { error: false, duration: 5000 });
        uploadMap(file, venueId).then(response => {
          showSnackbar(response.success ? 'File uploaded successfully' : 'File uploaded failed', { error: !response.success });
          if (response.success) {
            reloadMaps();
            setFieldValue('venueMap', response.document?.id || response.document[0]?.id);
          }
          setFile(null);
          setOverwrite(false);
        });
      }
    }
  }, [JSON.stringify(file), overwrite]);

  const handleModalCancel = () => {
    setFile(null);
    setIsModalOpen(false);
  };

  return (
    <div className={'upload-venue-agreement'}>
      <WarningModal
        isOpen={isModalOpen}
        handleClose={handleModalCancel}
        onCancel={handleModalCancel}
        continueLabel="REPLACE"
        header="ARE YOU SURE?"
        text={`${file?.name} already exists. Do you want to replace it? Replacing it will overwrite its current contents.`}
        onContinue={() => {
          setOverwrite(true);
          setIsModalOpen(false);
        }}
      />
      or{' '}
      <label htmlFor="venue-map-file">
        upload new map
        <div style={{ display: 'none' }}>
          <input onChange={e => handleSetFile(e)} value="" accept="application/pdf" className="map-input" id="venue-map-file" multiple type="file" />
        </div>
      </label>
    </div>
  );
};

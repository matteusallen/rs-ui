//@flow
import React from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';

import Button from '../../../../components/Button';
import type { EventFormType } from '../Form';

type EditAndSaveButtonPropType = {|
  className: string
|};

const EditAndSaveBase = ({ className }: EditAndSaveButtonPropType) => {
  const { setFieldValue, submitForm } = useFormikContext<EventFormType>();

  const { isSubmitting, isValid } = useFormikContext<EventFormType>();

  const editClickHandler = e => {
    e.preventDefault();
    setFieldValue('step', 'details');
  };

  return (
    <div className={`${className} edit-and-save`}>
      <Button secondary className="edit" onClick={editClickHandler}>
        Edit
      </Button>
      <Button primary className="save" onClick={async () => await submitForm()} isLoading={isSubmitting} disabled={isSubmitting || !isValid}>
        Save
      </Button>
    </div>
  );
};

const EditAndSave = styled(EditAndSaveBase)`
  & {
    display: inline-flex;

    .edit {
      margin-right: 20px;
    }
  }
`;

export default EditAndSave;

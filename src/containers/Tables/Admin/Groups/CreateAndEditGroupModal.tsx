import React, { useEffect, useContext } from 'react';
import Modal from '../../../../components/Modal';
import * as Yup from 'yup';
import { useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import { CreateGroupModalInterface, CreateGroupType } from './types';
import CREATE_GROUP from '../../../../mutations/CreateGroup';
import UPDATE_GROUP from '../../../../mutations/UpdateGroup';
import CreateGroupModalForm from './CreateGroupModalForm';
import { SnackbarContext } from '../../../../store/SnackbarContext';
import { GROUP_BY_ID } from '../../../../queries/Admin/GetGroupById';
import { SnackbarContextActionsType } from '../../../../store/SnackbarContext';
import { GROUPS_TABLE } from '../../../../queries/Admin/GroupsTable';
import { mapFormToCreateGroupInput, mapFormToUpdateGroupInput } from './mapFormToCreateGroupInput';
import './CreateAndEditGroupModal.scss';

const CreateGroupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Group name is required'),
  contactName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Contact name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  phone: Yup.string()
    .length(10, 'Enter a valid phone number')
    .required('Phone is required')
});

const CreateAndEditGroupModal: React.FC<CreateGroupModalInterface> = ({ isOpen, onClose, isEdit, group }) => {
  const [createGroup, { data, loading, called, error }] = useMutation(CREATE_GROUP);
  const [updateGroup, { data: updateData, loading: updateLoading, called: updateCalled, error: updateError }] = useMutation(UPDATE_GROUP);
  const { showSnackbar } = useContext<SnackbarContextActionsType>(SnackbarContext);

  const initialValues: CreateGroupType = {
    name: group?.name || '',
    contactName: group?.contactName || '',
    email: group?.email || '',
    phone: group?.phone?.replaceAll('-', '') || '',
    groupLeaderId: group?.groupLeaderId || null
  };

  useEffect(() => {
    if (data || updateData) {
      showSnackbar(`Group ${isEdit ? 'updated' : 'created'} successfully`, {
        error: false,
        duration: 5000
      });
      onClose();
    } else if (error || updateError) {
      showSnackbar(error?.message?.replace('GraphQL error: ', '') || `Unable to ${isEdit ? 'update' : 'create'} group`, { error: true, duration: 5000 });
    }
  }, [data, updateData, updateError, error]);

  return (
    <Modal className="create-group-modal" heading={`${isEdit ? 'EDIT' : 'CREATE'} GROUP`} onClose={onClose} open={isOpen} data-testid="create-group-modal">
      <Formik
        initialValues={initialValues}
        onSubmit={async values => {
          if (isEdit) {
            await updateGroup({
              variables: { input: mapFormToUpdateGroupInput(values, group?.id) },
              refetchQueries: [
                {
                  query: GROUPS_TABLE
                },
                {
                  query: GROUP_BY_ID,
                  variables: { id: group?.id }
                }
              ]
            });
          } else {
            await createGroup({
              variables: { input: mapFormToCreateGroupInput(values) },
              refetchQueries: [
                {
                  query: GROUPS_TABLE
                }
              ]
            });
          }
        }}
        validationSchema={CreateGroupSchema}>
        <CreateGroupModalForm isLoading={(loading && called) || (updateLoading && updateCalled)} onClose={onClose} />
      </Formik>
    </Modal>
  );
};

export default CreateAndEditGroupModal;

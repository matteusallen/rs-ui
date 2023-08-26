import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { Grid } from '@material-ui/core';
import { Field, Form, useFormikContext } from 'formik';
import { FormikField, FormikPhoneField } from '../../../../components/Fields';
import { FormSelect } from '../../../../components/Select';
import Button from '../../../../components/Button';
import { CreateGroupFormInterface } from './types';
import './CreateAndEditGroupModal.scss';
import { HeadingFive } from 'Components/Headings';
import { GROUP_LEADERS } from '../../../../queries/GroupLeader/GroupsTable';

interface GroupLeader {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

const CreateGroupModalForm: React.FC<CreateGroupFormInterface> = ({ isLoading, onClose }) => {
  const { values, setFieldValue, isSubmitting, errors }: any = useFormikContext();
  const [selectedGroupLeader, setSelectedGroupLeader] = useState('');
  const [groupLeaders, setGroupLeaders] = useState([]);

  const [getGroupLeaders, { data }] = useLazyQuery(GROUP_LEADERS);

  useEffect(() => {
    if (data && data.groupLeaders) {
      setGroupLeaders(
        data.groupLeaders.map(({ firstName, lastName, id }: GroupLeader) => ({
          label: `${firstName} ${lastName}`,
          value: id
        }))
      );
    }
  }, [data]);

  useEffect(() => {
    if (values && values.groupLeaderId) {
      getGroupLeaders();
    }
  }, [values]);

  useEffect(() => {
    if (data && data.groupLeaders) {
      const [groupLeaderSelected] = data.groupLeaders.filter((groupLeader: GroupLeader) => groupLeader.id === selectedGroupLeader);

      setFieldValue('contactName', `${groupLeaderSelected.firstName} ${groupLeaderSelected.lastName}`);
      setFieldValue('email', groupLeaderSelected.email);
      setFieldValue('phone', groupLeaderSelected.phone);
    }
  }, [selectedGroupLeader]);

  const hasFormErrors = () => {
    if (Object.keys(errors).length > 0) return true;
    return false;
  };

  return (
    <Form>
      <div className="section-header">
        <HeadingFive label="GROUP INFORMATION" />
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Field autoComplete="none" label="GROUP NAME" type="text" name="name" variant="filled" component={FormikField} />
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Field name="groupLeaderId" autoComplete="none">
            {({ field, meta }: any) => (
              <FormSelect
                {...field}
                {...meta}
                onFocus={() => groupLeaders.length === 0 && getGroupLeaders()}
                selectedOption={selectedGroupLeader || values.groupLeaderId}
                label="GROUP LEADER"
                cb={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue('groupLeaderId', e.target.value);
                  setSelectedGroupLeader(e.target.value);
                }}
                className={`group-leader-select ${selectedGroupLeader ? 'filled' : ''}`}
                options={groupLeaders}
                dataTestName="group-leader-list"
              />
            )}
          </Field>
        </Grid>
      </Grid>
      <div className="section-header">
        <HeadingFive label="CONTACT INFORMATION" />
      </div>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Field autoComplete="none" label="PRIMARY CONTACT NAME" type="text" name="contactName" variant="filled" component={FormikField} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Field autoComplete="none" label="EMAIL ADDRESS" type="email" name="email" variant="filled" component={FormikField} />
        </Grid>
        <Grid item xs={6}>
          <Field name="phone" autoComplete="none">
            {({ field, meta }: any) => (
              <FormikPhoneField
                {...field}
                {...meta}
                autoComplete="none"
                error={meta.touched && !!meta.error}
                helperText={meta.touched && !!meta.error && meta.error}
                touched={`${meta.touched}`}
                label="PHONE NUMBER"
                variant="filled"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue('phone', e.target.value.replace(/[^0-9]/g, ''))}
              />
            )}
          </Field>
        </Grid>
      </Grid>
      <div className="flex-button-wrapper">
        <Button className="form-button" secondary variant="contained" size="small" onClick={onClose} data-testid="create-group-cancel">
          CANCEL
        </Button>
        <Button
          className="form-button"
          primary
          onClick={() => setFieldValue('isSubmitting', true)}
          variant="contained"
          size="small"
          type="submit"
          disabled={isSubmitting || isLoading || hasFormErrors()}
          data-testid="create-group-save">
          SAVE
        </Button>
      </div>
    </Form>
  );
};

export default CreateGroupModalForm;

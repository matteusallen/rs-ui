// @flow
import React from 'react';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { HeadingFive } from 'Components/Headings';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { SimpleSelect } from '../components/Select';
import { FormikField, FormikPhoneField } from '../components/Fields';
import { displayFlex } from '../styles/Mixins';
import withUpsertUser from '../mutations/UpsertUser';
import colors from '../styles/Colors';
import type { UserType } from './Admin/Users';

type RenterFormPropsType = {|
  // $FlowIgnore
  adminUser: AdminUserType,
  className: string,
  heading: string,
  onClose: () => void,
  open: boolean,
  selectedUser: UserType,
  upsertUser: (input: {}) => void,
  user: UserType,
  userRoles: { userRoles: { id: string }[] }
|};

export const RenterFormBase = (props: RenterFormPropsType) => {
  const { className, upsertUser, adminUser, userRoles, user, open, heading, onClose } = props;

  const submitUser = values => {
    const id = user.id || '';
    const { email, firstName, lastName, phone, role } = values;
    const { id: venueId } = adminUser.venues[0];
    upsertUser({
      id,
      email: email.toLowerCase(),
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      phone,
      roleId: role,
      venueId
    });
  };

  const getRole = () => {
    if (user && user.role) {
      return user.role.id;
    } else if (userRoles) {
      return userRoles.userRoles[0].id;
    } else {
      return null;
    }
  };

  const initialValues = {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone ? user.phone.replace(/[^\d]/g, '') : '',
    role: getRole()
  };

  const hasErrors = errors => {
    if (errors.firstName || errors.lastName || errors.email || errors.phone) return true;
    return false;
  };

  const CreateUserSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('First name is required'),
    lastName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Last name is required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    role: Yup.string().required('Required'),
    phone: Yup.string()
      .matches('^[0-9]+$', 'Enter a valid phone number')
      .length(10, 'Enter a valid phone number')
      .required('Phone number is required')
  });
  return (
    <Modal heading={heading} open={open}>
      <Formik className={className} onSubmit={values => submitUser(values)} initialValues={initialValues} validationSchema={CreateUserSchema}>
        {formik => (
          <Form>
            <HeadingFive label="USER INFORMATION" />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Field label="FIRST NAME" type="text" name="firstName" variant="filled" component={FormikField} />
              </Grid>
              <Grid item xs={6}>
                <Field label="LAST NAME" type="text" name="lastName" variant="filled" component={FormikField} />
              </Grid>
            </Grid>
            <HeadingFive label="CONTACT INFORMATION" />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Field label="EMAIL" type="email" name="email" variant="filled" component={FormikField} />
              </Grid>
              <Grid item xs={6}>
                <Field name="phone">
                  {({ field, meta }) => (
                    <FormikPhoneField
                      {...field}
                      {...meta}
                      error={meta.touched && meta.error}
                      helperText={meta.touched && !!meta.error && meta.error}
                      label="PHONE NUMBER"
                      autoComplete="renterPhone"
                      variant="filled"
                      onChange={e => formik.setFieldValue('phone', e.target.value.replace(/[^0-9]/g, ''))}
                    />
                  )}
                </Field>
              </Grid>
            </Grid>
            <HeadingFive label="USER TYPE" />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <SelectStyled
                  name="role"
                  cb={e => formik.setFieldValue('role', e.target.value)}
                  onBlur={() => formik.setFieldTouched('role', true)}
                  value={formik.values.role}
                  component={SimpleSelect}
                  options={userRoles}
                />
              </Grid>
            </Grid>
            <FlexButtonWrapper>
              <FormButton secondary variant="contained" size="large" onClick={onClose}>
                CANCEL
              </FormButton>
              <FormButton primary variant="contained" size="large" type="submit" disabled={hasErrors(formik.errors)}>
                SAVE
              </FormButton>
            </FlexButtonWrapper>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const RenterFormModal = styled(RenterFormBase)`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-around;
`;

const SelectStyled = styled(Field)`
  &&& {
    width: 250px;
    .MuiFormLabel-root {
      z-index: 1;
      font-size: 1rem;
      letter-spacing: normal;
      transform: translate(12px, 20px) scale(1);
      &.MuiInputLabel-shrink {
        transform: translate(12px, 10px) scale(0.75);
      }
    }
    .MuiInputBase-root {
      margin-top: 0;
      background-color: ${colors.background.primary};
      border-bottom: 1px solid ${colors.border.primary}
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      transition: background-color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms
      .MuiSelect-root {
        height: 1.1875em;
        padding: 27px 12px 10px;
        font-size: 16px;
        letter-spacing: normal;
      }
      &:hover {
        background-color: ${colors.background.secondary};
        border-bottom: 1px solid ${colors.border.primary_hover}
      }
    }
  }
`;

const FlexWrapper = styled.div`
  ${displayFlex}
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  &:first-child {
    margin: 0 0 30px 0;
  }
  &__field {
    width: 250px;
  }
  @media screen and (max-width: 601px) {
    ${displayFlex}
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    &:first-child {
      margin: 0 0 30px 0;
    }
  }
`;

const FlexButtonWrapper = styled(FlexWrapper)`
  ${displayFlex}
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  margin: 42px 0 0;
  @media screen and (max-width: 601px) {
    ${displayFlex}
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 20px 0 0;
  }
`;

const FormButton = styled(Button)`
  &&& {
    line-height: 0;
    width: 100px;
    margin-left: ${props => (props.primary ? 20 : 0)}px;
  }
`;

export default withUpsertUser(RenterFormModal);

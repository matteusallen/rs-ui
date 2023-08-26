// @flow
import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import { useLazyQuery } from '@apollo/react-hooks';
import { useFormikContext, Field } from 'formik';
import { HeadingFour } from '../../../../components/Headings';
import { FormikField, FormikPhoneField, TextField } from '../../../../components/Fields';
import { USERS_BY_EMAIL_FOR_CREATE_ORDER } from '../../../../queries/Admin/UsersByEmailForCreateOrder';
import colors from '../../../../styles/Colors';
import UserSearchList from './UserSearchList';

const RenterInformationBase = ({ className }) => {
  const { setFieldTouched, setFieldValue, values } = useFormikContext();

  const { renterInformation, reservationEdit } = values;
  const { id, email } = renterInformation;
  const [autoFiller, setAutoFiller] = useState(false);
  const [userListVisible, setUserListVisible] = useState(false);
  const [tab, setTab] = useState<number | null>(null);

  const [getUsersByEmail, { data: groupData = {}, loading: groupLoading }] = useLazyQuery(USERS_BY_EMAIL_FOR_CREATE_ORDER);
  const users = groupData.users || [];
  const maxTab = users.length - 1;

  useEffect(() => {
    const emailMatch = users.find(u => u.email === email);
    if (autoFiller && emailMatch) {
      setAutoFiller(false);
      setUser(emailMatch);
    }
  }, [users, autoFiller]);

  const onChangeEmail = e => {
    if (!userListVisible && !reservationEdit) setUserListVisible(true);
    const email = e.target.value || '';
    if (!email) setUserListVisible(false);
    setFieldValue('renterInformation.email', email.toLowerCase().trim());
    getUsersByEmail({
      variables: {
        orderBy: ['email', 'ASC'],
        filterBy: { email, roleId: 3 },
        limit: 10
      }
    });
  };

  const setUser = user => {
    setFieldValue('ccInformation.selectedCard', null);
    setFieldValue('ccInformation.selectedCardBrand', null);
    setFieldValue('ccInformation.country', null);
    const { id, firstName, lastName, email, phone, savedCreditCards } = user;
    setFieldValue('renterInformation', {
      id,
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      phone: phone || '',
      savedCreditCards: savedCreditCards || []
    });
    setUserListVisible(false);
  };

  const clearUser = () => {
    setUserListVisible(false);
    setFieldValue('renterInformation', {
      id: null,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      savedCreditCards: []
    });
  };

  const emailOnBlur = () => {
    setAutoFiller(true);
    setFieldTouched('renterInformation.email', true);
    setTimeout(() => setUserListVisible(false), 200);
  };

  const handleEmailKeyPress = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        return setTab(tab === null || tab === maxTab ? 0 : tab + 1);

      case 'ArrowUp':
        event.preventDefault();
        return setTab(tab === null || tab === 0 ? maxTab : tab - 1);

      case 'Tab':
        event.preventDefault();
        return setTab(tab === null || tab === maxTab ? 0 : tab + 1);

      case 'Enter': {
        event.preventDefault();
        const user = users[tab || 0];
        if (user) setUser(user);
        setTab(0);
        break;
      }

      default:
        return setTab(null);
    }
  };

  return (
    <div className={className}>
      <HeadingFour label={'Renter Information'} />
      <p className={`${className}__subheading`}>Enter email to search existing renters</p>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Field component={FormikField} name={'renterInformation.email'}>
            {({ field, meta }) => {
              return (
                <TextField
                  {...field}
                  {...meta}
                  autoComplete="none"
                  name="renterInformation.email"
                  className={`${className}__user-list-parent ${className}__field`}
                  disabled={reservationEdit}
                  error={!userListVisible && meta.touched && meta.error}
                  helperText={!userListVisible && meta.touched && !!meta.error && meta.error}
                  label="EMAIL"
                  onBlur={emailOnBlur}
                  onKeyDown={handleEmailKeyPress}
                  onChange={id ? () => clearUser() : onChangeEmail}
                  type="text"
                  variant="filled"
                />
              );
            }}
          </Field>
          <UserSearchList className={className} users={users} setUser={setUser} visible={userListVisible} tab={tab} />
        </Grid>
        <Grid item xs={6}>
          <Field name="renterInformation.phone">
            {({ field, meta }) => (
              <FormikPhoneField
                {...field}
                {...meta}
                error={meta.touched && meta.error}
                helperText={meta.touched && !!meta.error && meta.error}
                label="PHONE NUMBER"
                variant="filled"
                onChange={e => setFieldValue('renterInformation.phone', e.target.value.replace(/[^0-9]/g, ''))}
                className={`${className}__field`}
                disabled={reservationEdit || groupLoading}
              />
            )}
          </Field>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Field
            component={FormikField}
            className={`${className}__field ${className}__name__field`}
            label="FIRST NAME"
            type="text"
            variant="filled"
            name="renterInformation.firstName"
            disabled={reservationEdit || groupLoading}
          />
        </Grid>
        <Grid item xs={6}>
          <Field
            component={FormikField}
            className={`${className}__field ${className}__name__field`}
            label="LAST NAME"
            type="text"
            variant="filled"
            name="renterInformation.lastName"
            disabled={reservationEdit || groupLoading}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const RenterInformation = styled(RenterInformationBase)`
  &__user-list-parent {
    &&& {
      margin-bottom: 0;
      position: relative;
    }
  }
  &__user-list-item {
    align-items: center;
    display: flex;
    font-family: 'IBMPlexSans-Regular';
    height: 35px;
    margin: 0;
    padding-left: 10px;
    &:hover,
    &.active {
      background-color: ${colors.primary};
      cursor: pointer;
    }
  }
  &__user-list-container {
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    position: absolute;
    z-index: 10;
    width: 315px;
  }
  &__subheading {
    margin: 0;
  }
  &__field {
    &&&& {
      margin-bottom: 0;
    }
  }
  &__name__field {
    input {
      text-transform: capitalize;
    }
  }
`;

export default RenterInformation;

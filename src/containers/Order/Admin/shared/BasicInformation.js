// @flow
import React from 'react';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import { useFormikContext } from 'formik';
import FormCard from '../../../../components/Cards/FormCard';
import { Separator } from '../../../../components/Separator';
import { formatPhoneNumber } from '../../../../helpers';
import EventSelection from './EventSelection';
import RenterInformation from './RenterInformation';
import { HeadingThree } from 'Components/Headings';
import _upperFirst from 'Utils/upperFirst';

const BasicInformationBase = ({ adminUser, className, order }) => {
  const { values } = useFormikContext();
  const { reservationEdit } = values;
  const { event, user, group } = order || {};

  const getBasicTitle = () => {
    if (reservationEdit && user) {
      return <HeadingThree label={`${_upperFirst(user.firstName)} ${_upperFirst(user.lastName)}${group ? ` | ${_upperFirst(group.name)}` : ''}`} />;
    }

    return <HeadingThree label="Basic Information" />;
  };

  return (
    <FormCard className={className} dataTestId="basic_info">
      <div className={`${className}__basic_info--title`}>{getBasicTitle()}</div>
      <Separator margin="0.625rem 0 1.375rem" />
      {reservationEdit ? (
        <Grid container justify="space-between">
          <div item container className={`${className}__section`} md={4}>
            <span className={`${className}__section-subheader`}>Email</span>
            <p className={`${className}__renter-email`}>{user.email}</p>
          </div>
          <div item container className={`${className}__section`} md={4}>
            <span className={`${className}__section-subheader`}>Phone</span>
            <p className={`${className}__renter-phone`}>{formatPhoneNumber(user.phone)}</p>
          </div>
          <div item container className={`${className}__section ${className}__event__section`} md={4}>
            <span className={`${className}__section-subheader`}>Event</span>
            <p className={`${className}__event-name`}>{event.name}</p>
          </div>
        </Grid>
      ) : (
        <>
          <RenterInformation />
          <Separator />
          <EventSelection user={adminUser} />
        </>
      )}
    </FormCard>
  );
};

const BasicInformation = styled(BasicInformationBase)`
  &&& {
    padding: 20px;
  }

  &__basic_info--title {
    font-size: 25px;
    line-height: 25px;
    margin: 0;
    white-space: nowrap;

    h3 {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__section {
    height: 100%;
    flex: 1;
  }

  &__section:not(:last-child) {
    padding-right: 10px;
  }

  &__event__section {
    min-width: 0;

    p {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__section-subheader {
    width: 100%;
    display: block;
    font-family: 'IBMPlexSans-SemiBold';
    font-size: 18px;
    letter-spacing: 0.79px;
    line-height: 23px;
  }

  &__renter-name,
  &__renter-email,
  &__renter-phone,
  &__event-name {
    width: 100%;
    margin: 0;
  }

  &__renter-name {
    text-transform: capitalize;
  }
`;

export default BasicInformation;

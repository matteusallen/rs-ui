import React from 'react';
import styled from 'styled-components';
import { Field, useFormikContext } from 'formik';

import FormCard from '../../../../components/Cards/FormCard';
import { FormikField, FormikPhoneField } from '../../../../components/Fields';

import { HeadingTwo } from '../../../../components/Headings';
import { displayFlex, SMALL_TABLET_WIDTH } from '../../../../styles/Mixins';
import colors from '../../../../styles/Colors';
import { Notice } from '../../../../components/Alerts';
import { getSMSTextLabel } from './ReservationConfirm';

const RenterInformationBase = ({ className }) => {
  const { setFieldValue, values } = useFormikContext();
  return (
    <FormCard className={className} dataTestId="renter_information">
      <HeadingTwo label={`Renter Information`} />
      <span className={`${className}__card-subheader`}>Changes to this information will be reflected on all of your existing reservations.</span>
      <div className={`${className}__names-container`}>
        <Field
          component={FormikField}
          label="FIRST NAME"
          name="renterInformation.firstName"
          autoComplete="firstName"
          className={`${className}__name-field`}
          type="text"
          variant="filled"
          required
        />
        <Field
          component={FormikField}
          label="LAST NAME"
          name="renterInformation.lastName"
          autoComplete="lastName"
          className={`${className}__base-margin-left ${className}__name-field`}
          type="text"
          variant="filled"
          required
        />
      </div>
      <div className={`${className}__names-container`}>
        <Field name="renterInformation.phone">
          {({ field, meta }) => (
            <FormikPhoneField
              {...field}
              {...meta}
              error={meta.touched && meta.error}
              helperText={meta.touched && !!meta.error && meta.error}
              label="MOBILE NUMBER"
              autoComplete="phone"
              variant="filled"
              onChange={e => setFieldValue('renterInformation.phone', e.target.value.replace(/[^0-9]/g, ''))}
              className={`${className}__name-field`}
              required
            />
          )}
        </Field>
        <div className={`${className}__base-margin-left ${className}__name-field`}>
          <Notice
            label={getSMSTextLabel({
              hasStalls: !!values.stallProductId,
              hasRvs: !!values.rvProductId
            })}
          />
        </div>
      </div>
    </FormCard>
  );
};

const RenterInformation = styled(RenterInformationBase)`
  &__names-container {
    display: inherit;
  }
  &__name-field {
    input {
      color: #11181f;
      font-family: 'IBMPlexSans-Regular';
      font-size: 15px;
      text-transform: uppercase;
    }
    .Mui-error {
      color: ${colors.error.primary};
      font-family: 'IBMPlexSans-Regular';
      font-size: 12px;
      padding-left: 12px;
      text-transform: uppercase;
      white-space: nowrap;
    }
    width: 100%;
  }
  &__base-margin-left {
    && {
      margin-left: inherit;
    }
  }
  &__card-subheader {
    display: none;
  }

  @media screen and (min-width: ${SMALL_TABLET_WIDTH}) {
    &__names-container {
      ${displayFlex}
    }

    &__name-field {
      width: 50%;
    }

    &__base-margin-left {
      && {
        margin-left: 25px;
      }
    }

    &__card-subheader {
      display: block;
      color: ${colors.text.secondary};
      font-family: 'IBMPlexSans-Regular';
      font-size: 16px;
    }
  }
`;

export default RenterInformation;

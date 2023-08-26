import React from 'react';
import styled from 'styled-components';

import { CardContent, Button, Checkbox } from '@material-ui/core';

import { Link } from 'react-router-dom';

import FormHero from '../../components/Forms/FormHero';

import { BIG_TABLET_WIDTH } from 'Styles/Mixins';
import colors from '../../styles/Colors';
import { PasswordField } from '../../components/Fields';
import PasswordRequirements from 'Components/Forms/PasswordRequirements';

// type PasswordRequirementsPropsType = {|
//   hasEightCharacters: boolean,
//   hasOneLowercase: boolean,
//   hasOneNumber: boolean,
//   hasOneUppercase: boolean,
//   passwordFieldBlurred: boolean
// |};
//
// type FormikPropsType = {|
//   errors: object,
//   getFieldProps: (key: string) => object,
//   handleSubmit: (e: Event) => void,
//   touched: object,
//   values: object
// |};
//
// type CreatePasswordViewPropsType = {|
//   className: string,
//   description: string,
//   formik: FormikPropsType,
//   passwordRequirements: PasswordRequirementsPropsType
// |};

const CreatePasswordViewBase = props => {
  const { className, description, passwordRequirements, formik } = props;

  return (
    <div className={`${className}__create-password-container`}>
      <FormHero description={description} />
      <CardContent className={`${className}__form-section`}>
        <form onSubmit={formik.handleSubmit}>
          <h2>WELCOME</h2>
          <p>Create a password to finish setting up your Open Stalls account</p>
          {formik.touched.checkedTermsAndConditions && formik.errors.checkedTermsAndConditions && (
            <p className={`${className}__error-message e2e-error-message`}>{formik.errors.checkedTermsAndConditions}</p>
          )}

          <div className={`${className}__password-field`}>
            <PasswordField label="Password" {...formik.getFieldProps('password')} />
          </div>
          <div className={`${className}__password-requirements`}>
            <PasswordRequirements {...passwordRequirements} passwordFieldBlurred={formik.touched.password} />
          </div>

          <div className={`${className}__terms-section`}>
            <Checkbox className={`${className}__checkbox`} color={colors.text.link} {...formik.getFieldProps('checkedTermsAndConditions')} />
            <p>
              I have read and accept the
              <Link to="/terms"> Terms of Use </Link>
              and
              <Link to="/privacy"> Privacy Policy </Link>
            </p>
          </div>
          <Button primary="true" variant="contained" size="large" className={`${className}__submit-button`} type="submit">
            SUBMIT
          </Button>
        </form>
      </CardContent>
    </div>
  );
};

const CreatePasswordView = styled(CreatePasswordViewBase)`
  &__create-password-container {
    box-shadow: 0 2px 5px 0 rgba(17, 24, 31, 0.3), 0 2px 10px 0 rgba(17, 24, 31, 0.1);
    border-radius: 0;
    font-size: 16px;
    font-family: 'IBMPlexSans-Regular';
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: auto;
  }

  &__error-message {
    background-color: #ee5253;
    border-radius: 3px;
    color: white;
    font-size: 14px;
    padding: 12px 10px 11px 10px;
    margin: 0 0 10px 0 !important;
  }

  &__password-requirements {
    font-size: 16px;
  }

  &__password-field {
    width: 100%;
  }

  &__terms-section {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin: 5px 0 10px 0;
  }

  &__checkbox {
    color: ${colors.text.link} !important;
  }

  &__checkbox:hover,
  &__checkbox:active {
    background-color: none !important;
  }

  &__submit-button {
    align-self: center;
    width: 100%;
    font-size: 16px !important;
    margin: 0 0 25px 0 !important;
    color: ${colors.white} !important;
    background-color: ${colors.button.primary.active} !important;
  }

  &__form-section {
    flex: 1;
    align-self: flex-start;
    padding: 0 !important;
    height: 100%;
    margin: auto;
    form {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      height: 100%;
      padding: 0 18px;

      h2 {
        font-family: 'IBMPlexSans-SemiBold';
        margin: 35px 0 0 0;
        letter-spacing: 1px;
        font-size: 1.875rem;
      }
      p {
        text-align: left;
        padding: 12px 10px 11px 10px;
        margin: 5px 0 20px 0;
        line-height: 1.5;
      }
    }
  }

  @media screen and (min-width: ${BIG_TABLET_WIDTH}) {
    &__create-password-container {
      display: flex;
      flex-direction: row;
      width: 100vw;
      max-width: 800px;
      height: 635px;
      left: 50%;
      top: 50%;
      position: absolute;
      -webkit-transform: translate3d(-50%, -50%, 0);
      -moz-transform: translate3d(-50%, -50%, 0);
      transform: translate3d(-50%, -50%, 0);
      background-color: white;
    }

    &__form-section {
      flex: 1;
      align-self: flex-start;

      form {
        padding: 20px 25px;

        h2 {
          margin: 0 0 10px 0;
          padding: 15px 0 0 0;
        }

        p {
          margin: 0;
          padding-right: 25px;
        }
      }
    }

    &__password-field {
      margin: 0 0 15px 0;
    }

    &__terms-section {
      margin: 20px 0 0 0;
    }

    &__submit-button {
      align-self: center;
      padding: 0 0 15px 0;
      margin: 15px 0 0 0 !important;
    }
  }
`;

export default CreatePasswordView;

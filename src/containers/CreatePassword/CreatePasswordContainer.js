import React, { useState } from 'react';

import * as Yup from 'yup';

import { useFormik } from 'formik';

import CreatePasswordView from './CreatePasswordView';
import CreatePasswordSuccess from './CreatePasswordSuccess';
import { LOGIN_REGISTER_DESCRIPTION } from 'Constants/names';
import { TERMS_CONDITIONS_ERROR } from 'Constants/errors';
import { ONE_NUMBER, ONE_UPPERCASE, ONE_LOWERCASE, EIGHT_CHARACTERS } from 'Constants/regExes';
import withCreatePassword from 'Mutations/CreatePassword';

// type CreatePasswordContainerPropsType = {|
//   createPassword: (input: CreatePasswordInputType) => CreatePasswordReturnType,
//   token: string
// |};

const CreatePasswordContainer = props => {
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: '',
      checkedTermsAndConditions: false
    },
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .required()
        .min(8)
        .matches(ONE_NUMBER)
        .matches(ONE_UPPERCASE)
        .matches(ONE_LOWERCASE),
      checkedTermsAndConditions: Yup.bool().oneOf([true], TERMS_CONDITIONS_ERROR)
    }),
    onSubmit: async values => {
      const { token } = props;
      const { password } = values;
      const response = await props.createPassword({
        password,
        token
      });

      const {
        data: {
          createPassword: { success }
        }
      } = response;
      setPasswordChangeSuccess(success);
    }
  });

  const { password } = formik.values;

  const hasOneNumber = !!password.match(ONE_NUMBER);
  const hasOneUppercase = !!password.match(ONE_UPPERCASE);
  const hasOneLowercase = !!password.match(ONE_LOWERCASE);
  const hasEightCharacters = !!password.match(EIGHT_CHARACTERS);

  return passwordChangeSuccess ? (
    <CreatePasswordSuccess />
  ) : (
    <CreatePasswordView
      description={LOGIN_REGISTER_DESCRIPTION}
      formik={formik}
      passwordRequirements={{
        hasOneNumber,
        hasOneUppercase,
        hasOneLowercase,
        hasEightCharacters
      }}
    />
  );
};

export default withCreatePassword(CreatePasswordContainer);

import React, { useState, ChangeEvent, SyntheticEvent } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import SIGN_UP from 'Mutations/SignUp';
import withLogin from 'Mutations/Login';
import InputPassword from 'Components/Fields/InputPassword';
import OSTooltip from 'Components/Tooltip/OSTooltip';
import SignUpFormTerms from 'Pages/SignUp/SignUpForm/SignUpFormTerms';
import PasswordRequirements from 'Components/Forms/PasswordRequirements';
import store, { SignUpStorePropNameType } from 'Pages/SignUp/SignUpStore';
import { getErrorMessage } from 'Pages/SignUp/SignUpForm/signUpFormHelpers';
import { formatPhoneNumber } from 'Utils/stringHelpers';
import './SignUpForm.scss';

type MobileStepType = 'name' | 'phone' | 'credentials';

interface ITouchedState {
  firstName: boolean;
  lastName: boolean;
  phone: boolean;
  email: boolean;
  password: boolean;
}

const toolTipTitles = {
  name: 'This is the name that will show on your reservations.',
  phone: (
    <>
      <span style={{ display: 'flex' }}>We use this number to text you stall and</span>
      <span style={{ display: 'flex' }}>RV spot assignments during the event.</span>
    </>
  ),
  email: (
    <>
      <span style={{ display: 'flex' }}>You will use this email and password</span>
      <span style={{ display: 'flex' }}>to log in to your account.</span>
    </>
  )
};

export const SignUpForm: React.FC<any> = ({ loginUser }) => {
  const [isTouched, setIsTouched] = useState<ITouchedState>({
    firstName: false,
    lastName: false,
    phone: false,
    email: false,
    password: false
  });
  const [termsAndConditionsChecked, setTermsAndConditionsChecked] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [mobileStep, setMobileStep] = useState<MobileStepType>('name');
  const isMobile = useMediaQuery('(max-width:959px)');

  const serializedData = store.toJSON;
  const { email, password, firstName, lastName, phone } = serializedData;
  const [signUp] = useMutation(SIGN_UP, {
    variables: { input: { email, password, firstName, lastName, phone } },
    onCompleted: async ({ register, error }) => {
      if (!register?.error) {
        await loginUser({ email, password });
        store.reset();
      } else if (register.error) {
        setSignUpError(register.error);
        throw new Error(register.error.message);
      } else if (error) {
        throw new Error(error.message);
      }
    }
  });

  const handleBlur: Function = (fieldName: SignUpStorePropNameType) => {
    setIsTouched({
      ...isTouched,
      [fieldName]: true
    });
  };

  const onNext: Function = (step: MobileStepType) => {
    if (step === 'name' && !store.errors.firstName && !store.errors.lastName) {
      setMobileStep('phone');
    } else if (step === 'phone' && !store.errors.phone) {
      setMobileStep('credentials');
    }
  };

  const onBack: Function = (step: MobileStepType) => {
    if (step === 'credentials') {
      setMobileStep('phone');
    } else if (step === 'phone') {
      setMobileStep('name');
    }
  };

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    const formIsValidated =
      !store.errors.firstName && !store.errors.lastName && !store.errors.phone && !store.errors.email && !store.errors.password && termsAndConditionsChecked;
    if (formIsValidated) {
      signUp().catch(err => {
        console.error('Error in Renter SignUp flow:', err);
      });
    }
  };

  const showSignUpButton = !isMobile ? true : mobileStep === 'credentials';
  const showTermAndConditionsError = !termsAndConditionsChecked && attemptedSubmit && (!isMobile || (isMobile && mobileStep === 'credentials'));

  const FirstName: JSX.Element = (
    <TextField
      id="first-name"
      label="First Name"
      variant="filled"
      className="first-name"
      defaultValue={store.firstName}
      data-testid="first-name"
      error={isTouched.firstName && store.errors.firstName}
      helperText={isTouched.firstName && store.errors.firstName ? getErrorMessage('firstName') : ''}
      onBlur={() => handleBlur('firstName')}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        store.setProp('firstName', e.target.value);
      }}
    />
  );

  const LastName: JSX.Element = (
    <TextField
      id="last-name"
      label="Last Name"
      variant="filled"
      className="last-name"
      defaultValue={store.lastName}
      data-testid="last-name"
      error={isTouched.lastName && store.errors.lastName}
      helperText={isTouched.lastName && store.errors.lastName ? getErrorMessage('lastName') : ''}
      onBlur={() => handleBlur('lastName')}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        store.setProp('lastName', e.target.value);
      }}
    />
  );

  return (
    <div className="sign-up-form">
      <div className="sign-up-form-wrapper">
        <form autoComplete="off">
          <div className="form-inputs">
            {isMobile && mobileStep !== 'name' && (
              <div className="back-button-wrapper">
                <Button className="back" onClick={() => onBack(mobileStep)}>
                  <ArrowBackIosIcon /> Back
                </Button>
              </div>
            )}
            <h2>Create Account</h2>
            {showTermAndConditionsError && (
              <div className="terms-and-conditions-error">
                You must please read and accept the "Terms of Use", "Privacy Policy" and "End User Agreement" before proceeding
              </div>
            )}
            {signUpError && <div className="sign-up-error">{signUpError || ''}</div>}
            {isMobile ? (
              mobileStep === 'name' && (
                <>
                  <p className="step-description">{toolTipTitles.name}</p>
                  <div className="sign-up-input-row">{FirstName}</div>
                  <div className="sign-up-input-row">{LastName}</div>
                </>
              )
            ) : (
              <div className="sign-up-input-row">
                <OSTooltip arrow title={toolTipTitles.name} placement="left">
                  {FirstName}
                </OSTooltip>
                {LastName}
              </div>
            )}
            {((isMobile && mobileStep === 'phone') || !isMobile) && (
              <>
                {isMobile && <p className="step-description">{toolTipTitles.phone}</p>}
                <div className="sign-up-input-row">
                  <OSTooltip title={toolTipTitles.phone} arrow placement="left">
                    <TextField
                      id="phone"
                      label="Phone Number"
                      variant="filled"
                      value={store.phone}
                      data-testid="phone"
                      error={isTouched.phone && store.errors.phone}
                      helperText={isTouched.phone && store.errors.phone ? getErrorMessage('phone') : ''}
                      onBlur={() => handleBlur('phone')}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        store.setProp('phone', formatPhoneNumber(e.target.value));
                      }}
                    />
                  </OSTooltip>
                </div>
              </>
            )}
            {((isMobile && mobileStep === 'credentials') || !isMobile) && (
              <>
                <div className="sign-up-input-row">
                  <OSTooltip title={toolTipTitles.email} arrow placement="left">
                    <TextField
                      id="email"
                      label="Email"
                      variant="filled"
                      defaultValue={store.email}
                      autoComplete="off"
                      data-testid="email"
                      error={isTouched.email && store.errors.email}
                      helperText={isTouched.email && store.errors.email ? getErrorMessage('email') : ''}
                      onBlur={() => handleBlur('email')}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        store.setProp('email', e.target.value);
                      }}
                    />
                  </OSTooltip>
                </div>
                <div className="sign-up-input-row">
                  <InputPassword
                    id="password"
                    label="Password"
                    variant="filled"
                    defaultValue={store.password}
                    data-testid="password"
                    autoComplete="new-password"
                    error={isTouched.password && store.errors.password}
                    helperText={isTouched.password && store.errors.password ? getErrorMessage('password') : ''}
                    onBlur={() => handleBlur('password')}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      store.setProp('password', e.target.value);
                    }}
                  />
                </div>
                <PasswordRequirements
                  hasOneNumber={store.errors.passwordDetails.hasOneNumber}
                  hasOneUppercase={store.errors.passwordDetails.hasOneUppercase}
                  hasOneLowercase={store.errors.passwordDetails.hasOneLowercase}
                  hasEightCharacters={store.errors.passwordDetails.hasEightCharacters}
                  passwordFieldBlurred={isTouched.password}
                />
                <SignUpFormTerms setTermsAndConditionsChecked={setTermsAndConditionsChecked} />
              </>
            )}
          </div>
          <div className="form-footer">
            {isMobile && (mobileStep === 'name' || mobileStep === 'phone') && (
              <Button variant="contained" className="next" data-testid="sign-up-next" onClick={() => onNext(mobileStep)}>
                Next
              </Button>
            )}
            {showSignUpButton && (
              <Button type="submit" variant="contained" data-testid="sign-up-submit" onClick={onSubmit}>
                Sign Up
              </Button>
            )}
            <p className="sign-in-text">
              Have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default compose(withLogin, observer)(SignUpForm);

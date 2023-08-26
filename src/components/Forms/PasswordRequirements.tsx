import React from 'react';
import CheckIcon from '@material-ui/icons/Check';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import colors from '../../styles/Colors';
import './PasswordRequirements.scss';

type IPasswordRequirementsProps = {
  hasEightCharacters: boolean;
  hasOneLowercase: boolean;
  hasOneNumber: boolean;
  hasOneUppercase: boolean;
  passwordFieldBlurred: boolean;
};

const PasswordRequirements: React.FC<IPasswordRequirementsProps> = ({
  hasOneNumber,
  hasOneUppercase,
  hasOneLowercase,
  hasEightCharacters,
  passwordFieldBlurred
}) => {
  const eightCharError = passwordFieldBlurred && !hasEightCharacters;
  const lowercaseError = passwordFieldBlurred && !hasOneLowercase;
  const uppercaseError = passwordFieldBlurred && !hasOneUppercase;
  const numberError = passwordFieldBlurred && !hasOneNumber;

  const ListBullet = () => <span className="list-bullet">•</span>;

  return (
    <div className="password-requirements">
      <span>Passwords must:</span>
      <ul className="requirements-list">
        <li>
          {!passwordFieldBlurred && !hasEightCharacters ? (
            <ListBullet />
          ) : eightCharError ? (
            <ErrorOutlineIcon color="error" />
          ) : (
            <CheckIcon htmlColor={colors.button.primary.active} />
          )}{' '}
          <span className={eightCharError ? 'error-text' : ''}>Be a minimum of 8 characters</span>
        </li>
        <li>
          {!passwordFieldBlurred && !hasOneLowercase ? (
            <ListBullet />
          ) : lowercaseError ? (
            <ErrorOutlineIcon color="error" />
          ) : (
            <CheckIcon htmlColor={colors.button.primary.active} />
          )}{' '}
          <span className={lowercaseError ? 'error-text' : ''}>Include at least one lowercase letter (a-z)</span>
        </li>
        <li>
          {!passwordFieldBlurred && !hasOneUppercase ? (
            <ListBullet />
          ) : uppercaseError ? (
            <ErrorOutlineIcon color="error" />
          ) : (
            <CheckIcon htmlColor={colors.button.primary.active} />
          )}{' '}
          <span className={uppercaseError ? 'error-text' : ''}>Include at least one uppercase letter (A-Z)</span>
        </li>
        <li>
          {!passwordFieldBlurred && !hasOneNumber ? (
            <ListBullet />
          ) : numberError ? (
            <ErrorOutlineIcon color="error" />
          ) : (
            <CheckIcon htmlColor={colors.button.primary.active} />
          )}{' '}
          <span className={numberError ? 'error-text' : ''}>Include at least one number (0-9)</span>
        </li>
      </ul>
    </div>
  );
};

export default PasswordRequirements;

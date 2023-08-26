// @flow
import React from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { withRouter, RouteComponentProps } from 'react-router';

import CreatePasswordContainer from '../containers/CreatePassword/CreatePasswordContainer';
import { RESET_PASSWORD_TOKEN_EXPIRED_CHECK } from '../queries/ResetPasswordTokenExpiredCheck';

type CreatePasswordPropsType = {|
  className: string,
  ...RouteComponentProps
|};

const CreatePasswordBase = (props: CreatePasswordPropsType) => {
  const { className } = props;

  const { location } = props;
  const urlParams = new URLSearchParams(location.search);

  const token = urlParams.get('token');

  const { data, error } = useQuery(RESET_PASSWORD_TOKEN_EXPIRED_CHECK, {
    variables: { token }
  });

  if (!token || error) {
    return <Redirect to="/login" />;
  }

  if (data && data.checkResetPasswordTokenExpired.expired) {
    return <Redirect to="/forgot-password?expired=true" />;
  }

  return (
    <div className={`${className}__create-password e2e-create-password`}>
      <CreatePasswordContainer token={token} />
    </div>
  );
};

const CreatePassword = styled(CreatePasswordBase)`
  &_create-password {
    width: 100%;
  }
`;

export default withRouter(CreatePassword);

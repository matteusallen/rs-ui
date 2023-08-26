import React from 'react';
import userEvent from '@testing-library/user-event';

import { clearConsoleNoise, renderWithApollo } from '../../lib/testing-tools';

import { FORGOT_PASSWORD_MOCK_SUCCESS, FORGOT_PASSWORD_MOCK_FAILURE } from '../../mutations/__mocks__/FORGOT_PASSWORD_MOCK';
import ForgotPassword from '../ForgotPassword';

jest.mock('../../assets/img/rodeo-logistics-logo-dark.png');
jest.mock('../assets/img/rodeo-logistics-logo-dark.png');

clearConsoleNoise();

describe('ForgotPassword page', () => {
  const renderComponent = mocks => renderWithApollo(<ForgotPassword />, mocks);

  it('renders without error', async () => {
    // Set up
    const result = renderComponent(FORGOT_PASSWORD_MOCK_SUCCESS);

    // Act
    const { getByTestId } = result;
    const emailField = await getByTestId('emailInput');
    const emailInput = emailField.children[1].children[0];

    //Assert
    expect(result).toBeDefined();
    expect(emailField).toBeDefined();
    expect(emailInput).toBeDefined();
  });

  it('Should call mutation and display email sent message to user', async () => {
    // Set up
    const result = renderComponent(FORGOT_PASSWORD_MOCK_SUCCESS);
    const { getByTestId, getByText, findByText } = result;
    const emailField = await getByTestId('emailInput');
    const emailInput = emailField.children[1].children[0];
    const submitButton = await getByText('SUBMIT');

    // Act
    emailInput.focus();
    await userEvent.type(emailInput, 'dev@mail.com');
    await submitButton.click();

    //Assert
    const emailSentFeedback = await findByText('REQUEST SUBMITTED');
    expect(emailSentFeedback).toBeDefined();
  });

  it('Should display a success message even if the mutation returns an error', async () => {
    // Set up
    const result = await renderComponent(FORGOT_PASSWORD_MOCK_FAILURE);
    const { getByTestId, getByText, findByText } = result;

    const emailField = await getByTestId('emailInput');
    const emailInput = emailField.children[1].children[0];
    const submitButton = await getByText('SUBMIT');

    // Act
    emailInput.focus();
    await userEvent.type(emailInput, 'dev@mail.com');
    await submitButton.click();

    //Assert
    const emailSentFeedback = await findByText('REQUEST SUBMITTED');
    expect(emailSentFeedback).toBeDefined();
  });
});

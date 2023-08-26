// @flow
import * as React from 'react';
import * as rtl from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';
import AdditiveInput from '../AdditiveInput';
import type { AdditiveInputType } from '../AdditiveInput';

describe('AdditiveInput component tests', () => {
  let defaultProps: AdditiveInputType;

  beforeEach(() => {
    defaultProps = {
      allowZero: false,
      className: '',
      disabled: false,
      error: null,
      id: 'addOns.0',
      initialValue: 10,
      label: 'Some label',
      onBlur: jest.fn,
      onChange: jest.fn,
      onValueChange: jest.fn,
      value: 10
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const renderComponent = (props = defaultProps) => rtl.render(<AdditiveInput {...props} />);

  it('should render the AdditiveInput component', async () => {
    // Setup

    // Act
    const result = renderComponent();

    // Assert
    expect(result).not.toBeNull();
    const { findByTestId } = result;
    const outerDivId = await findByTestId('addOns.0-additive-input-container');
    expect(outerDivId).toBeDefined();

    const minusButton = await findByTestId('addOns.0-additive-input-minus');
    expect(minusButton).toBeDefined();

    const textFieldWrapper = await findByTestId('addOns.0-additive-input-field');
    expect(textFieldWrapper).toBeDefined();

    const plusButton = await findByTestId('addOns.0-additive-input-plus');
    expect(plusButton).toBeDefined();
  });

  it('should display the initial value', async () => {
    // Setup
    defaultProps.value = 99;
    defaultProps.initialValue = 99;

    // Act
    const result = renderComponent(defaultProps);

    // Assert
    const { findByTestId } = result;
    const textFieldWrapper = await findByTestId('addOns.0-additive-input-field');
    expect(textFieldWrapper).toBeDefined();

    expect(textFieldWrapper.children[1].children[0].value).toEqual('99');
  });

  it('should display zero as initial value if allowZero is true', async () => {
    // Setup
    defaultProps.value = 0;
    defaultProps.allowZero = true;

    // Act
    const result = renderComponent(defaultProps);

    // Assert
    const { findByTestId } = result;
    const textFieldWrapper = await findByTestId('addOns.0-additive-input-field');
    expect(textFieldWrapper).toBeDefined();

    expect(textFieldWrapper.children[1].children[0].value).toEqual('0');
  });

  it('should display an external error message', async () => {
    // Setup
    defaultProps.error = 'My error message';

    // Act
    const result = renderComponent(defaultProps);

    // Assert
    const { findByText, findByTestId } = result;
    const message = await findByText('My error message');
    expect(message).toBeDefined();

    const inputField = await findByTestId('addOns.0-additive-input-field');
    const errorParagraph = inputField.children[2]?.innerHTML;
    expect(errorParagraph).toEqual('My error message');
  });

  it('should increment the value', async () => {
    // Setup
    const result = renderComponent(defaultProps);
    const { findByTestId } = result;
    const textFieldWrapper = await findByTestId('addOns.0-additive-input-field');
    const plusButton = await findByTestId('addOns.0-additive-input-plus');

    // Act
    expect(textFieldWrapper.children[1].children[0].value).toEqual('10');
    plusButton.click();

    // Assert
    expect(textFieldWrapper.children[1].children[0].value).toEqual('11');
  });

  it('should NOT decrement the value below 0', async () => {
    // Setup
    defaultProps.initialValue = 0;
    defaultProps.value = 0;

    const result = renderComponent(defaultProps);
    const { findByTestId } = result;
    const textFieldWrapper = await findByTestId('addOns.0-additive-input-field');
    const minusButton = await findByTestId('addOns.0-additive-input-minus');

    // Act
    expect(textFieldWrapper.children[1].children[0].value).toEqual('0');
    minusButton.click();

    // Assert
    expect(textFieldWrapper.children[1].children[0].value).toEqual('0');

    const inputField = await findByTestId('addOns.0-additive-input-field');
    const errorParagraph = inputField.children[2]?.innerHTML;
    expect(errorParagraph).toEqual(undefined);
  });

  it('should decrement the value if valid', async () => {
    // Setup
    defaultProps.value = 12;
    defaultProps.initialValue = 10;

    const result = renderComponent(defaultProps);
    const { findByTestId } = result;
    const textFieldWrapper = await findByTestId('addOns.0-additive-input-field');
    const minusButton = await findByTestId('addOns.0-additive-input-minus');

    // Act
    expect(textFieldWrapper.children[1].children[0].value).toEqual('12');
    minusButton.click();

    // Assert
    expect(textFieldWrapper.children[1].children[0].value).toEqual('11');

    const inputField = await findByTestId('addOns.0-additive-input-field');
    const errorParagraph = inputField.children[2];
    expect(errorParagraph).not.toBeDefined();
  });
});

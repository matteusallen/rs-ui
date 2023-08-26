// @flow
import * as React from 'react';
import * as rtl from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import ReviewAndSaveButton from '../ReviewAndSaveButton';
import type { ReviewAndSaveButtonPropsType } from '../ReviewAndSaveButton';

describe('<ReviewAndSaveButton />', () => {
  let defaultProps: ReviewAndSaveButtonPropsType;

  beforeEach(() => {
    defaultProps = {
      disabled: false,
      onClick: () => null
    };
  });

  const renderComponent = (props = defaultProps) => rtl.render(<ReviewAndSaveButton {...props} />);

  it('should render a Review & Save button that is enabled', async () => {
    // act
    const { container, getByTestId, findByText } = renderComponent();

    // assert
    expect(getByTestId('review-and-save-button')).toBeInTheDocument();
    expect(await findByText('REVIEW & SAVE')).toBeInTheDocument();
    await rtl.wait(() => {
      expect(container.querySelector('.Mui-disabled')).not.toBeInTheDocument();
    });
  });

  it('should render a Review & Save button that is disabled', async () => {
    // act
    const { container } = renderComponent({
      disabled: true,
      onClick: () => null
    });

    // assert
    await rtl.wait(() => {
      expect(container.querySelector('.Mui-disabled')).toBeInTheDocument();
    });
  });

  it('should call the provided onClick function handler of Review & Save', () => {
    // arrange
    const myClickHandler = jest.fn();

    // act
    const { getByTestId } = renderComponent({
      disabled: false,
      onClick: myClickHandler
    });
    const button = getByTestId('review-and-save-button');
    rtl.fireEvent.click(button);

    // assert
    expect(myClickHandler).toHaveBeenCalled();
  });
});

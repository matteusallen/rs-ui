// @flow
import React from 'react';

import styled from 'styled-components';

import Button from '../../../../components/Button';

export type ReviewAndSaveButtonPropsType = {|
  disabled: boolean,
  // eslint-disable-next-line flowtype/no-weak-types
  onClick: () => void | any
|};

const ReviewAndSaveButton = ({ disabled, onClick }: ReviewAndSaveButtonPropsType) => (
  <ReviewAndSaveButtonBase data-testid="review-and-save-button" primary variant="contained" size="large" disabled={disabled} onClick={onClick}>
    REVIEW &amp; SAVE
  </ReviewAndSaveButtonBase>
);

const ReviewAndSaveButtonBase = styled(Button)`
  &&& {
    width: auto;
    margin-left: 20px;
    letter-spacing: 0.7px;
    line-height: normal;
  }
`;

export default ReviewAndSaveButton;

// @flow
import React from 'react';
import styled from 'styled-components';

import { SMALL_TABLET_WIDTH } from '../../styles/Mixins';

import Button from './index';

type BookButtonPropsType = {|
  className: string,
  dataTestId: string,
  label: string,
  onClick: () => void
|};

const BookButtonBase = (props: BookButtonPropsType) => (
  <Button data-testid={props.dataTestId} primary className={props.className} onClick={props.onClick}>
    {props.label}
  </Button>
);

const BookButton = styled(BookButtonBase)`
  &&& {
    height: 46px;
    width: 200px;
    border-radius: 3px
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.16), 0 2px 5px 0 rgba(0,0,0,0.26);
    align-self: flex-end;
    padding-top: 6px;

    @media screen and (max-width: ${SMALL_TABLET_WIDTH}) {
        width: 100%;
      }
  }
  .plus-icon {
    padding-right: 10px;
  }
`;

export default BookButton;

// @flow
import React from 'react';
import styled from 'styled-components';
import Add from '@material-ui/icons/Add';

import Button from './index';

type AddButtonPropsType = {|
  className: string,
  label: string,
  onClick: () => void
|};

const AddButtonBase = (props: AddButtonPropsType) => (
  <Button primary className={props.className} onClick={props.onClick} data-testid="add-button">
    <Add />
    {props.label}
  </Button>
);

const AddButton = styled(AddButtonBase)`
  &&& {
    height: 36px;
    width: 172px;
    border-radius: 3px
    margin: 20px 0 25px;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.16), 0 2px 5px 0 rgba(0,0,0,0.26);
    align-self: flex-end;
  }
  .plus-icon {
    padding-right: 10px;
  }
`;

export default AddButton;

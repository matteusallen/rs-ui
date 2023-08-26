import React from 'react';
import { IconButton } from '@material-ui/core';
import './IncrementerIcon.scss';
import styled from 'styled-components';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const IncrementerIcon = ({ increment, decrement, top, right, plus, minus }) => {
  return (
    <Incrementer className="quantity-incrementer-wrapper" top={top} right={right}>
      <IconButton onClick={increment} data-testid={plus || 'increase-qty'}>
        <KeyboardArrowUpIcon fontSize="small" viewBox="6 6 12 12" />
      </IconButton>
      <IconButton onClick={decrement} data-testid={minus || 'decrease-qty'}>
        <KeyboardArrowDownIcon fontSize="small" viewBox="6 6 12 12" />
      </IconButton>
    </Incrementer>
  );
};

const Incrementer = styled.div`
  &&& {
    top: ${props => (props.top ? props.top + 'px' : 0)};
    right: ${props => (props.right ? props.right + 'px' : 0)};
  }
`;

export default IncrementerIcon;

// @flow
import React from 'react';
import styled from 'styled-components';
import Card from '@material-ui/core/Card';

type FormCardPropsType = {|
  children: Array<Node>,
  className: string,
  dataTestId?: string,
  style?: void
|};

const FormCardBase = (props: FormCardPropsType) => {
  return (
    <Card style={props.style} className={`${props.className}`} data-testid={`${props.dataTestId || ''}`}>
      {props.children}
    </Card>
  );
};

const FormCard = styled(FormCardBase)`
  &&& {
    width: 100%;
    margin: 0 0 20px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(17, 24, 31, 0.1), 0 2px 5px rgba(17, 24, 31, 0.3);
    border-radius: 0;
    text-align: left;
    overflow: visible;
  }
`;

export default FormCard;

//@flow
import React from 'react';
import { useFormikContext } from 'formik';
import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import Card from '@material-ui/core/Card';
import styled from 'styled-components';

import { emptyStallCard } from '../Form';
import type { EventFormType } from '../Form';
import colors from '../../../../styles/Colors';

type AddRateCardType = {|
  className: string,
  disabled: boolean
|};

const AddRateCardBase = ({ className, disabled }: AddRateCardType) => {
  const {
    values: { stalls, hasStalls },
    setFieldValue
  } = useFormikContext<EventFormType>();

  const newRate = event => {
    event.preventDefault();
    setFieldValue('stalls', [...stalls, JSON.parse(JSON.stringify(emptyStallCard))]);
  };

  const addRateIconStyles = { transform: 'translate(0px, 5px)' };
  const addRateTextStyles = {
    fontFamily: 'IBMPlexSans-Bold, Roboto, Helvetica, Arial, sans-serif',
    fontSize: 16,
    letterSpacing: 0.7
  };

  return (
    <Card className={`${className} ${disabled ? 'disabled' : ''}`}>
      <Button onClick={newRate} style={{ color: colors.secondary }} disabled={!hasStalls}>
        <h3 style={{ margin: 5, padding: 5 }}>
          <Add style={addRateIconStyles} /> <span style={addRateTextStyles}>ADD ANOTHER RATE</span>
        </h3>
      </Button>
    </Card>
  );
};

const AddRateCard = styled(AddRateCardBase)`
  &&& {
    width: 100%;
    margin: 20px 0 0 0;
    padding: 0;
    box-shadow: 0 2px 10px rgba(17, 24, 31, 0.1), 0 2px 5px rgba(17, 24, 31, 0.3);
    border-radius: 0;
    text-align: center;
    overflow: visible;

    &.disabled {
      margin-top: -25px;
      opacity: 0.3;
    }

    button {
      width: 100%;
    }
  }
`;

export default AddRateCard;

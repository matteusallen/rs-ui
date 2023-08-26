//@flow
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Visibility from '@material-ui/icons/Visibility';

import type { AddOnType } from '../../../../queries/Admin/CreateEvent/VenueAddOns';
import Button from '../../../../components/Button';
import type { EventFormType } from '../Form';
import { AddOnItem } from './AddOnItem';

type AddOnRowsPropsType = {|
  addOns: AddOnType[]
|};

export const AddOnRows = ({ addOns = [] }: AddOnRowsPropsType) => {
  const { values, setFieldValue } = useFormikContext<EventFormType>();
  const [maxRows] = useState<number>(addOns.length);
  const [activeRows, setActiveRows] = useState<number[]>([]);

  const disableAddRow = maxRows <= activeRows.length;

  const addRow = () => {
    setFieldValue('addOns', [...values.addOns, { id: '', price: '', name: '', unitName: '' }]);
  };

  const removeRow = (element: number) => () => {
    setFieldValue('addOns', [...values.addOns.slice(0, element), ...values.addOns.slice(element + 1)]);
  };

  const handleToggleAddonAvailability = (addOnProductId: number) => () => {
    const addOns = values.addOns.map(addOn => {
      if (addOn.addOnProductId === addOnProductId) {
        return {
          ...addOn,
          disabled: !addOn.disabled
        };
      }

      return addOn;
    });

    setFieldValue('addOns', addOns);
  };

  useEffect(() => {
    setActiveRows([...values.addOns].map((_, key) => key));
  }, [JSON.stringify(values.addOns)]);

  return (
    <>
      {activeRows.map(id => {
        const currentAddOn = values?.addOns[id];
        const hasAddOnBeenBooked = currentAddOn && 'booked' in currentAddOn && currentAddOn.booked;

        return (
          <AddOnItem key={id} id={id} addOns={addOns} disabled={currentAddOn && currentAddOn.disabled} hasAddOnBeenBooked={hasAddOnBeenBooked}>
            <AddOnActionsContainer>
              {!hasAddOnBeenBooked && (
                <a className={'remove-addOn'} onClick={removeRow(id)} onKeyPress={removeRow(id)} role={'button'} tabIndex={0}>
                  <DeleteIcon /> REMOVE
                </a>
              )}

              {currentAddOn && 'disabled' in currentAddOn && (
                <a
                  className={'toggle-addOn'}
                  data-testid="toggle-addOn-availability"
                  onClick={handleToggleAddonAvailability(currentAddOn.addOnProductId)}
                  onKeyPress={handleToggleAddonAvailability(currentAddOn.addOnProductId)}
                  role={'button'}
                  tabIndex={0}>
                  {currentAddOn.disabled ? (
                    <>
                      <Visibility /> ENABLE
                    </>
                  ) : (
                    <>
                      <VisibilityOff /> DISABLE
                    </>
                  )}
                </a>
              )}
            </AddOnActionsContainer>
          </AddOnItem>
        );
      })}

      <Button disabled={disableAddRow} secondary onClick={addRow}>
        + ADD ON
      </Button>
    </>
  );
};

const AddOnActionsContainer = styled.div`
  display: flex;
  justify-content: space-around;

  a {
    &:nth-child(1) {
      margin-right: 15px;
    }
  }
`;

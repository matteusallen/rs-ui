//@flow
import React from 'react';
import styled from 'styled-components';

import { Field, useFormikContext } from 'formik';

import { CardSelect } from '../Form';
import FormikMoneyField, { cleanMoneyInput } from '../../../../components/Fields/FormikMoneyField';
import type { AddOnType } from '../../../../queries/Admin/CreateEvent/VenueAddOns';
import type { EventFormType } from '../Form';

type AddOnItemPropsType = {|
  addOns: AddOnType[],
  children: React$Node,
  id: number,
  disabled: boolean,
  hasAddOnBeenBooked: boolean
|};

export const AddOnItem = ({ id, addOns, children, disabled, hasAddOnBeenBooked }: AddOnItemPropsType) => {
  const { values, setFieldValue } = useFormikContext<EventFormType>();

  return (
    <div className={'card-row addOn'}>
      {hasAddOnBeenBooked ? (
        <NotEditableContainer disabled={disabled}>
          <p>{addOns[id].name}</p>
          <p>${values.addOns[id].price}</p>
        </NotEditableContainer>
      ) : (
        <>
          <CardSelect formId={id} addOns={addOns} name={`addOns[${id}].id`} disabled={disabled} />
          <Field
            name={`addOns[${id}].price`}
            type="number"
            render={({ field, meta }) => {
              const error = !meta.value ? meta.error : 'Invalid price';
              return (
                <FormikMoneyField
                  {...field}
                  {...meta}
                  className={`unit-price ${disabled && 'unit-price__disabled'}`}
                  label="Price Per Unit"
                  error={meta.touched && meta.error ? meta.error : null}
                  variant="filled"
                  helperText={meta.touched && meta.error ? error : null}
                  onChange={e => {
                    setFieldValue(`addOns[${id}].price`, cleanMoneyInput(e.target.value));
                  }}
                />
              );
            }}
          />
        </>
      )}
      {children}
    </div>
  );
};

const NotEditableContainer = styled.div`
  display: grid;
  grid-template-columns: 375px 150px;

  p {
    font-size: 16px;
    opacity: ${props => (props.disabled ? '0.3' : '1')};

    &:nth-child(1) {
      margin-right: 15px;
      padding-left: 10px;
    }
  }
`;

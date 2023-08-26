//@flow
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Field, useFormikContext } from 'formik';
import { capitalize, MenuItem, Select } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';

import RESERVATION_STATUS from 'Constants/reservationStatus';
import type { SidePanelFormShapeType } from './SidePanelForm';
import withUpdateReservationStatus from '../../../../mutations/UpdateReservationStatus';
import type { UpdateReservationStatusType } from '../../../../mutations/UpdateReservationStatus';

type SidePanelSelectPropsType = {|
  disabled: boolean,
  name: 'rvStatusId' | 'stallStatusId',
  orderItemId: string,
  updateReservationStatus: UpdateReservationStatusType
|};

const SidePanelSelectComponent = ({ name, orderItemId, disabled, updateReservationStatus }: SidePanelSelectPropsType) => {
  const { values } = useFormikContext<SidePanelFormShapeType>();
  const statusId = values[name] ? String(values[name]) : '';
  const [isDirty, setDirty] = useState<boolean>(false);

  const options = useMemo(
    () =>
      Object.keys(RESERVATION_STATUS)
        .filter(key => RESERVATION_STATUS[key].id !== RESERVATION_STATUS.CANCELLED.id)
        .map(key => ({
          value: RESERVATION_STATUS[key].id || '',
          label: capitalize(RESERVATION_STATUS[key].name || '')
        })),
    [JSON.stringify(RESERVATION_STATUS)]
  );

  const nodes = useMemo(
    () =>
      options.map(({ value, label }) => (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      )),
    [JSON.stringify(options)]
  );

  const updateStatusCallback = useCallback(() => {
    if (isDirty && !!orderItemId && !!statusId && !!values.order.id) {
      updateReservationStatus({ orderItemId, statusId }, { id: values.order.id });
    } else {
      setDirty(true);
    }
  }, [statusId]);

  useEffect(() => {
    updateStatusCallback();
  }, [updateStatusCallback]);

  return (
    <div className={'order-select'}>
      <Field
        as="select"
        name={name}
        render={({ field }) => (
          <FormControl disabled={disabled}>
            <Select {...field} disableUnderline>
              {nodes}
            </Select>
          </FormControl>
        )}
      />
    </div>
  );
};

export const SidePanelSelect = withUpdateReservationStatus(SidePanelSelectComponent);

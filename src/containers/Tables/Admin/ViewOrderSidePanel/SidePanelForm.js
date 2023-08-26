//@flow
import React from 'react';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import type { OrderType } from '../../../../queries/Admin/OrderForOrderTableDetail';

export type SidePanelFormShapeType = {|
  order: OrderType,
  rvStatusId?: string,
  stallStatusId?: string
|};

type SidePanelFormPropsType = {|
  children: (values: FormikProps<SidePanelFormShapeType>) => React$Node,
  hasRvs: boolean,
  hasStalls: boolean,
  order: OrderType | {},
  rvStatusId: string,
  stallStatusId: string
|};

const SidePanelFormValidations = Yup.object().shape({
  order: Yup.object(),
  stallStatusId: Yup.string().when('hasStalls', {
    is: (val: string) => !!val,
    then: Yup.string().required('Stall Reservation status is required'),
    otherwise: Yup.string().nullable()
  }),
  rvStatusId: Yup.string().when('hasRvs', {
    is: (val: string) => !!val,
    then: Yup.string().required('RV Reservation status is required'),
    otherwise: Yup.string().nullable()
  })
});

export const SidePanelForm = ({ children, ...props }: SidePanelFormPropsType) => {
  return (
    <Formik initialValues={{ ...props }} validationSchema={SidePanelFormValidations}>
      {props => children(props)}
    </Formik>
  );
};

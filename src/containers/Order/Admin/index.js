import React from 'react';

import AdminOrderCreate from './Create';
import AdminReservationEdit from './Edit';

function AdminReservationContainer(props) {
  const { reservationEditable } = props;
  return reservationEditable ? <AdminReservationEdit {...props} /> : <AdminOrderCreate />;
}

export default AdminReservationContainer;

export const getReservationsAddOnsColumn = (reservation, columnName) => {
  const addOns = {};
  if (reservation && reservation.reservationAddOns) {
    reservation.reservationAddOns.forEach(obj => {
      addOns[obj.addOn.name] = obj[columnName];
    });
  }
  return addOns;
};

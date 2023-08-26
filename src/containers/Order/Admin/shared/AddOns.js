//@flow
import React from 'react';
import { capitalize } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { Separator } from '../../../../components/Separator';
import AddOnRows from '../../shared/AddOnRows';
import AddOnStyles from './AddOnStyles';
import { pluralizeName } from '../../Renter/Create/TicketOrderItem';
import { getValueByPropPath } from '../../../../utils/objectHelpers';
import type { OrderItemsType } from '../../../../helpers';
import WarningModal from 'Components/WarningModal/WarningModal';
import UpdatedChip from './UpdatedChip';

type AddOnsPropsType = {|
  addOnProducts?: OrderItemsType[],
  className?: string,
  isOpen?: boolean,
  reservationEdit?: boolean,
  eventAddOns?: [],
  isWarningOpen?: boolean,
  toggleDeleteModalVisibility: () => void,
  handleWarningClose?: () => void,
  editView: boolean
|};

const AddOns = (props: AddOnsPropsType) => {
  const { addOnProducts, reservationEdit, className = '', isOpen, eventAddOns, isWarningOpen, handleWarningClose, toggleDeleteModalVisibility } = props;
  const { values, setFieldValue } = useFormikContext();

  const onlyAddOns = !values.stalls?.quantity && !values.rv_spot?.quantity;
  const deletedAddOnsObject = {};
  addOnProducts?.forEach(addOn => {
    deletedAddOnsObject[addOn.addOnProduct?.id] = 0;
  });

  return (
    <div className={`${className}__card-content ${isOpen ? 'open' : ''}`}>
      {isOpen ? (
        <>
          <Separator margin="0.625rem 0 1.375rem" />
          <AddOnRows {...props} />
        </>
      ) : reservationEdit && addOnProducts ? (
        <>
          <WarningModal
            isOpen={isWarningOpen}
            onCancel={handleWarningClose}
            handleClose={handleWarningClose}
            continueLabel="DELETE"
            cancelLabel="GO BACK"
            header="ARE YOU SURE?"
            text={`Are you sure you would like to delete ${onlyAddOns ? 'your entire reservation' : 'all addons'}?`}
            onContinue={() => {
              if (onlyAddOns) toggleDeleteModalVisibility();
              else setFieldValue('addOns', deletedAddOnsObject);
              handleWarningClose && handleWarningClose();
            }}
          />
          <div className={'separator'} />
          <div className={'add-on-row'}>
            {eventAddOns?.map(addOn => {
              const bookedAddOn = addOnProducts.find(bookedAddOn => bookedAddOn.addOnProduct.id === addOn.id) || {};
              const addOnProduct = bookedAddOn.addOnProduct ? bookedAddOn.addOnProduct : values.addOns[addOn.id] ? addOn : null;
              const quantity = values.addOns && values.addOns[addOnProduct?.id];
              const isUpdated = bookedAddOn?.quantity !== quantity || (bookedAddOn?.quantity > 0 && !values.addOns[addOnProduct?.id]);

              return (
                <div key={addOnProduct?.id || addOn.id} className={'column'}>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <h4>{capitalize(addOn.addOn.name)}</h4>
                    {isUpdated && (
                      <div style={{ marginTop: '25px' }}>
                        <UpdatedChip />
                      </div>
                    )}
                  </div>
                  {`${(values.addOns && values.addOns[addOnProduct?.id]) || '-'} ${
                    quantity ? pluralizeName(capitalize(getValueByPropPath(addOnProduct, 'addOn.unitName', '')), quantity) : ''
                  }`}
                </div>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default AddOnStyles(AddOns);

//@flow
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useFormikContext, Field } from 'formik';
import { isEmpty } from '../../../helpers';
import colors from '../../../styles/Colors';
import { paragraphReg } from '../../../styles/Typography';
import { displayFlex, doMediaQuery } from '../../../styles/Mixins';
import type { ReservationFormShapeType } from '../Renter/Create';
import { isMaximumAddOnAllowedExceeded } from '../../../helpers/productLimits';
import type { AddOnProductType } from '../../../queries/Renter/EventForOrderCreate';
import AdditiveInput from '../../../components/AdditiveInput/AdditiveInput';
import _upperFirst from '../../../utils/upperFirst';
import WarningModal from 'Components/WarningModal/WarningModal';
import { buildOrderItems } from 'Helpers/buildOrderItems';
import UpdatedChip from '../Admin/shared/UpdatedChip';

type MapAddOnsReturnType = {| ...AddOnProductType, quantity: number |};
type MapAddOnsInputType = {| addOnProduct: AddOnProductType, quantity: number |};

const mapAddOns = (items: MapAddOnsInputType[]): MapAddOnsReturnType[] =>
  items.map(item => {
    return {
      quantity: item.quantity,
      ...item.addOnProduct
    };
  });

const AddOnRowsBase = ({ className, ...props }) => {
  const { values, errors, setFieldValue, setFieldError } = useFormikContext<ReservationFormShapeType>();
  const { event, reservationEdit } = values;
  const fieldName = (id: number) => `addOns.${id}`;
  const addOnProducts = props.addOnProducts?.length ? mapAddOns(props.addOnProducts) : event.addOnProducts;

  const filterOut = (base, target) => {
    const baseIds = base.map(item => item.id);
    return target.filter(item => !baseIds.includes(item.id));
  };

  const unselectedAddOns = props.addOnProducts?.length ? filterOut(mapAddOns(props.addOnProducts), event.addOnProducts) : [];
  const allSelectedAddOns = [...unselectedAddOns, ...addOnProducts];

  useEffect(() => {
    if (allSelectedAddOns.length) {
      if (!reservationEdit) {
        allSelectedAddOns.forEach(item => {
          setFieldValue(`addOns.${item.id}`, item.quantity);
        });
      } else {
        allSelectedAddOns.forEach(item => {
          setFieldValue(`addOns.${item.id}`, props.currentAddOns[item.id]);
        });
      }
    }
  }, [JSON.stringify(allSelectedAddOns)]);

  useEffect(() => {
    if (values.addOns) {
      for (let key in values.addOns) {
        const value = values.addOns[key];
        const addOnFieldName = `addOns.${key}`;
        if (isMaximumAddOnAllowedExceeded(value) && !errors[addOnFieldName]) {
          setFieldError(addOnFieldName, 'Maximum exceeded');
        }
      }
    }
  }, [values.addOns, errors]);
  const orderItemsLength = buildOrderItems(values).length;

  if (isEmpty(event)) return <p className={className}>Select event to see available items</p>;

  if (allSelectedAddOns.length === 0 || (allSelectedAddOns.every(({ disabled }) => disabled) && !props.editView)) {
    return <p className={className}>No add ons available for this event</p>;
  }

  return (
    <div className={`${className} ${className}__flex-checkout-container`}>
      {allSelectedAddOns.map(({ id, addOn, price, quantity }) => {
        const [eventAddOn] = event.addOnProducts.filter(addOnProduct => addOnProduct.id === id);
        const [isWarningOpen, setIsWarningOpen] = useState(false);
        const [addoOnDisabledWarning, setAddoOnDisabledWarning] = useState(false);
        const ownField = fieldName(id);
        const isUpdated = quantity && quantity !== values.addOns[id];
        const displayAddOn = props.editView || !eventAddOn.disabled;

        return (
          <React.Fragment key={id}>
            {displayAddOn && (
              <>
                <WarningModal
                  isOpen={addoOnDisabledWarning}
                  onCancel={() => setAddoOnDisabledWarning(false)}
                  handleClose={() => setAddoOnDisabledWarning(false)}
                  continueLabel="OK"
                  header="OUT OF STOCK"
                  text="This add on is out of stock."
                  onContinue={async () => {
                    setAddoOnDisabledWarning(false);
                  }}
                />
                {values.reservationEdit && (
                  <WarningModal
                    isOpen={isWarningOpen}
                    onCancel={() => setIsWarningOpen(false)}
                    handleClose={() => setIsWarningOpen(false)}
                    continueLabel="DELETE"
                    cancelLabel="GO BACK"
                    header="ARE YOU SURE?"
                    text={`Are you sure you would like to delete ${orderItemsLength > 1 ? 'all of this addon' : 'your entire reservation'}?`}
                    onContinue={async () => {
                      if (orderItemsLength === 1) {
                        setIsWarningOpen(false);
                        props.toggleDeleteModalVisibility();
                      } else {
                        setFieldValue(ownField, 0);
                        setIsWarningOpen(false);
                      }
                    }}
                  />
                )}
                <div className={`${className}__add-on-row`}>
                  <div className={`${className}__label-description-container`}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <div className={`${className}__add-on-label`}>{_upperFirst(addOn.name)}</div>
                      {isUpdated && reservationEdit && <UpdatedChip />}
                    </div>
                    <p>{_upperFirst(addOn.description)}</p>
                  </div>
                  <div className={`${className}__price-input-container`}>
                    <div className={`${className}__price-container`}>
                      <span className={`${className}__add-on-price`}>${price % 1 != 0 ? price.toFixed(2) : price}</span>
                      <span className={`${className}__units`}>
                        {`per ${addOn.unitName}`}
                        {!addOn.unitName.match(/s$/) > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className={`${className}__addOn-number-field`}>
                      <Field defaultValue={addOn.quantity || 0} name={ownField}>
                        {({ meta }) => (
                          <AdditiveInput
                            handleKeyPress={e => {
                              if (e.keyCode === 8 && e.target.value === 0) {
                                if (reservationEdit) setIsWarningOpen(true);
                                else setFieldValue(ownField, 0);
                              }
                            }}
                            reservationEdit={reservationEdit}
                            className={`${className}__addOn-additive-input`}
                            label={`# OF ${addOn.unitName.toUpperCase()}S`}
                            id={ownField}
                            error={meta.error}
                            disabledIncrement={eventAddOn.disabled}
                            displayIncrementWarning={() => setAddoOnDisabledWarning(true)}
                            onValueChange={async value => {
                              if (value === 0 && reservationEdit) {
                                setIsWarningOpen(true);
                              } else {
                                await setFieldValue(ownField, value);
                              }
                            }}
                            onChange={async e => {
                              const currentValue = values.addOns[id];
                              if (Number(e.target.value) < 151) {
                                const valueToInt = Number(e.target.value.replace(/[^0-9, ^/.]/g, ''));
                                const value = Math.trunc(valueToInt);
                                if (e.target.value == 0 || e.target.value == '') {
                                  setIsWarningOpen(true);
                                } else if (value) {
                                  if (eventAddOn.disabled) {
                                    if (currentValue < value) {
                                      setAddoOnDisabledWarning(true);
                                      return await setFieldValue(ownField, currentValue);
                                    }

                                    await setFieldValue(ownField, value);
                                  }

                                  await setFieldValue(ownField, value);
                                }
                              } else {
                                await setFieldValue(ownField, 150);
                              }
                            }}
                            value={values.addOns[id] || meta.value}
                            maximumValue={quantity}
                          />
                        )}
                      </Field>
                    </div>
                  </div>
                </div>
              </>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const AddOnRows = styled(AddOnRowsBase)`
  &__flex-checkout-container {
    ${displayFlex}
    flex-direction: column;

    @media screen and (max-width: 768px) {
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      align-self: flex-start;
      margin: 20px 0 0 0;
    }
  }

  &__add-on-row {
    margin-top: 25px;
    ${displayFlex}
    flex-flow: row wrap;
    justify-content: space-between;
    border-bottom: solid 1px ${colors.text.lightGray};
    padding-bottom: 25px;
    ${doMediaQuery(
      'SMALL_TABLET_WIDTH',
      `
      flex-flow: row nowrap;
    `
    )}

    @media screen and (max-width: 500px) {
      max-width: 100%;
    }
  }

  &__add-on-row:last-child {
    border-bottom: unset;
  }

  &__addOn-number-field {
    width: 220px;
    @media screen and (max-width: 768px) {
      width: 50%;
    }
  }

  &__addOn-additive-input {
    @media screen and (max-width: 500px) {
      margin-left: -15px;
    }
  }

  &__add-on-label {
    color: #11181f;
    font-size: 18px;
    font-family: 'IBMPlexSans-SemiBold';
  }

  &__label-description-container {
    width: 314px;
    @media screen and (max-width: 768px) {
      padding-bottom: 25px;
      margin-top: 25px;
      width: 100%;
    }
  }

  &__add-on-price {
    color: #10ac84;
    font-family: 'IBMPlexSans-SemiBold';
    font-size: 22px;
    font-weight: bold;
    height: 25px;
    letter-spacing: 0.97px;
    line-height: 25px;
    @media screen and (max-width: 768px) {
      margin-right: 5px;
      width: auto;
    }
  }

  &__price-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 75px;
    padding: 0 60px;
    margin: 0 25px;
    width: 176px;
    @media screen and (max-width: 768px) {
      border: none;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      padding: 0 10px;
      margin: 0 auto;
    }
  }

  &__units {
    ${paragraphReg}
    white-space: nowrap;
  }

  &__price-input-container {
    display: flex;
    align-items: center;
    @media screen and (max-width: 768px) {
      border-bottom: 1px solid #c8d6e5;
      max-width: 100%;
    }
  }
`;

export default AddOnRows;

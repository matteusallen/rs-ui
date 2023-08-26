//@flow
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Field, useFormikContext } from 'formik';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Delete } from '@material-ui/icons';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Zoom from '@material-ui/core/Zoom';
import styled from 'styled-components';
import colors from '../../../../styles/Colors';
import type { EventFormType } from '../Form';
import { SimpleDateRangePicker } from '../SimpleDateRangePicker';
import { EventCard } from '../Cards/EventCard';
import StallSelection from './StallSelection';
import { FormikField, FormikMoneyField } from '../../../../components/Fields';
import CheckboxThemed from '../Checkbox';
import RadioThemed from '../Radio';
import type { BuildingType } from '../../../../queries/Admin/CreateEvent/CreateEventsStalls';
import { cleanMoneyInput } from '../../../../components/Fields/FormikMoneyField';
import { getValueByPropPath } from '../../../../utils/objectHelpers';
import { IconButton } from '@material-ui/core';
import { emptyStallCard, emptyRvCard } from '../Form';
import { HeadingFour } from 'Components/Headings';
import { momentRange, mapDates } from '../../../../helpers/momentRange';
import { DATE_FORMAT } from '../../../../helpers/DATE_FORMAT';
import MinNightsInput from '../Cards/MinNightsInput';

type RateBasePropType = {|
  className: string,
  index: number,
  stallsPerBuilding: ?Array<BuildingType> | null,
  productType: string,
  renderLotNames: () => ?React$Element<any> | null,
  renderReservables: () => ?React$Element<any> | null,
  scope: string
|};

const RateBase = ({ className, index = 0, productType, stallsPerBuilding, renderLotNames, renderReservables, scope }: RateBasePropType) => {
  const { setFieldValue, values, setTouched, touched } = useFormikContext<EventFormType>();
  const { eventDates, hasStalls, hasRvs, stalls, rvs } = values;
  const singleProduct = values[productType][index];
  const unit = productType === 'stalls' ? 'stall' : 'spot';
  const entireEvent = getValueByPropPath(values, `${productType}[${index}].entireEvent`, false);
  const isDisabled = productType === 'stalls' ? !hasStalls : !hasRvs;
  const product = productType === 'stalls' ? stalls : rvs;

  const removeRate = index => {
    setFieldValue(productType, [...values[productType].slice(0, index), ...values[productType].slice(index + 1)]);
    const newTouchedObj = { ...touched };
    newTouchedObj[productType][index] = { name: false, price: false };
    setTouched(newTouchedObj);
  };

  const emptyCard = productType === 'stalls' ? emptyStallCard : emptyRvCard;

  const newRate = event => {
    event.preventDefault();
    setFieldValue(productType, [...product, JSON.parse(JSON.stringify(emptyCard))]);
  };

  function getNameOrLotHeader() {
    if (productType === 'stalls') {
      return (
        <>
          <HeadingFour label="Name" />
          <Field
            className="rate-name"
            component={FormikField}
            label="RATE NAME"
            name={`${productType}[${index}].name`}
            type="text"
            variant="filled"
            disabled={isDisabled}
          />
        </>
      );
    }
    return renderLotNames(singleProduct.booked);
  }

  const pricingChangeHandler = event => {
    const { value } = event.target;
    setFieldValue(`${productType}[${index}].pricing`, value);
  };

  const getPriceLabel = () => {
    if (!values[productType][index].pricing) return 'PRICE';
    if (values[productType][index].pricing === 'flat') {
      return `FLAT PRICE PER ${productType === 'stalls' ? 'STALL' : 'RV'}`;
    }
    return `NIGHTLY PRICE PER ${productType === 'stalls' ? 'STALL' : 'RV'}`;
  };

  const getAllowedDateRange = () => {
    if (!singleProduct.booked) {
      return {};
    }

    const startDateRange = getStartDateRange();
    const endDateRange = getEndDateRange();

    return { allowedRangeForStart: startDateRange, allowedRangeForEnd: endDateRange };
  };

  const getStartDateRange = () => {
    const today = moment();
    const startFrom = moment.max([moment(eventDates.startDate), today]).format(DATE_FORMAT);
    const startTo = singleProduct.startDate;
    const startRangeIsValid = moment(startFrom).isBefore(moment(startTo));

    const fromRange = startRangeIsValid ? momentRange(startFrom, startTo) : [moment(singleProduct.startDate)];
    return mapDates(fromRange);
  };

  const getEndDateRange = () => {
    const endFrom = singleProduct.endDate;
    const endTo = eventDates.endDate;
    const toRange = momentRange(endFrom, endTo);
    return mapDates(toRange);
  };

  const entireEventIsSelectable = () => {
    if (!singleProduct.booked) {
      return true;
    }

    const range = getAllowedDateRange();
    const startIsAvailable = range.allowedRangeForStart.includes(eventDates.startDate);
    const endIsAvailable = range.allowedRangeForEnd.includes(eventDates.endDate);
    return startIsAvailable && endIsAvailable;
  };

  return (
    <EventCard disabled={isDisabled} useStallStyles italicizeHeading={!singleProduct?.name}>
      <div className={className + ' stalls'}>
        <div className={'card-row'} style={{ width: '100%' }}>
          <div className={'card-col'}>
            {getNameOrLotHeader()}
            <HeadingFour className="section-label" label="Available Date Range" />
            <MinNightsInput fieldName={`${productType}[${index}].minNights`} product={product} setFieldValue={setFieldValue} values={values} scope={scope} />
            <div style={{ display: 'flex', alignItems: 'end' }} className="entire-event-container">
              <SimpleDateRangePicker
                name={`${productType}[${index}].dateRange`}
                fromDateLabel={'START DATE'}
                toDateLabel={'END DATE'}
                disabled={isDisabled || entireEvent}
                startDate={entireEvent ? eventDates.startDate : values[productType][index].dateRange?.startDate}
                endDate={entireEvent ? eventDates.endDate : values[productType][index].dateRange?.endDate}
                selectableDateRange={{
                  startDate: eventDates.startDate,
                  endDate: eventDates.endDate
                }}
                {...getAllowedDateRange()}
              />
              <div id="entire-event-container">
                <Field name={`${productType}[${index}].entireEvent`} type="checkbox">
                  {({ field }) => (
                    <FormControlLabel
                      aria-label="Entire event"
                      control={
                        <CheckboxThemed
                          name={field.name}
                          onChange={e => {
                            setFieldValue(field.name, e.target.checked);
                          }}
                          style={{ marginLeft: 15 }}
                          disabled={isDisabled || !entireEventIsSelectable()}
                          checked={entireEvent}
                        />
                      }
                      label="Entire event"
                    />
                  )}
                </Field>
              </div>
            </div>
            <HeadingFour className="section-label" label="Pricing" />
            <div className={'pricing-fields'}>
              <div>
                <FormControl className="pricing-radio" component="fieldset">
                  <RadioGroup name="pricing" row value={singleProduct?.pricing} onChange={pricingChangeHandler}>
                    <FormControlLabel value="flat" control={<RadioThemed />} label={`Flat rate per ${unit}`} disabled={isDisabled || singleProduct.booked} />
                    <FormControlLabel
                      value="nightly"
                      control={<RadioThemed />}
                      label={`Nightly rate per ${unit}`}
                      disabled={isDisabled || singleProduct.booked}
                    />
                  </RadioGroup>
                </FormControl>
              </div>
              <div>
                <Field className="money-input" label={getPriceLabel()} name={`${productType}[${index}].price`} type="text" variant="filled">
                  {({ field, meta }) => (
                    <FormikMoneyField
                      {...field}
                      {...meta}
                      error={meta && meta.touched && meta.error ? 'Invalid price' : undefined}
                      helperText={meta && meta.touched && meta.error ? 'Invalid price' : undefined}
                      label={getPriceLabel()}
                      autoComplete={`${productType}[${index}].price`}
                      variant="filled"
                      style={{ marginTop: 10 }}
                      disabled={isDisabled || !singleProduct?.pricing || singleProduct.booked}
                      onChange={e => {
                        setFieldValue(`${productType}[${index}].price`, cleanMoneyInput(e.target.value));
                      }}
                    />
                  )}
                </Field>
              </div>
            </div>
          </div>
          <div className={'card-col'} style={{ paddingRight: 0 }}>
            {stallsPerBuilding ? <StallSelection stallsPerBuilding={stallsPerBuilding} index={index} /> : ''}
            {productType === 'rvs' && renderReservables()}
          </div>
        </div>
        <div className="add-remove-buttons-container">
          <IconButton data-testid="add-rate-button" onClick={newRate}>
            <AddCircleOutlineIcon />
          </IconButton>
          <IconButton
            data-testid="remove-rate-button"
            onClick={() => {
              if (product.length === 1) setFieldValue(productType === 'stalls' ? 'hasStalls' : 'hasRvs', false);
              removeRate(index);
            }}
            disabled={isDisabled || singleProduct.booked}>
            <Delete />
          </IconButton>
        </div>
      </div>
    </EventCard>
  );
};

const RateBaseStyled = styled(RateBase)`
  & {
    position: relative;
    display: flex;
    flex-direction: column;
    .card-col {
      h4:first-child {
        margin-bottom: 10px;
      }
    }
    .pricing-fields {
      margin-top: -5px;
      .pricing-radio {
        margin-bottom: -10px;
      }
    }
    .section-label {
      margin: 20px 0 10px;
    }
    .rate-name {
      margin-bottom: 0 !important;
    }
    .add-remove-buttons-container {
      display: flex;
      justify-content: flex-end;
      opacity: 1;
      margin: 0 -15px -15px 0;
      border-top: 1px solid ${colors.border.primary};
      .MuiSvgIcon-root {
        opacity: 1 !important;
      }
    }
    #entire-event-container {
      margin-bottom: -10px;
    }
  }
`;

type RatePropType = {|
  index: number,
  stallsPerBuilding: ?Array<BuildingType> | null,
  productType: string,
  renderLotNames: () => ?React$Element<any> | null,
  renderReservables: () => ?React$Element<any> | null,
  scope: string
|};

const Rate = ({ index, stallsPerBuilding, productType, renderLotNames, renderReservables, scope }: RatePropType) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 1);
  }, []);

  return index === 0 ? (
    <RateBaseStyled
      index={index}
      stallsPerBuilding={stallsPerBuilding}
      productType={productType}
      renderLotNames={renderLotNames}
      renderReservables={renderReservables}
      scope={scope}
    />
  ) : (
    <Zoom in={show}>
      <div style={{ display: 'flex', margin: 0, padding: 0, marginBottom: -45 }}>
        <RateBaseStyled
          index={index}
          stallsPerBuilding={stallsPerBuilding}
          productType={productType}
          renderLotNames={renderLotNames}
          renderReservables={renderReservables}
          scope={scope}
        />
      </div>
    </Zoom>
  );
};

export default Rate;

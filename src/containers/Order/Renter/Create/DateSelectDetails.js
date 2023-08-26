// @flow
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useFormikContext, Field } from 'formik';

import colors from '../../../../styles/Colors';
import { paragraphBold } from '../../../../styles/Typography';

import FormCard from '../../../../components/Cards/FormCard';
import { RangeDatePicker } from '../../../../components/DatePicker';
import { TextField } from '../../../../components/Fields';
import { HeadingTwo } from '../../../../components/Headings';
import { createDateRange, DATE_FORMAT } from '../../../../helpers';
import { displayFlex, doMediaQuery } from '../../../../styles/Mixins';
import { StallDates, StyledCheckbox } from '../../Admin/shared/StallDates';
import { hasProductQuantityError, isMaximumAllowedExceeded } from '../../../../helpers/productLimits';
import IncrementerIcon from 'Components/NumberIncrementer/IncrementerIcon';
import { checkMinNights } from '../../shared/minNights';

type RVSpotDetailsPropsType = {|
  className: string,
  type: 'stalls' | 'rvs'
|};

const DateSelectDetails = (props: RVSpotDetailsPropsType) => {
  const { className, type, setIsBelowMinNights } = props;
  const { values, setFieldValue, setFieldError, errors } = useFormikContext();
  const { event, stalls = {}, rv_spot = {} } = values;
  const isRv = type === 'rvs';
  const fieldName = `${isRv ? 'rv_spot' : 'stalls'}.quantity`;
  const { end: resEnd, start: resStart } = stalls;
  const { end: end, start: start } = isRv ? rv_spot : stalls;
  const rvStartDateStr = start ? start.format(DATE_FORMAT) : null;
  const rvEndDateStr = end ? end.format(DATE_FORMAT) : null;
  const stallsStartDateStr = resStart ? resStart.format(DATE_FORMAT) : null;
  const stallsEndDateStr = resEnd ? resEnd.format(DATE_FORMAT) : null;
  const minNights = isRv ? values.selectedRVMinNights : values.selectedStallMinNights;

  const [checkInDates, checkOutDates] = useMemo(
    () =>
      createDateRange({
        eventStartDate: event.startDate,
        eventEndDate: event.endDate,
        selectedStartDate: start
      }),
    [event.startDate, event.endDate, start]
  );

  const setDateRange = dates => {
    checkMinNightsWithParams(dates);
    const scope = isRv ? rv_spot : stalls;
    setFieldValue(isRv ? 'rv_spot' : 'stalls', {
      ...scope,
      start: dates.startDate,
      end: dates.endDate
    });
  };

  const checkMinNightsWithParams = dates => {
    checkMinNights(dates, minNights, setIsBelowMinNights);
  };

  const quantityChange = async newValue => {
    const value = newValue;
    await setFieldValue(fieldName, value <= 0 ? '' : value);
    if (isMaximumAllowedExceeded(value, type)) {
      setFieldError(fieldName, 'Maximum exceeded');
    }
  };

  let errorMinNight = values.isBelowMinNights.stalls && 'error';

  if (isRv) {
    errorMinNight = values.isBelowMinNights.rvs && 'error';
  }

  return (
    <FormCard className={className} dataTestId={`${isRv ? 'rv' : 'stall'}_booking_details`}>
      <div className={`${className}__card-headline-wrapper`}>
        <HeadingTwoStyled label={`${isRv ? 'RV Spot' : 'Stall'} Booking Details`} />
        <strong className={`${className}__required-text`}>(Required)</strong>
      </div>
      <div className={`${className}__row`}>
        <div className={`${className}__item`}>
          <Field name={fieldName}>
            {({ field, meta }) => (
              <div className={`${className}__quantity-field-wrapper`}>
                <IncrementerIcon
                  increment={() => {
                    let value = Number(field.value) + 1;
                    quantityChange(value);
                  }}
                  decrement={() => {
                    let value = Number(field.value) - 1;
                    quantityChange(value);
                  }}
                  top={8}
                  right={23}
                />
                <TextField
                  {...field}
                  {...meta}
                  className={`${className}__rv-spots-quantity-field`}
                  label={`NUMBER OF ${isRv ? 'RV SPOTS' : 'STALLS'}`}
                  helperText={!!meta.error && meta.error}
                  error={Boolean(meta.error)}
                  type="number"
                  max="99"
                  variant="filled"
                  InputLabelProps={{ shrink: field.value > 0 }}
                  onBlur={e => {
                    if (isMaximumAllowedExceeded(e.target.value, type)) {
                      setFieldError(fieldName, 'Maximum exceeded');
                    }
                  }}
                  onChange={e => quantityChange(Number(e.target.value.replace(/\D/g, '')))}
                  onKeyPress={e => {
                    if (e.which == 101) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            )}
          </Field>
        </div>

        <StallDates
          resStart={resStart}
          resEnd={resEnd}
          rvStartDateStr={rvStartDateStr}
          rvEndDateStr={rvEndDateStr}
          stallsStartDateStr={stallsStartDateStr}
          stallsEndDateStr={stallsEndDateStr}
          checkMinNightsWithParams={checkMinNightsWithParams}>
          {({ checked, toggleCheckbox, showCheckbox }) => (
            <>
              <div className={`${className}__item`}>
                <div className={`${className}__date-input--wrapper ${errorMinNight}`}>
                  <RangeDatePicker
                    value={[start, end]}
                    selectableRangeStart={event.startDate}
                    selectableRangeEnd={event.endDate}
                    cb={setDateRange}
                    disabled={(isRv && checked && showCheckbox) || hasProductQuantityError(isRv, errors)}
                    checkInDates={checkInDates}
                    checkOutDates={checkOutDates}
                    eventStartDate={event.startDate}
                    fromDateLabel={'CHECK IN'}
                    toDateLabel={'CHECK OUT'}
                  />
                  <span className="error-msg">Min Nights is {minNights}</span>
                </div>
              </div>
              {isRv && showCheckbox && (
                <div className={`${className}__item checkbox_container`} style={hasProductQuantityError(isRv, errors) ? { opacity: 0.5 } : {}}>
                  <StyledCheckbox
                    checked={checked}
                    color="primary"
                    name="useResDates"
                    disabled={hasProductQuantityError(isRv, errors)}
                    onClick={e => {
                      e.preventDefault();
                      toggleCheckbox();
                    }}
                    type="checkbox"
                  />
                  <span>Use same dates as my stall reservation</span>
                </div>
              )}
            </>
          )}
        </StallDates>
      </div>
    </FormCard>
  );
};

const DateSelectDetailsStyled = styled(DateSelectDetails)`
  &&& {
    overflow: visible;
  }
  &__card-headline-wrapper {
    margin: 0 0 15px 0;
    ${displayFlex}
    flex-direction: column;
    ${doMediaQuery(
      'SMALL_TABLET_WIDTH',
      `
      flex-direction: row;
    `
    )}
    justify-content: flex-start;
    align-items: baseline;

    h2 {
      margin-top: 0px;
      ${doMediaQuery(
        'SMALL_TABLET_WIDTH',
        `
        margin-top: 5px;
      `
      )}
    }
  }
  &__required-text {
    ${paragraphBold}
    font-size: 16px;
    letter-spacing: 0.7px;
    margin: 0 0 0 5px;
    color: ${colors.text.lightGray2};
  }
  &__row {
    ${displayFlex}
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  &__item {
    width: 100%;

    &:not(.checkbox_container) {
      ${doMediaQuery(
        'SMALL_TABLET_WIDTH',
        `
        flex-basis: 50%;
      `
      )}
    }
    input.MuiInputBase-input.MuiFilledInput-input {
      background: ${colors.background.primary};
    }
  }
  &__item:first-child {
    > div {
      ${doMediaQuery(
        'SMALL_TABLET_WIDTH',
        `
        padding-right: 10px;
      `
      )}
    }
  }
  &__item:last-child {
    margin-top: 20px;

    ${doMediaQuery(
      'SMALL_TABLET_WIDTH',
      `
      margin-top: unset;
      padding-left: 10px;
    `
    )}
  }

  .checkbox_container {
    width: 100%;
    ${displayFlex}
    justify-content: flex-start;
    align-items: center;
    margin: 10px 0;
    ${doMediaQuery(
      'SMALL_TABLET_WIDTH',
      `
      justify-content: flex-end;
    `
    )}
  }
  &__rv-spots-quantity-field {
    margin: 0 auto !important;
  }
  p.Mui-error {
    position: absolute;
    top: 53px;
    font-size: 15px !important;
  }

  &__quantity-field-wrapper {
    position: relative;
  }

  &__date-input--wrapper {
    .error-msg {
      display: none;
      color: #f44336;
    }

    &.error {
      .error-msg {
        display: block;
      }

      > div {
        border-bottom: 2px solid #f44336;
      }
    }
  }
`;

const HeadingTwoStyled = styled(HeadingTwo)`
  margin: 0;
  font-size: 25px !important;
  letter-spacing: 1.1px !important;
  line-height: 25px !important;
`;

export default DateSelectDetailsStyled;

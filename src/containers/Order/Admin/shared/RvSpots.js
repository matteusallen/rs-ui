import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { Grid, Checkbox } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import { Field, useFormikContext } from 'formik';

import DateRangePickerCreateReservation from 'Components/DatePicker/DateRangePickerCreateReservation';
import { TextField } from 'Components/Fields';
import { FormSelect } from 'Components/Select';
import { HeadingFive, HeadingFour } from 'Components/Headings';
import { Separator } from 'Components/Separator';
import BackDateWarning from './BackDateWarning';

import { formatOptionName, isEmpty } from 'Helpers';

import { RESERVATION_STATUSES } from 'Queries/Admin/ReservationsStatuses';

import colors from 'Styles/Colors';
import { paragraphReg } from 'Styles/Typography';

import ProductCard from './ProductCard';
import RVSelection from './RVSelection';
import RVProductSelect from '../../shared/RvProductSelect';
import { initialValues } from '../Create';
import { hasProductQuantityError } from 'Helpers/productLimits';
import IncrementerIcon from 'Components/NumberIncrementer/IncrementerIcon';
import { QuestionAnswers } from '../../shared/ProductQuestionsCard';
import useLengthValidation from '../../shared/useLengthValidation';
import { useValidateAction } from '../../../../utils/actions';
import { actions } from '../../../../constants/actions';
import { UserContext } from '../../../../store/UserContext';
import { ADMIN, RESERVATION_ADMIN } from '../../../../constants/userRoles';

const RvSpotsBase = props => {
  const { className, setRVsOpen, isStallsOpen, setRvQuestionsAreValid } = props;
  const { errors, values, setFieldValue, setValues } = useFormikContext();
  const { event, reservationEdit, rv_spot, stalls } = values;
  const [isOpen, setIsOpen] = useState(false);
  const [useSameDates, setUseSameDates] = useState(false);
  const updateStatus = useLengthValidation(event?.rvQuestions, setRvQuestionsAreValid);
  const { user } = useContext(UserContext);
  const isVenueAdmin = +user.role.id === ADMIN;
  const isReservationdmin = +user.role.id === RESERVATION_ADMIN;
  const isRoleValid = isVenueAdmin || isReservationdmin;

  const { end, start } = rv_spot;
  const { end: stallsEnd, start: stallsStart } = stalls;

  useEffect(() => {
    setRVsOpen(isOpen);
    if (!isOpen) {
      setValues({
        ...values,
        rv_spot: initialValues.rv_spot,
        rvProductId: initialValues.rvProductId,
        selectedRvs: initialValues.selectedRvs
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isStallsOpen) setUseSameDates(false);
  }, [isStallsOpen]);

  useEffect(() => {
    if (useSameDates) {
      setDateRange({ startDate: stallsStart, endDate: stallsEnd });
    }
  }, [stallsStart, stallsEnd]);

  const { data: reservationStatusesData, loading } = useQuery(RESERVATION_STATUSES);
  let reservationStatuses = [];
  if (reservationStatusesData) {
    reservationStatuses = reservationStatusesData.reservationStatuses.reduce((acc, status) => {
      if (Number(status.id) !== 4) {
        acc.push({ value: status.id, label: formatOptionName(status.name) });
      }
      return acc;
    }, []);
  }

  const today = moment().startOf('days');
  const isBackDateSelected = values.rv_spot.start?.isBefore(today);
  const eventHasStarted = moment().isAfter(moment(event.startDate).startOf('days'));

  if (loading) {
    return <></>;
  }

  const setDateRange = dates => {
    setFieldValue('rv_spot', {
      ...values.rv_spot,
      start: dates.startDate,
      end: dates.endDate
    });
  };

  const getStatusName = statuses => {
    if (isEmpty(rv_spot)) return '';
    return statuses.find(option => option.value === rv_spot.status) || null;
  };

  const statusName = getStatusName(reservationStatuses);

  const statusOptions = {
    cb: e => setFieldValue('rv_spot.status', e.target.value),
    key: !!statusName && !!statusName.value ? statusName.value : null,
    label: 'STATUS',
    options: reservationStatuses,
    selectedOption: rv_spot && rv_spot.status ? rv_spot.status : '1',
    type: 'select',
    value: getStatusName(reservationStatuses)
  };

  const disableDateSelection = isStallsOpen ? !rv_spot || reservationEdit || useSameDates || hasProductQuantityError(true, errors) : false;

  const quantityChange = async newValue => {
    let value = newValue;
    await setFieldValue('rv_spot.quantity', Number(value) <= 0 ? '' : value.replace(/[^0-9]/g, ''));
  };

  const setIncludeRVsSwitch = isOpenValue => {
    setIsOpen(isOpenValue);
    setFieldValue('isBelowMinNights.rvs', false);
  };

  const canChangeRvsStatus = useValidateAction('orders', actions.STALL_STATUS_DROPDOWN_ON_RESERVATION_SIDEBAR);
  const canAssignRvs = useValidateAction('orders', actions.PRODUCT_ASSIGNMENT);

  return (
    <ProductCard className={className} edit={reservationEdit} event={event} isOpen={isOpen} productType={'rvProduct'} setIsOpen={setIncludeRVsSwitch}>
      <div className={`${className}__card-content ${isOpen ? 'open' : ''}`}>
        {isOpen ? (
          <>
            <Separator margin="0.25rem 0 1.375rem" />
            <Grid container>
              <Grid item direction="column" md={6} className={`${className}__quantity-column`}>
                <HeadingFive label={"Number of RV's"} />
                <Field name={'rv_spot.quantity'}>
                  {({ field, meta }) => (
                    <div className={`${className}__quantity-field-wrapper`}>
                      <IncrementerIcon
                        increment={async () => {
                          let value = Number(field.value) + 1;
                          quantityChange(value.toString());
                        }}
                        decrement={async () => {
                          let value = Number(field.value) - 1;
                          quantityChange(value.toString());
                        }}
                        top={13}
                        right={13}
                      />
                      <TextField
                        {...field}
                        {...meta}
                        autoComplete={'numberOfRvs'}
                        className={`${className}__rvs-field`}
                        disabled={isEmpty(event) || reservationEdit}
                        error={Boolean(meta.error)}
                        helperText={!!meta.error && meta.error}
                        inputProps={{ maxLength: 3 }}
                        InputLabelProps={{ shrink: field.value > 0 }}
                        label={'NUMBER OF SPOTS'}
                        onChange={e => quantityChange(e.target.value)}
                        type={'number'}
                        variant={'filled'}
                      />
                    </div>
                  )}
                </Field>
              </Grid>
              <Grid item direction="column" md={6} className={`${className}__date-column`}>
                <div className={`${className}__date-title--wrapper`}>
                  <HeadingFive label={'Dates'} />
                  {isStallsOpen && (
                    <div className={`${className}__item checkbox_container`} style={hasProductQuantityError(true, errors) ? { opacity: 0.5 } : {}}>
                      <span>Use same dates as my stall reservation</span>
                      <Checkbox
                        color="primary"
                        name="useResDates"
                        onClick={e => {
                          setUseSameDates(e.target.checked);
                          if (e.target.checked) {
                            setDateRange({ startDate: values.stalls.start, endDate: values.stalls.end });
                          } else {
                            setDateRange({ startDate: null, endDate: null });
                          }
                        }}
                        disabled={hasProductQuantityError(true, errors)}
                        type="checkbox"
                      />
                    </div>
                  )}
                </div>
                <div className={`${className}__date-input--wrapper ${values.isBelowMinNights.rvs && 'error'}`}>
                  <StyledDateRangePickerCreateReservation
                    defaultStartDate={start || null}
                    defaultEndDate={end || null}
                    minDate={eventHasStarted ? moment(today) : moment(event.startDate)}
                    initialVisibleMonth={moment(event.startDate)}
                    maxDate={event.endDate}
                    disabled={disableDateSelection}
                    startLabel="check in"
                    endLabel="check out"
                    allowBackDate={eventHasStarted && isRoleValid}
                    dateChangeCallback={setDateRange}
                  />
                  <span className="error-msg">Min Nights is {values.selectedRVMinNights}</span>
                </div>
                {isBackDateSelected && <BackDateWarning />}
              </Grid>
            </Grid>
            {canChangeRvsStatus && (
              <>
                <HeadingFive label={'RV Spot Reservation Status'} className={`${className}__spacing-top`} />
                <FormSelect disabled={!!errors.rv_spot && !!errors.rv_spot.quantity} className={`${className}__status-options`} {...statusOptions} />
              </>
            )}
            <HeadingFour label={'RV Spot Type'} className={`${className}__spacing-bottom`} />
            <RVProductSelect className={className} noLayout allowBackDateQuery={isBackDateSelected && eventHasStarted} />
            {canAssignRvs && (
              <>
                <HeadingFour label={'RV Spot Assignment'} />
                {!!values.rvProductId && <RVSelection />}
                {event.rvQuestions.length > 0 && (
                  <>
                    <Separator margin="20px 0" />
                    <HeadingFour label={'Additional RV Info'} />
                  </>
                )}
              </>
            )}
            {event.rvQuestions.map((question, index) => (
              <>
                <p className={question.questionType === 'openText' ? 'open-text' : ''}>
                  {question.question}
                  {question.required && <span className="required-text"> (Required)</span>}
                </p>
                <QuestionAnswers question={question} productType="rvs" updateStatus={updateStatus} index={index} />
              </>
            ))}
          </>
        ) : (
          <></>
        )}
      </div>
    </ProductCard>
  );
};

const RvSpots = styled(RvSpotsBase)`
  &__title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__switch-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__subheading {
    margin: 0;
  }

  &__spacing-top {
    margin-top: 20px !important;
  }
  &__spacing-bottom {
    margin-bottom: 20px !important;
  }

  .MuiSwitch-colorPrimary.Mui-checked {
    color: ${colors.white};
  }

  .MuiSwitch-colorPrimary.Mui-checked + .MuiSwitch-track {
    background-color: ${colors.button.primary.active};
    opacity: 1;
  }

  &__rvs-field {
    &&& {
      margin-top: 5px;
    }
  }

  &__status-options {
    ${paragraphReg}
    color: rgb(0, 0, 0);
    font-size: 0.9375rem;
    line-height: 24px;
    margin: 10px 0 20px;
    padding: 13px 0 0;
    background-color: ${colors.background.primary} !important;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    &::placeholder {
      color: ${colors.text.secondary};
    }
    &--disabled {
      opacity: 0.5;
    }
    &&& {
      label[class^='MuiInputLabel-formControl'],
      label[class*='MuiInputLabel-formControl'] {
        top: -13px;
      }
      svg[class^='MuiSelect-icon'],
      svg[class*='MuiSelect-icon'] {
        top: -2px;
      }
    }
    &&& {
      label[class^='MuiFormLabel-filled'],
      label[class*='MuiFormLabel-filled'] {
        top: -12px;
      }
      div[class^='MuiSelect-selectMenu'],
      div[class*='MuiSelect-selectMenu'] {
        margin-bottom: 15px;
      }
    }
  }
  &__item.checkbox_container {
    span {
      font-size: 12px;
    }

    .MuiCheckbox-root {
      padding: 0 0 0 9px;
    }
  }

  &__date-title--wrapper {
    display: flex;
    justify-content: space-between;
  }

  &__date-input--wrapper {
    margin-top: 5px;
    position: relative;
    height: 56px;
    padding: 7px 12px;
    background: ${colors.background.inputs};
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.42);

    .error-msg {
      display: none;
      color: #f44336;
      margin-top: 13px;
    }

    &.error {
      border-bottom: 2px solid #f44336;

      .error-msg {
        display: block;
      }
    }

    &:after {
      left: 0;
      right: 0;
      bottom: 0;
      content: '';
      position: absolute;
      transform: scaleX(0);
      transition: transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
      border-bottom: 2px solid #2875c3;
      pointer-events: none;
    }

    &&& .DateInput {
      width: auto;

      &:nth-child(3) input {
        text-align: right;
      }
    }

    &&& .DateInput_input {
      padding: 0;
      border: 0;
      height: auto;
    }
  }

  &&& .DateRangePicker > div {
    width: 100%;
  }

  &&& .DateRangePicker,
  &&& .DateRangePickerInput {
    border: 0;
    height: auto;
    display: flex;
    justify-content: space-between;
    flex: 1;
    align-items: flex-end;
  }

  &__quantity-column {
    padding-right: 10px;
  }

  &__date-column {
    padding-left: 10px;
  }

  .DateInput_input__disabled {
    font-style: normal;
  }

  &__quantity-field-wrapper {
    position: relative;
  }
`;

const StyledDateRangePickerCreateReservation = styled(DateRangePickerCreateReservation)`
  &&& {
    display: block;
  }
`;
export default RvSpots;

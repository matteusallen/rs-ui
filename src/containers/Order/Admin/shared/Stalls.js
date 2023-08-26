import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import { Field, useFormikContext } from 'formik';

import DateRangePickerCreateReservation from 'Components/DatePicker/DateRangePickerCreateReservation';
import { TextField } from 'Components/Fields';
import { FormSelect } from 'Components/Select';
import { HeadingFour, HeadingFive } from 'Components/Headings';
import { Separator } from 'Components/Separator';
import BackDateWarning from './BackDateWarning';

import { formatOptionName, isEmpty } from 'Helpers';

import { RESERVATION_STATUSES } from 'Queries/Admin/ReservationsStatuses';

import colors from 'Styles/Colors';
import { paragraphReg } from 'Styles/Typography';

import ProductCard from './ProductCard';
import StallSelection from './StallSelection';
import StallProductSelect from '../../shared/StallProductSelect';
import { initialValues } from '../Create';
import IncrementerIcon from 'Components/NumberIncrementer/IncrementerIcon';
import { QuestionAnswers } from '../../shared/ProductQuestionsCard';
import useLengthValidation from '../../shared/useLengthValidation';
import { useValidateAction } from '../../../../utils/actions';
import { actions } from '../../../../constants/actions';
import { UserContext } from '../../../../store/UserContext';
import { ADMIN, RESERVATION_ADMIN } from '../../../../constants/userRoles';

const getStatusName = (statuses, stalls) => {
  if (isEmpty(stalls)) return '';
  const match = statuses.find(option => option.value === stalls.status) || null;
  return match;
};

const StallsBase = props => {
  const { className, setStallsOpen, setStallQuestionsAreValid } = props;
  const { values, setFieldValue, setValues, errors } = useFormikContext();
  const { event, reservationEdit, stalls } = values;
  const [isOpen, setIsOpen] = useState(false);
  const { data: reservationStatusesData, loading } = useQuery(RESERVATION_STATUSES);
  const updateStatus = useLengthValidation(event?.stallQuestions, setStallQuestionsAreValid);
  const { user } = useContext(UserContext);
  const isVenueAdmin = +user.role.id === ADMIN;
  const isReservationdmin = +user.role.id === RESERVATION_ADMIN;
  const isRoleValid = isVenueAdmin || isReservationdmin;

  useEffect(() => {
    setStallsOpen(isOpen);
    if (!isOpen && !reservationEdit) {
      setValues({
        ...values,
        stalls: initialValues.stalls,
        stallProductId: initialValues.stallProductId,
        selectedStalls: initialValues.selectedStalls,
        sameDates: false
      });
    }
  }, [isOpen]);

  const today = moment().startOf('days');
  const isBackDateSelected = values.stalls.start?.isBefore(today);
  const eventHasStarted = moment().isAfter(moment(event.startDate).startOf('days'));
  if (loading) {
    return <></>;
  }

  let reservationStatuses = [];
  if (reservationStatusesData) {
    reservationStatuses = reservationStatusesData.reservationStatuses.reduce((acc, status) => {
      if (Number(status.id) !== 4) {
        acc.push({ value: status.id, label: formatOptionName(status.name) });
      }
      return acc;
    }, []);
  }

  const setDateRange = dates => {
    setFieldValue('stalls', {
      ...values.stalls,
      start: dates.startDate,
      end: dates.endDate
    });
  };

  const statusName = getStatusName(reservationStatuses, stalls);
  const statusOptions = {
    cb: e => setFieldValue('stalls.status', e.target.value),
    key: statusName ? statusName.value : null,
    label: 'STATUS',
    options: reservationStatuses,
    selectedOption: stalls && stalls.status ? stalls.status : '1',
    type: 'select',
    value: statusName
  };

  const quantityChange = async newValue => {
    let value = newValue;
    await setFieldValue('stalls.quantity', Number(value) <= 0 ? '' : value.replace(/[^0-9]/g, ''));
  };

  const setIncludeStallsSwitch = isOpenValue => {
    setIsOpen(isOpenValue);
    setFieldValue('isBelowMinNights.stalls', false);
  };

  const canAssignStalls = useValidateAction('orders', actions.PRODUCT_ASSIGNMENT);
  const canChangeStallsStatus = useValidateAction('orders', actions.RV_STATUS_DROPDOWN_ON_RESERVATION_SIDEBAR);

  return (
    <ProductCard className={className} edit={reservationEdit} event={event} isOpen={isOpen} productType={'stallProduct'} setIsOpen={setIncludeStallsSwitch}>
      <div className={`${className}__card-content ${isOpen ? `open` : ''}`}>
        {isOpen ? (
          <>
            <Separator margin="0.25rem 0 1.375rem" />
            <Grid container>
              <Grid item direction="column" md={6} className={`${className}__quantity-column`}>
                <HeadingFive label={'Quantity'} />
                <Field name={'stalls.quantity'}>
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
                        autoComplete={'numberOfStalls'}
                        className={`${className}__stalls-field`}
                        disabled={isEmpty(event) || reservationEdit}
                        error={Boolean(meta.error)}
                        helperText={!!meta.error && meta.error}
                        inputProps={{ maxLength: 3 }}
                        InputLabelProps={{ shrink: field.value > 0 }}
                        label={'NUMBER OF STALLS'}
                        onChange={e => quantityChange(e.target.value)}
                        type={'number'}
                        variant={'filled'}
                      />
                    </div>
                  )}
                </Field>
              </Grid>
              <Grid item direction="column" md={6} className={`${className}__date-column`}>
                <div className={`${className}__date-wrapper`}>
                  <HeadingFive label={'Dates'} />
                  <div className={`${className}__date-input--wrapper ${values.isBelowMinNights.stalls && 'error'}`}>
                    <StyledDateRangePickerCreateReservation
                      minDate={eventHasStarted ? moment(today) : moment(event.startDate)}
                      initialVisibleMonth={moment(event.startDate)}
                      maxDate={event.endDate}
                      disabled={!stalls || reservationEdit || !!errors.stalls}
                      dateChangeCallback={setDateRange}
                      startLabel="check in"
                      endLabel="check out"
                      allowBackDate={eventHasStarted && isRoleValid}
                    />
                    <span className="error-msg">Min Nights is {values.selectedStallMinNights}</span>
                  </div>
                  {isBackDateSelected && <BackDateWarning />}
                </div>
              </Grid>
            </Grid>
            {canChangeStallsStatus && (
              <>
                <HeadingFive label={'Stall Reservation Status'} className={`${className}__spacing-top`} />
                <FormSelect disabled={!!errors.stalls} className={`${className}__status-options`} {...statusOptions} />
              </>
            )}
            <HeadingFour label={'Stall Rate Type'} className={`${className}__spacing-bottom`} />
            <StallProductSelect className={className} noLayout allowBackDateQuery={isBackDateSelected && eventHasStarted} />
            {canAssignStalls && (
              <>
                <HeadingFour label={'Stall Assignment'} />
                {!!values.stallProductId && <StallSelection />}
                {event.stallQuestions.length > 0 && (
                  <>
                    <Separator margin="20px 0" />
                    <HeadingFour label={'Additional Stall Info'} />
                  </>
                )}
              </>
            )}
            {event.stallQuestions.map((question, index) => (
              <>
                <p className={question.questionType === 'openText' ? 'open-text' : ''}>
                  {question.question}
                  {question.required && <span className="required-text"> (Required)</span>}
                </p>
                <QuestionAnswers question={question} productType="stalls" updateStatus={updateStatus} index={index} />
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

const Stalls = styled(StallsBase)`
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

  &__stalls-field {
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

  &__quantity-field-wrapper {
    position: relative;
  }
`;

const StyledDateRangePickerCreateReservation = styled(DateRangePickerCreateReservation)`
  &&& {
    display: block;
  }
`;
export default Stalls;

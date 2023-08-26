// @flow
import 'react-dates/initialize';
import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Formik, Field, Form } from 'formik';
import { DateRangePicker } from 'react-dates';
import InsertInvitationIcon from '@material-ui/icons/InsertInvitation';
import { MONTH_DAY_YEAR_FORMAT } from '../../../../constants/dateFormats';
import TextFilter from '../../../../components/Table/Filters/TextFilter';
import SelectFilter from '../../../../components/Table/Filters/SelectFilter';
import ButtonFilter from '../../../../components/Table/Filters/ButtonFilter';
import CheckboxFilter from '../../../../components/Table/Filters/CheckboxFilter';
import { TableContext } from '../../../../components/Table/TableContext';
import 'react-dates/lib/css/_datepicker.css';
import { HeadingFour } from 'Components/Headings';
import './TableFiltersCalendar.scss';

const TODAY = 'today';
const TOMORROW = 'tomorrow';
const NEXT_SEVEN = 'next-seven';
const THIS_MONTH = 'this-month';
const CUSTOM = 'custom';

const TableFiltersBase = props => {
  const tableContextRef = useContext(TableContext);
  const allowAllDates = () => false;
  const { className, filters, setFilters, checkInOutFilter, orders, setCheckInOutFilter } = props;
  const sessionFilters = JSON.parse(sessionStorage.getItem('filters'));
  const [focusedInput, setFocusedInput] = useState(null);
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [isCustomDateRangeSelected, setIsCustomDateRangeSelected] = useState(false);
  const [initialValues, setInitialValues] = useState({
    user: '',
    stallName: '',
    rvSpotName: '',
    event: '',
    group: '',
    checkInOutDate: '',
    reservationStatus: 0,
    hasStalls: false,
    hasRVs: false,
    hasAddOns: false,
    hasSpecialReqs: false,
    spacesNeedAssignment: false,
    allSpacesAssigned: false,
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let urlValues = {};
    for (const [key, value] of urlParams) {
      if (value === 'true' || value === 'false') {
        urlValues[key] = !!value;
      } else if (key === 'startDate') {
        urlValues[key] = value;
      } else if (key === 'reservationStatus') {
        urlValues[key] = value === '' ? 0 : parseInt(value);
      } else {
        urlValues[key] = value === '' ? null : value;
      }
    }

    if (
      Object.entries(filters)
        .sort()
        .toString() !==
      Object.entries(urlValues)
        .sort()
        .toString()
    ) {
      setFilters(urlValues);
      setInitialValues(urlValues);
      setCustomStartDate(moment(urlValues.startDate));
      setCustomEndDate(moment(urlValues.endDate));
    }
  });

  useEffect(() => {
    if (!sessionFilters) sessionStorage.setItem('filters', JSON.stringify(initialValues));
    else {
      if (sessionFilters.endDate && sessionFilters.startDate) setIsCustomDateRangeSelected(true);
      setFilters(sessionFilters);
      setInitialValues(sessionFilters);
      setCustomStartDate(moment(sessionFilters.startDate));
      setCustomEndDate(moment(sessionFilters.endDate));
      handleSubmit(sessionFilters);
    }
  }, [JSON.stringify(sessionFilters)]);

  useEffect(() => {
    let checkInOutDate = '';
    if (filters.startDate) {
      checkInOutDate = getDateSelection(filters.startDate, filters.endDate);
    }
    setInitialValues({ ...initialValues, ...filters, checkInOutDate });
  }, [JSON.stringify(filters)]);

  const getDateSelection = (startDate, endDate) => {
    const diff = moment(endDate).diff(moment(startDate), 'days');
    const isStartDateToday = moment().isSame(moment(startDate), 'day');
    const isStartDateTomorrow = moment()
      .add(1, 'day')
      .isSame(moment(startDate), 'day');
    const isTodayOnly = diff === 0 && isStartDateToday;
    if (isTodayOnly) {
      return TODAY;
    } else if (isStartDateTomorrow) {
      return TOMORROW;
    } else if (!isCustomDateRangeSelected && isStartDateToday && diff === 7) {
      return NEXT_SEVEN;
    } else if (
      diff ===
      moment()
        .endOf('month')
        .diff(moment().startOf('month'), 'days')
    ) {
      return THIS_MONTH;
    }
    return CUSTOM;
  };

  const getDateRange = dateRange => {
    switch (dateRange) {
      case TODAY:
        setCustomStartDate(moment().startOf('day'));
        setCustomEndDate(moment().endOf('day'));
        return {
          startDate: moment()
            .startOf('day')
            .format('YYYY-MM-DD'),
          endDate: moment()
            .endOf('day')
            .format('YYYY-MM-DD')
        };
      case TOMORROW:
        setCustomStartDate(
          moment()
            .add(1, 'days')
            .startOf('day')
        );
        setCustomEndDate(
          moment()
            .add(1, 'days')
            .endOf('day')
        );
        return {
          startDate: moment()
            .add(1, 'days')
            .format('YYYY-MM-DD'),
          endDate: moment()
            .add(1, 'days')
            .endOf('day')
            .format('YYYY-MM-DD')
        };
      case NEXT_SEVEN:
        setCustomStartDate(moment().startOf('day'));
        setCustomEndDate(moment().add(7, 'days'));
        return {
          startDate: moment()
            .startOf('day')
            .format('YYYY-MM-DD'),
          endDate: moment()
            .add(7, 'days')
            .format('YYYY-MM-DD')
        };
      case THIS_MONTH:
        setCustomStartDate(moment().startOf('month'));
        setCustomEndDate(moment().endOf('month'));
        return {
          startDate: moment()
            .startOf('month')
            .format('YYYY-MM-DD'),
          endDate: moment()
            .endOf('month')
            .format('YYYY-MM-DD')
        };
      case CUSTOM:
        return {
          startDate: customStartDate ? customStartDate.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
          endDate: customEndDate ? customEndDate.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
        };
      default:
        return '';
    }
  };

  const handleDateRange = ({ startDate, endDate }: { endDate: moment, startDate: moment }) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
  };

  const getQueryString = values => {
    let queryString = '/admin/orders?';
    for (const [key, value] of Object.entries(values)) {
      queryString += value && typeof key === 'string' && (typeof value === 'string' || typeof value === 'number') ? `${key}=${value}&` : '';
      queryString += value && typeof key === 'string' && typeof value !== 'number' && typeof value !== 'string' ? `${key}=${'true'}&` : '';
    }

    return queryString;
  };

  const handleSubmit = (values, actions) => {
    const dateRange = getDateRange(values.checkInOutDate);
    const filterValues = {};
    const keys = Object.keys(values);
    for (const key of keys) {
      if (values[key] && key !== 'checkInOutDate') {
        filterValues[key] = values[key];
      }
    }
    const filtersForQuery = { ...filterValues, ...dateRange };
    setInitialValues(values);
    sessionStorage.setItem('filters', JSON.stringify(filtersForQuery));
    setFilters(filtersForQuery);

    history.pushState({ type: 'Filter' }, 'page 2', getQueryString(filtersForQuery));
    actions?.setSubmitting(false);
  };

  const handleClear = () => {
    const filterValues = {
      user: '',
      stallName: '',
      rvSpotName: '',
      event: '',
      checkInOutDate: '',
      group: '',
      reservationStatus: 0,
      hasStalls: false,
      hasRVs: false,
      hasAddOns: false,
      hasSpecialReqs: false,
      spacesNeedAssignment: false,
      allSpacesAssigned: false,
      startDate: '',
      endDate: ''
    };

    setCheckInOutFilter({ checkInOnly: false, checkOutOnly: false });
    setFilters(filterValues);
    setInitialValues(filterValues);
    sessionStorage.setItem('filters', JSON.stringify(filterValues));
    history.pushState({ type: 'FilterClear' }, 'page 2', '/admin/orders?');
  };

  const handleFieldClear = (e, name, form) => {
    form.setFieldValue(name, '');
    const values = { ...form.values };
    delete values[name];
    if (name === 'checkInOutDate') {
      setIsCustomDateRangeSelected(false);
      delete values['startDate'];
      delete values['endDate'];
      form.setFieldValue('startDate', '');
      form.setFieldValue('endDate', '');
      setCheckInOutFilter({ checkInOnly: false, checkOutOnly: false });
    } else if ((checkInOutFilter.checkInOnly || checkInOutFilter.checkOutOnly) && !orders.length) {
      setCheckInOutFilter({ checkInOnly: false, checkOutOnly: false });
    }
    handleSubmit(values);
  };

  return (
    <>
      <div className={`${className}__table-filters`}>
        <div className="header-container">
          <HeadingFour label="Filters" />
        </div>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
          {(
            { values, resetForm } // eslint-disable-line
          ) => (
            <Form>
              <div className="input-group">
                <Field name="user" fieldlabel="renter" component={TextFilter} value={values.user || ''} clear={handleFieldClear} />
                <Field
                  name="stallName"
                  fieldlabel="stall"
                  component={TextFilter}
                  value={values.stallName || ''}
                  clear={handleFieldClear}
                  disabled={!!values.rvSpotName}
                />
                <Field
                  name="rvSpotName"
                  fieldlabel="rv spot"
                  component={TextFilter}
                  value={values.rvSpotName || ''}
                  clear={handleFieldClear}
                  disabled={!!values.stallName}
                />
                <Field name="event" fieldlabel="event" component={TextFilter} value={values.event || ''} clear={handleFieldClear} />
                <Field name="group" fieldlabel="group name" component={TextFilter} value={values.group || ''} clear={handleFieldClear} />
                <Field
                  name="checkInOutDate"
                  fieldlabel="check in / check out date"
                  component={SelectFilter}
                  value={values.checkInOutDate || ''}
                  clear={handleFieldClear}
                  options={[
                    { value: TODAY, name: 'Today' },
                    { value: TOMORROW, name: 'Tomorrow' },
                    { value: NEXT_SEVEN, name: 'Next 7 Days' },
                    { value: THIS_MONTH, name: 'This Month' },
                    { value: CUSTOM, name: 'Custom' }
                  ]}
                />
                {values.checkInOutDate === 'custom' && (
                  <DateRangePicker
                    startDate={customStartDate}
                    startDateId="filter_startDate"
                    endDate={customEndDate}
                    endDateId="filter_endDate"
                    onDatesChange={handleDateRange}
                    focusedInput={focusedInput}
                    onFocusChange={focusedInput => setFocusedInput(focusedInput)}
                    displayFormat={MONTH_DAY_YEAR_FORMAT}
                    openDirection="up"
                    appendToBody
                    block
                    minimumNights={0}
                    isOutsideRange={allowAllDates}
                    customInputIcon={<InsertInvitationIcon />}
                  />
                )}
                <Field
                  name="reservationStatus"
                  fieldlabel="status"
                  component={SelectFilter}
                  value={values.reservationStatus || ''}
                  clear={handleFieldClear}
                  options={[
                    { value: 1, name: 'Reserved' },
                    { value: 2, name: 'Checked In' },
                    { value: 3, name: 'Departed' },
                    { value: 4, name: 'Canceled' }
                  ]}
                />
              </div>
              <div className="checkbox-group">
                <h3>included in reservation</h3>
                <Field name="hasStalls" label="Stalls" component={CheckboxFilter} checked={values.hasStalls || false} />
                <Field name="hasRVs" label="RVs" component={CheckboxFilter} checked={values.hasRVs || false} />
                <Field name="hasAddOns" label="Add Ons" component={CheckboxFilter} checked={values.hasAddOns || false} />
                <Field name="hasSpecialReqs" label="Special Requests" component={CheckboxFilter} checked={values.hasSpecialReqs || false} />
              </div>
              <div className="checkbox-group">
                <h3>stall / rv spot assignment</h3>
                <Field name="spacesNeedAssignment" label="Needs Assignment" component={CheckboxFilter} checked={values.spacesNeedAssignment || false} />
                <Field name="allSpacesAssigned" label="Stall/Spot Assigned" component={CheckboxFilter} checked={values.allSpacesAssigned || false} />
              </div>
              <div className="button-group">
                <ButtonFilter
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    tableContextRef.clearAllSelections();
                  }}
                  fullWidth>
                  apply filters
                </ButtonFilter>
                <ButtonFilter
                  color="primary"
                  fullWidth
                  onClick={() => {
                    handleClear();
                    resetForm();
                  }}>
                  clear filters
                </ButtonFilter>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

const TableFilters = styled(TableFiltersBase)`
  &__table-filters {
    background: white;
    width: 300px;
    text-align: left;
    margin-right: 12px;
    height: calc(100% + 33px);
    overflow-y: auto;
    box-shadow: 0 2px 6px rgba(17, 24, 31, 0.03), 0 2px 3px rgba(17, 24, 31, 0.1);

    .checkbox-group {
      padding: 0 20px;
    }

    .input-group {
      padding: 0 20px;
    }

    .header-container {
      margin: 20px;
    }

    .DateRangePicker {
      margin-bottom: 20px;
    }

    .DateInput {
      width: 90px;

      .DateInput_input {
        font-size: 15px;
        color: rgba(0, 0, 0, 0.87);
      }
    }

    .DateRangePickerInput_calendarIcon {
      padding: 0;
      margin: 7px 0 0 10px;
      color: #29b490;
    }

    .DateInput_input {
      width: 90px;
      padding: 11px 4px 9px;
    }

    .DateRangePickerInput {
      border-color: #8395a7;
      border-radius: 4px;
    }

    .checkbox-group {
      margin-bottom: 25px;
    }

    h3 {
      text-transform: uppercase;
      font-family: 'IBMPlexSans-Bold';
      font-size: 12px;
      font-weight: 400;
      color: #4f5d6d;
      margin-top: 0;
      margin-bottom: 3px;
    }

    .MuiButton-root {
      margin: 0 0 14px 0;
      font-size: 16px;
    }

    .button-group {
      position: sticky;
      bottom: 0;
      background: white;
      box-shadow: 0 2px 6px rgba(17, 24, 31, 0.08), 0 2px 6px rgba(17, 24, 31, 0.3);
      padding: 16px 20px 0 20px;
    }
  }
`;

export default TableFilters;

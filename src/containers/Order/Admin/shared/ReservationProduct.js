//@flow
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { Field, useFormikContext } from 'formik';
import { Grid } from '@material-ui/core';
import moment, { Moment } from 'moment';
import { DATE_FORMAT } from '../../../../helpers/DATE_FORMAT';
import WarningModal from 'Components/WarningModal/WarningModal';
import { RESERVATION_STATUSES } from '../../../../queries/Admin/ReservationsStatuses';
import { RangeDatePicker } from '../../../../components/DatePicker';
import { TextField } from '../../../../components/Fields';
import { HeadingFour, HeadingFive } from '../../../../components/Headings';
import { FormSelect } from '../../../../components/Select';
import { Separator } from '../../../../components/Separator';
import { formatOptionName, isEmpty } from '../../../../helpers';
import RvProductSelect from '../../shared/RvProductSelect';
import RvSelection from './RVSelection';
import StallProductSelect from '../../shared/StallProductSelect';
import StallSelection from './StallSelection';
import colors from '../../../../styles/Colors';
import { paragraphReg } from '../../../../styles/Typography';
import { isMaximumAllowedExceeded } from '../../../../helpers/productLimits';
import { buildOrderItems } from 'Helpers/buildOrderItems';
import UpdatedChip from './UpdatedChip';
import { sortArrayOfObj } from 'Utils/arrayHelpers';
import withUpdateReservationStatus from '../../../../mutations/UpdateEditReservationStatus';
import type { UpdateReservationStatusType } from '../../../../mutations/UpdateEditReservationStatus';
import IncrementerIcon from 'Components/NumberIncrementer/IncrementerIcon';
import EditQuestionAnswers from '../../shared/EditQuestionAnswers';
import { Product } from '../../../../constants/productType';
import { checkMinNights } from '../../shared/minNights';
import useLengthValidation from '../../shared/useLengthValidation';
import { useValidateAction } from '../../../../utils/actions';
import { actions } from '../../../../constants/actions';

type ReservationProductPropsType = {|
  className: string,
  eventSelected: boolean,
  handleWarningClose: () => void,
  toggleDeleteModalVisibility: () => void,
  setIsWarningOpen: () => void,
  isWarningOpen: boolean,
  isOpen: boolean,
  order: {
    id: string,
    orderItems: {
      // eslint-disable-next-line flowtype/no-weak-types
      filter: ({}) => any
    }
  },
  productType: string,
  questionAnswers: string,
  reservationEdit: boolean,
  updateReservationStatus: UpdateReservationStatusType,
  isBelowMinNights: boolean,
  setIsBelowMinNights: () => void,
  setProductQuestionsAreValid: (isValid: boolean) => void
|};

const ReservationProductBase = (props: ReservationProductPropsType): React$Node => {
  const {
    className,
    eventSelected,
    isOpen,
    order,
    questionAnswers,
    productType,
    reservationEdit,
    isWarningOpen,
    setIsWarningOpen,
    handleWarningClose,
    toggleDeleteModalVisibility,
    updateReservationStatus,
    isBelowMinNights,
    setIsBelowMinNights,
    setProductQuestionsAreValid
  } = props;
  const { setFieldValue, setFieldError, values, errors } = useFormikContext();
  const [isProductUnavailable, setIsProductUnavailable] = useState(false);
  const [areAvailableProducts, setAreAvailableProducts] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [unavailableProducts, setUnavailableProducts] = useState([]);
  const [currentSelectionAvailableCount, setCurrentSelectionAvailableCount] = useState(0);
  const [previousQuantity, setPreviousQuantity] = useState(0);
  const [initialProductId] = useState(productType === 'stallProduct' ? values.stallProductId : values.rvProductId);
  const updateStatus = useLengthValidation(questionAnswers, setProductQuestionsAreValid);

  let productName = '';
  switch (productType) {
    case 'stallProduct':
      productName = 'stalls';
      break;
    case 'rvProduct':
      productName = 'rv_spot';
      break;
  }

  const [resStatus, setResStatus] = useState(values[productName].status || 1);

  const { event, selectedRvs, selectedStalls, initialRvProduct, initialStallProduct, selectedStallMinNights, selectedRVMinNights } = values;
  const minNights = productType === 'stallProduct' ? selectedStallMinNights : selectedRVMinNights;
  const { orderItems } = order;
  const reservationOrderItemArray = orderItems.filter(orderItem => {
    return orderItem.reservation && orderItem.reservation[productType];
  });
  const reservationOrderItem = reservationOrderItemArray[0];
  const { reservation } = reservationOrderItem ? reservationOrderItem : {};
  const endDate = reservation?.endDate || event?.endDate;
  const startDate = reservation?.startDate || event?.startDate;
  const { data: reservationStatusesData } = useQuery(RESERVATION_STATUSES, {
    fetchPolicy: 'network-only'
  });
  let reservationStatuses = [];
  if (reservationStatusesData) {
    reservationStatuses = reservationStatusesData.reservationStatuses.reduce((acc, status) => {
      if (Number(status.id) !== 4) {
        acc.push({ value: status.id, label: formatOptionName(status.name) });
      }
      return acc;
    }, []);
  }

  const mapDates = (moments: Moment[]): string[] => moments.map(m => m.format(DATE_FORMAT));
  const momentRange = (from: string, to: string): Moment[] => Array.from(moment.range(from, to).by('day'));

  const getRange = momentEndDate => {
    return startDate && endDate ? momentRange(event.startDate, momentEndDate.format('YYYY-MM-DD')) : null;
  };

  const from = getRange(moment(event.endDate));
  const to = getRange(moment(event.endDate).subtract(1, 'days'));
  const checkInDates = to ? mapDates(to) : {};
  const checkOutDates = from ? mapDates(from) : {};
  const initialProduct = productType === 'stallProduct' ? initialStallProduct : initialRvProduct;
  const currentProductId = productType === 'stallProduct' ? values.stallProductId : values.rvProductId;
  const updatedEndDate = values[productName].end ? moment(values[productName].end).format('YYYY-MM-DD') : null;
  const initialEndDate = moment(endDate).format('YYYY-MM-DD');
  const updatedStartDate = values[productName].start ? moment(values[productName].start).format('YYYY-MM-DD') : null;
  const initialStartDate = moment(startDate).format('YYYY-MM-DD');
  const hasRateTypeDifferences = initialProduct?.reservation[productType]?.id !== currentProductId && currentProductId && initialProduct !== 'undefined';
  const hasDatesDifference = updatedEndDate && updatedStartDate ? updatedEndDate !== initialEndDate || updatedStartDate !== initialStartDate : false;
  const orderItemsLength = buildOrderItems(values).length;
  const itemQuantity = Number(values[productName]?.quantity) > -1 ? values[productName]?.quantity : reservationOrderItem?.quantity;
  const hasQuantityDiff = initialProduct && itemQuantity > 0 ? itemQuantity !== initialProduct?.quantity : itemQuantity > 0 ? true : false;
  const deletedItem = !itemQuantity && initialProduct?.quantity > 0;
  const initialStallsOrSpotsString = sortArrayOfObj(productType === 'stallProduct' ? selectedStalls : selectedRvs, 'id').reduce(
    (acc, curr) => (acc += curr.id),
    ''
  );
  const currentStallsOrSpotsString = sortArrayOfObj(initialProduct?.reservation[productType === 'stallProduct' ? 'stalls' : 'rvSpots'], 'id').reduce(
    (acc, curr) => (acc += curr.id),
    ''
  );
  const hasStallsOrSpotsDiff = initialStallsOrSpotsString !== currentStallsOrSpotsString;

  const checkProductRateDifferences = type => {
    const productType = type === Product.STALL ? 'stallProduct' : 'rvProduct';
    const initialProduct = type === Product.STALL ? initialStallProduct?.reservation[productType] : initialRvProduct?.reservation[productType];
    const currentProductId = type === Product.STALL ? values.stallProductId : values.rvProductId;
    const currentSelectedProduct = values.event[type === Product.STALL ? 'stallProducts' : 'rvProducts'].find(prod => prod.id === currentProductId);

    const hasNameOrRateDiff =
      type === Product.STALL ? currentSelectedProduct?.nightly !== initialProduct?.nightly : initialProduct?.name !== currentSelectedProduct?.rvLot.name;

    return [hasNameOrRateDiff, currentSelectedProduct];
  };

  const [, currentRvProduct] = checkProductRateDifferences(Product.RV);
  const [, currentStallProduct] = checkProductRateDifferences(Product.STALL);

  const getDatesColumn = () => {
    if (!itemQuantity) {
      return (
        <>
          <div className="header-with-updated">
            <p>Dates</p>
            {deletedItem && <UpdatedChip />}
          </div>
          <p>-</p>
        </>
      );
    }
    return (
      <>
        <div className="header-with-updated">
          <p>Dates</p>
          {(deletedItem || hasDatesDifference) && <UpdatedChip />}
        </div>
        <p>
          {moment(values[productName]?.start || startDate).format('MM/DD/YY')} - {moment(values[productName]?.end || endDate).format('MM/DD/YY')}
        </p>
      </>
    );
  };

  const getTypeColumn = () => {
    if (productType === 'stallProduct') {
      const stallProduct = reservation ? reservation.stallProduct : currentProductId ? order.event.stallProducts.find(el => el.id === currentProductId) : null;
      return (
        <>
          <div className="header-with-updated">
            <p>Rate Type</p>
            {(deletedItem || hasRateTypeDifferences) && <UpdatedChip />}
          </div>
          <p>{!stallProduct || !itemQuantity ? '-' : currentStallProduct.nightly ? 'Nightly' : 'Flat Rate'}</p>
        </>
      );
    }
    if (productType === 'rvProduct') {
      return (
        <>
          <div className="header-with-updated">
            <p>Spot Type</p>
            {(deletedItem || hasRateTypeDifferences) && <UpdatedChip />}
          </div>
          <p>{!itemQuantity ? '-' : currentRvProduct?.name}</p>
        </>
      );
    }
    return null;
  };

  const getSpacesColumn = () => {
    if (productType === 'stallProduct') {
      return (
        <>
          <div className="header-with-updated">
            <p>Stalls</p>
            {(deletedItem || hasStallsOrSpotsDiff) && <UpdatedChip />}
          </div>
          {(!selectedStalls.length && !reservation) || !itemQuantity ? (
            '-'
          ) : (
            <p>
              {!selectedStalls.length
                ? `${itemQuantity} stall${itemQuantity === 1 ? '' : 's'}`
                : `${selectedStalls
                    .sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }))
                    .map(stall => stall.name)
                    .join(', ')}`}
            </p>
          )}
        </>
      );
    }
    if (productType === 'rvProduct') {
      return (
        <>
          <div className="header-with-updated">
            <p>Spots</p>
            {(deletedItem || hasStallsOrSpotsDiff) && <UpdatedChip />}
          </div>
          {(!selectedRvs.length && !reservation) || !itemQuantity ? (
            '-'
          ) : (
            <p>
              {!selectedRvs.length
                ? `${itemQuantity} spot${itemQuantity === 1 ? '' : 's'}`
                : `
            ${selectedRvs
              .sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }))
              .map(spot => spot.name)
              .join(', ')}`}
            </p>
          )}
        </>
      );
    }
    return null;
  };

  const setDateRange = dates => {
    setFieldValue(productName, {
      ...values[productName],
      start: dates.startDate,
      end: dates.endDate
    });
  };

  const getStatusName = statuses => {
    if (isEmpty(values[productName])) return '';
    const match = statuses.find(option => option.value === values[productName].status) || null;
    return match;
  };

  const showQuestions = qa => {
    return (
      <>
        <p className="question">{qa.question}</p>
        <p>{qa.answer.join(', ')}</p>
      </>
    );
  };

  let orderItemId: string;
  const getOrderItemStatus = (items, productType, statusId, orderId) => {
    if (items.some(i => i[reservation])) {
      orderItemId = items.find(el => el.reservation && el.reservation[productType] && el.id).id;
      updateReservationStatus({ orderItemId, statusId }, { id: orderId });
    }
  };

  const statusName = getStatusName(reservationStatuses);
  const statusOptions = {
    cb: e => {
      getOrderItemStatus((Object.values(orderItems): any), productType, e.target.value, order.id);
      setResStatus(e.target.value);
      setFieldValue(`${productName}.status`, e.target.value);
    },
    key: statusName ? statusName.value : null,
    label: 'STATUS',
    options: reservationStatuses,
    selectedOption: resStatus, //values[productName] ? values[productName].status : '',
    type: 'select',
    value: resStatus
  };

  const getProductSelectionHeader = () => {
    let headerText = '';
    switch (productName) {
      case 'rv_spot':
        headerText = 'RV Spot Type';
        break;
      case 'stalls':
        headerText = 'Stall Rate Type';
        break;
    }
    return headerText;
  };

  const quantityChange = async newValue => {
    const value = newValue;
    if (value === '0') {
      setIsWarningOpen();
    } else {
      setFieldValue(`${productName}.quantity`, Number(value) < 0 ? '' : Number(value));
      if (isMaximumAllowedExceeded(value, productType)) {
        setFieldError(`${productName}.quantity`, 'Maximum exceeded');
      }
    }
  };

  const handleUnavailableProducts = products => {
    setUnavailableProducts(prev => {
      if (prev.length !== products.length) {
        return [...products];
      }
      return prev;
    });
  };

  const handleReset = () => {
    if (hasDatesDifference) {
      setFieldValue(`${productName}.start`, moment(initialStartDate).format('YYYY-MM-DD'));
      setFieldValue(`${productName}.end`, moment(initialEndDate).format('YYYY-MM-DD'));
    }

    if (hasQuantityDiff) {
      setFieldValue(`${productName}.quantity`, initialProduct?.quantity);
    }

    setIsProductUnavailable(false);
    setAreAvailableProducts(false);

    if (productName === 'stalls') {
      setFieldValue('stallProductId', initialProductId);
    } else {
      setFieldValue('rvProductId', initialProductId);
    }
  };

  const handleClearSelections = () => {
    if (productName === 'stalls') {
      setFieldValue('selectedStalls', []);
      setFieldValue('stallProductId', null);
    } else {
      setFieldValue('selectedRvs', []);
      setFieldValue('rvProductId', null);
    }

    setAreAvailableProducts(false);
    setIsProductUnavailable(false);
  };

  const handleProductAvailability = productAvailability => {
    setAvailableProducts(productAvailability);
  };

  const handleAvailabilityLoading = loading => {
    setAvailabilityLoading(loading);
  };

  useEffect(() => {
    const currentProductAvailability = availableProducts.find(x => x.productId === currentProductId)?.available;
    const otherProductsAvailability = availableProducts
      .filter(x => x.productId !== currentProductId)
      .map(x => x.available)
      .reduce((state, item) => state + item, 0);

    setAreAvailableProducts(false);
    setIsProductUnavailable(false);
    setCurrentSelectionAvailableCount(currentProductAvailability);

    if ((hasRateTypeDifferences || hasDatesDifference || hasQuantityDiff) && !availabilityLoading) {
      if ((!currentProductAvailability || currentProductAvailability === 0) && (!otherProductsAvailability || otherProductsAvailability === 0) && isOpen) {
        setIsProductUnavailable(true);
        setAreAvailableProducts(false);
      }

      if (
        (!currentProductAvailability || currentProductAvailability === 1) &&
        otherProductsAvailability &&
        otherProductsAvailability > 0 &&
        currentProductId &&
        hasQuantityDiff
      ) {
        setIsProductUnavailable(false);
        setAreAvailableProducts(true);
      }

      if ((!currentProductAvailability || currentProductAvailability === 0) && otherProductsAvailability && otherProductsAvailability > 0 && currentProductId) {
        setIsProductUnavailable(false);
        setAreAvailableProducts(true);
      }

      if (currentProductAvailability && currentProductAvailability > 0) {
        setIsProductUnavailable(false);
        setAreAvailableProducts(false);
        setFieldError(productName, '');
      }
    }
  }, [availableProducts, hasRateTypeDifferences, hasDatesDifference, hasQuantityDiff, availabilityLoading]);

  const WARNING_MESSAGE =
    hasDatesDifference && !hasQuantityDiff
      ? 'This product is not available for the dates selected.'
      : `Only ${currentSelectionAvailableCount} left of the product selected.`;

  const startDatePast = moment(event.startDate).isAfter(values[productName].start);
  const generalError = errors[`${productName}`] && !!errors[`${productName}`].quantity ? true : !values[productName];

  const canAssignStalls = useValidateAction('orders', actions.PRODUCT_ASSIGNMENT);
  const canChangeStallsStatus = useValidateAction('orders', actions.RV_STATUS_DROPDOWN_ON_RESERVATION_SIDEBAR);
  const canAssignRvs = useValidateAction('orders', actions.PRODUCT_ASSIGNMENT);
  const canChangeRvsStatus = useValidateAction('orders', actions.STALL_STATUS_DROPDOWN_ON_RESERVATION_SIDEBAR);
  const canAssignReservations = canAssignStalls && canAssignRvs;
  const canChangeStatus = canChangeStallsStatus && canChangeRvsStatus;

  return (
    <div className={className}>
      <WarningModal
        isOpen={isWarningOpen}
        onCancel={handleWarningClose}
        handleClose={handleWarningClose}
        continueLabel="DELETE"
        cancelLabel="GO BACK"
        header="ARE YOU SURE?"
        text={`Are you sure you would like to delete your entire ${orderItemsLength < 2 ? '' : productType === 'stallProduct' ? 'stall' : 'rv'} reservation?`}
        onContinue={async () => {
          if (orderItemsLength < 2) {
            setIsWarningOpen();
            toggleDeleteModalVisibility();
          } else {
            await setFieldValue(`${productName === 'stalls' ? 'selectedStalls' : 'selectedRvs'}`, []);
            setFieldValue(`${productName}.quantity`, 0);
            setFieldValue(productName === 'stalls' ? 'stallProductId' : 'rvProductId', null);
            handleWarningClose();
          }
        }}
      />
      <WarningModal
        isOpen={isProductUnavailable && values[productName].quantity >= previousQuantity && values[productName].quantity >= initialProduct?.quantity}
        handleClose={handleReset}
        continueLabel="Ok"
        header="PRODUCT UNAVAILABLE"
        text="This product is not available for the dates selected"
        onContinue={handleReset}
      />
      <WarningModal
        isOpen={areAvailableProducts && values[productName].quantity > previousQuantity && values[productName].quantity > initialProduct?.quantity}
        handleClose={handleReset}
        continueLabel="Yes"
        cancelLabel="Don't update"
        onCancel={handleReset}
        header="PRODUCT UNAVAILABLE"
        text={`${WARNING_MESSAGE} Would you like to make a new selection? This would clear any assignments.`}
        onContinue={handleClearSelections}
      />
      {!isOpen && reservationEdit ? (
        <>
          <Separator margin="0.625rem 0 1.375rem" />
          <div className={`${className}__reservation-info`}>
            <div className={`${className}__reservation-dates`}>{getDatesColumn()}</div>
            <div className={`${className}__reservation-type`}>{getTypeColumn()}</div>
            <div className={`${className}__reservation-spaces`}>{getSpacesColumn()}</div>
          </div>
          <div className={`${className}__question-answers`}>{questionAnswers.length > 0 && questionAnswers.map(qa => showQuestions(qa))}</div>
        </>
      ) : null}
      <div className={`${className}__card-content ${isOpen ? `open` : ''}`}>
        {isOpen ? (
          <>
            <Separator margin="0.625rem 0 1.375rem" />
            <Grid container>
              <Grid item md={6} direction="column" className={`${className}__quantity-column`}>
                <div className={`${className}__heading-five`}>
                  <HeadingFive label={'Quantity'} />
                  {hasQuantityDiff && <UpdatedChip />}
                </div>
                <Field name={`${productName}.quantity`}>
                  {({ field, meta }) => (
                    <div className={`${className}__quantity-field-wrapper`}>
                      <IncrementerIcon
                        increment={() => {
                          let value = Number(field.value) + 1;
                          setPreviousQuantity(Number(field.value));
                          quantityChange(value.toString());
                        }}
                        decrement={() => {
                          let value = Number(field.value) - 1;
                          setPreviousQuantity(Number(field.value));
                          quantityChange(value.toString());
                        }}
                        top={13}
                        right={22}
                      />
                      <TextField
                        {...field}
                        {...meta}
                        className={`${className}__quantity-field`}
                        disabled={!eventSelected && !reservationEdit}
                        error={Boolean(meta.error) || isMaximumAllowedExceeded(meta.value, productType)}
                        helperText={!!meta.error && meta.error}
                        inputProps={{ maxLength: 3 }}
                        label={`NUMBER OF ${productType === 'stallProduct' ? 'STALLS' : 'SPOTS'}`}
                        onBlur={e => {
                          if (isMaximumAllowedExceeded(e.target.value, productType)) {
                            setFieldError(`${productName}.quantity`, 'Maximum exceeded');
                          }
                        }}
                        onChange={e => quantityChange(e.target.value)}
                        type={'text'}
                        value={values[productName].quantity}
                        variant={'filled'}
                      />
                    </div>
                  )}
                </Field>
              </Grid>
              <Grid item container md={6} direction="column" className={`${className}__date-column`}>
                <div className={`${className}__date-wrapper`}>
                  <div className={`${className}__heading-five`}>
                    <HeadingFive label={'Dates'} />
                    {hasDatesDifference && <UpdatedChip />}
                  </div>
                  <div className={`${className}__date-input--wrapper ${isBelowMinNights ? 'error' : ''}`}>
                    <RangeDatePicker
                      value={[values[productName].start, values[productName].end]}
                      selectableRangeStart={event.startDate}
                      selectableRangeEnd={event.endDate}
                      disabledStartDate={startDatePast}
                      disabled={generalError}
                      cb={e => {
                        const { startDate: calendarStart, endDate: calendarEnd } = e;
                        if (!calendarStart || !calendarEnd) {
                          setFieldValue(`${productName}.start`, moment(values[productName].start || e.startDate).format('YYYY/MM/DD'));
                          setFieldValue(`${productName}.end`, moment(values[productName].end || e.endDate).format('YYYY/MM/DD'));
                          setDateRange(e);
                          checkMinNights(e, minNights, setIsBelowMinNights);
                        } else {
                          setFieldValue(`${productName}.start`, moment(calendarStart).format('YYYY/MM/DD') || e.startDate.format('YYYY/MM/DD'));
                          setFieldValue(`${productName}.end`, moment(calendarEnd).format('YYYY/MM/DD') || e.endDate.format('YYYY/MM/DD'));
                          setDateRange(e);
                          checkMinNights(e, minNights, setIsBelowMinNights);
                        }
                      }}
                      checkInDates={checkInDates}
                      checkOutDates={checkOutDates}
                      eventStartDate={event.startDate}
                      fromDateLabel={'CHECK IN'}
                      toDateLabel={'CHECK OUT'}
                      isOutsideRange={d => d.isAfter(moment(event.endDate + 1).startOf('day')) || d.isBefore(moment(event.startDate - 1).startOf('day'))}
                    />
                    <span className="error-msg">Min Nights is {minNights}</span>
                  </div>
                </div>
              </Grid>
            </Grid>
            {canChangeStatus && (
              <>
                <HeadingFive label={`${productType === 'stallProduct' ? 'Stall' : 'RV Spot'} Reservation Status`} className={`${className}__spacing-top`} />
                <FormSelect className={`${className}__status-options`} {...statusOptions} />
              </>
            )}
            <div style={{ display: 'flex' }}>
              <HeadingFive label={getProductSelectionHeader()} className={`${className}__spacing-bottom`} />
              {hasRateTypeDifferences && <UpdatedChip />}
            </div>
            {unavailableProducts.length > 0 && (
              <div className={`${className}__unavailable-products-message`}>
                {productType === 'stallProduct' ? 'Stall' : 'Spot'} {unavailableProducts.map(x => x.name).join(', ')} is assigned to another renter during some
                of the selected dates. Select new {productType === 'stallProduct' ? 'stalls' : 'spots'} or unassign the other renter to save this reservation.
              </div>
            )}
            {productType === 'stallProduct' ? (
              <StallProductSelect
                className={className}
                noLayout
                hasQuantityDiff={hasQuantityDiff}
                hasDatesDifference={hasDatesDifference}
                reservationEdit={reservationEdit}
                handleProductAvailability={a => handleProductAvailability(a)}
                loadingHandler={handleAvailabilityLoading}
              />
            ) : (
              <RvProductSelect
                className={className}
                noLayout
                hasQuantityDiff={hasQuantityDiff}
                hasDatesDifference={hasDatesDifference}
                reservationEdit={reservationEdit}
                handleProductAvailability={a => handleProductAvailability(a)}
                loadingHandler={handleAvailabilityLoading}
                isBelowMinNights={isBelowMinNights}
              />
            )}
            {canAssignReservations && (
              <>
                <HeadingFour className={`${className}__assignment-heading`} label={`Available ${productName === 'rv_spot' ? 'RV Spots' : 'Stalls'}`} />
                <p className={`${className}__subheading`}>Assign {productName === 'rv_spot' ? 'RV spots' : productName} for this reservation</p>
                {productType === 'stallProduct' ? (
                  <StallSelection
                    isOpen={isOpen}
                    setUnavailableProducts={handleUnavailableProducts}
                    hasDatesDifference={hasDatesDifference}
                    hasQuantityDiff={hasQuantityDiff}
                  />
                ) : (
                  <RvSelection
                    isOpen={isOpen}
                    setUnavailableProducts={handleUnavailableProducts}
                    hasDatesDifference={hasDatesDifference}
                    hasQuantityDiff={hasQuantityDiff}
                  />
                )}
              </>
            )}
            <Separator margin="1.375rem 0" />
            <div className="heading-container">
              <HeadingFour label={`Additional ${productType === 'stallProduct' ? 'Stall' : 'RV'} Info`} />
            </div>
            {questionAnswers.map((question, index) => (
              <>
                <p className={question.questionType === 'openText' ? 'open-text' : ''}>
                  {question.question}
                  {question.required && <span className="required-text"> (Required)</span>}
                </p>
                <EditQuestionAnswers
                  question={question}
                  updateStatus={updateStatus}
                  index={index}
                  productType={productType === 'stallProduct' ? 'stalls' : 'spots'}
                />
              </>
            ))}
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

const ReservationProduct = styled(ReservationProductBase)`
  &__reservation-info {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;

    > div p:first-child {
      font-family: 'IBMPlexSans-SemiBold';
      font-size: 18px;
      letter-spacing: 0.79px;
      line-height: 23px;
    }

    p {
      margin: 0;
    }
  }

  &__reservation-spaces {
    .header-with-updated {
      display: flex;
      flex-diection: row;
    }
  }

  &__reservation-type {
    .header-with-updated {
      display: flex;
      flex-diection: row;
    }
  }

  &__reservation-dates {
    .header-with-updated {
      display: flex;
      flex-diection: row;
    }
  }

  &__heading-five {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  &__assignment-heading {
    font-size: 18px !important;
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
  &__quantity-field {
    &&& {
      margin-top: 5px;
    }
  }

  &__cal-label {
    display: flex;
    span {
      text-transform: uppercase;
      font-family: 'IBMPlexSans-Regular';
      font-size: 12px;
      color: ${colors.text.secondary};
      flex-basis: 50%;
      &:nth-child(2) {
        text-align: right;
        margin-right: 5px;
      }
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

  &__quantity-field-wrapper {
    position: relative;
    padding-right: 12px;
  }

  &__date-input--wrapper {
    margin-top: 4px;

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

  &__question-answers {
    margin-top: 20px;
    .question {
      font-family: 'IBMPlexSans-SemiBold';
      font-size: 18px;
      letter-spacing: 0.79px;
      line-height: 23px;
    }
  }

  &__unavailable-products-message {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 12px 20px;
    width: 100%;
    height: 74px;
    background: #ee5253;
    border-radius: 3px;
    margin: 10px 0px;
    color: #fff;
  }
`;

export default withUpdateReservationStatus(ReservationProduct);

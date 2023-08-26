// @flow
import gql from 'graphql-tag';
import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Button } from '@material-ui/core';
import styled from 'styled-components';
import { useLazyQuery } from '@apollo/react-hooks';
import { useFormikContext } from 'formik';
import moment from 'moment';
import IndeterminateLoading from 'Components/Loading/IndeterminateLoading';
import { getValueByPropPath } from 'Utils/objectHelpers';
import { STALL_AVAILABILITY } from 'Queries/StallAvailability';
import UpdatedChip from './UpdatedChip';
import { HeadingFive } from 'Components/Headings';
import { FormSelect } from 'Components/Select';
import StallButton from 'Components/Button/StallButton';
import colors from 'Styles/Colors';
import { paragraphReg } from 'Styles/Typography';
import Error from 'Components/Alerts/Error';
import { DATE_FORMAT } from 'Helpers/DATE_FORMAT';
import { sortArrayOfObj } from 'Utils/arrayHelpers';
import WarningModal from 'Components/WarningModal/WarningModal';

const StallSelection = ({ className, hasDatesDifference, hasQuantityDiff, setUnavailableProducts, isOpen }) => {
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const { values, errors, setFieldValue } = useFormikContext();
  const { initialStallProduct, selectedStalls, event, reservationEdit, stallProductId, stalls } = values;
  const { venue } = event;
  const { buildings } = venue;
  const { start, end } = stalls;
  const [buildingId, setBuildingId] = useState();
  const startDate = start ? moment(start).format(DATE_FORMAT) : null;
  const endDate = end ? moment(end).format(DATE_FORMAT) : null;
  const initialStallsString = sortArrayOfObj(selectedStalls, 'id').reduce((acc, curr) => (acc += curr.id), '');
  const currentStallsString = sortArrayOfObj(initialStallProduct?.reservation.stalls, 'id').reduce((acc, curr) => (acc += curr.id), '');
  const currentStallsNames = sortArrayOfObj(initialStallProduct?.reservation.stalls, 'id')
    .map(stall => stall.name)
    .join(', ');
  const hasStallsDiff = initialStallsString !== currentStallsString;

  const EVENT_STALL_BUILDINGS = gql`
    query eventProducts($id: ID) {
      event(id: $id) {
        stallProducts {
          id
          stalls {
            building {
              id
            }
          }
        }
      }
    }
  `;

  const [getAvailableStalls, { data: availableStallsData, error, loading }] = useLazyQuery(STALL_AVAILABILITY, {
    variables: {
      input: {
        startDate,
        endDate: endDate ?? startDate,
        productId: stallProductId,
        reservationId: reservationEdit ? initialStallProduct?.reservation.id : null,
        includeCurrentReservation: false
      }
    },
    fetchPolicy: 'network-only'
  });

  const [getProductBuildings, { data: eventStallProducts, loading: eventStallProductsLoading }] = useLazyQuery(EVENT_STALL_BUILDINGS, {
    variables: {
      id: values.event.id
    },
    fetchPolicy: 'network-only'
  });

  const selectedAssignmentsAreAvailable = useCallback(() => {
    if (!selectedStalls || !availableStallsData || !reservationEdit || loading || error) return true;
    let sameStall;
    for (let stall of selectedStalls) {
      sameStall = availableStallsData.stallAvailability[0]?.availableSpaces.find(availableStall => availableStall.id == stall.id);
      if (!sameStall) return false;
    }
    return true;
  }, [availableStallsData, availableStallsData?.stallAvailability, selectedStalls, reservationEdit, loading, error]);

  useEffect(() => {
    setWarningModalOpen(false);

    if (!selectedAssignmentsAreAvailable() && initialStallProduct?.reservation?.stallProduct?.id !== stallProductId) {
      setWarningModalOpen(true);
    }

    if (!buildingId && selectedStalls && selectedStalls?.length) {
      setBuildingId(selectedStalls[0].building.id);
    } else if ((!buildingId && buildings) || (buildings && buildings.length > 1)) {
      const newBuildings = availableStallsData ? availableStallsData.stallAvailability?.map(product => product.building) : buildings;
      const sortedBuildings = newBuildings.sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }));
      setBuildingId(sortedBuildings[0]?.id);
    }
  }, [buildings, availableStallsData, reservationEdit, hasDatesDifference, hasQuantityDiff, initialStallProduct, stallProductId]);

  useEffect(() => {
    if (reservationEdit) return;
    setFieldValue('selectedStalls', []);
  }, [stallProductId]);

  useEffect(() => {
    if (stallProductId) {
      getAvailableStalls();
      getProductBuildings();
    }
  }, [stallProductId]);

  if (errors.stalls && reservationEdit) return <Error label={'Enter a valid quantity to assign stalls'} />;
  if (error) return 'Error fetching Stall availability';
  if (loading || eventStallProductsLoading) return <IndeterminateLoading />;

  let availableStalls = [];
  if (availableStallsData) {
    const stallsByBuildingId = availableStallsData.stallAvailability?.filter(item => {
      return item.building.id === buildingId;
    });
    let eventStallsAvailable = [...getValueByPropPath(stallsByBuildingId, '[0].availableSpaces', [])];
    availableStalls = eventStallsAvailable.sort((a, b) => (!!a && !!b ? a.name.localeCompare(b.name, 'en', { numeric: true }) : 0));
  }
  const formatBuildingValues = () => {
    if (!availableStallsData || !eventStallProducts) return [];
    const eventBuildingsObj = {};
    eventStallProducts.event.stallProducts
      .find(product => product.id === stallProductId)
      ?.stalls.forEach(stall => {
        if (!eventBuildingsObj[stall.building.id]) eventBuildingsObj[stall.building.id] = true;
      });

    const eventOnlyBuidings = buildings.filter(building => eventBuildingsObj[building.id]);

    const availableBuildings =
      eventOnlyBuidings?.map(building => {
        return {
          value: building.id,
          label: building.name,
          disabled: !availableStallsData?.stallAvailability.find(stall => stall.building.id === building.id),
          disabledText: 'Sold Out'
        };
      }) || [];
    return availableBuildings.sort((a, b) => a.label.localeCompare(b.label, 'en', { numeric: true }));
  };

  const toggleStall = clickedStall => {
    const newSelectedStalls = selectedStalls?.length > 0 ? [...selectedStalls] : [];
    const index = newSelectedStalls.findIndex(stall => stall.id === clickedStall.id);
    if (index > -1) {
      newSelectedStalls.splice(index, 1);
    } else {
      if (stalls.quantity <= newSelectedStalls.length) return;
      newSelectedStalls.push(clickedStall);
    }
    setFieldValue('selectedStalls', newSelectedStalls);
  };

  const clearStalls = () => {
    setFieldValue('selectedStalls', []);
  };

  const isStallSelected = stall => {
    if (!stall) return false;
    const isStallActive = selectedStalls?.findIndex(selectedStall => stall.id === selectedStall.id);
    return isStallActive > -1 ? true : false;
  };

  const renderHeadingContainer = () => {
    if (reservationEdit) {
      return (
        <div className={`${className}__selected-stalls--heading-container`}>
          <div className="header-text-container">
            <div className="updated-chip-container">
              <HeadingFive label="Assigned Stalls" />
              {hasStallsDiff && reservationEdit && <UpdatedChip />}
            </div>
            <div className="clear-button-container">
              {reservationEdit && (
                <span className={`${className}__assigned-stalls-count`}>{`${selectedStalls.length + '/' + stalls.quantity} stalls assigned`}</span>
              )}
              <Button className={`${className}__selected-stalls--clear-container`} disabled={!selectedStalls.length} onClick={clearStalls}>
                <span className={`${className}__selected-stalls--clear${selectedStalls.length ? '' : 'disabled'}`}>CLEAR</span>
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={`${className}__selected-stalls--heading-container`}>
        <HeadingFive label="ASSIGNED STALLS" />
        <Button className={`${className}__selected-stalls--clear-container`} onClick={clearStalls}>
          <span className={`${className}__selected-stalls--clear-create`}>CLEAR ALL</span>
        </Button>
      </div>
    );
  };

  const selectedStallsList = selectedStalls => {
    const stallsToRender = [];
    selectedStalls?.forEach(stall => stallsToRender.push(stall));
    stallsToRender.sort((a, b) => (!!a && !!b ? a.name.localeCompare(b.name, 'en', { numeric: true }) : 0));
    for (let i = 1; i <= stalls.quantity - selectedStalls?.length; i++) {
      stallsToRender.push(null);
    }
    return stallsToRender;
  };

  const handleWarningModalClose = () => {
    setFieldValue('stallProductId', values.initialStallProduct?.reservation?.stallProduct?.id || '');
    setFieldValue('selectedStalls', values.initialStallProduct?.reservation?.stalls || []);

    if (hasDatesDifference) {
      setFieldValue('stalls.start', moment(values.initialStallProduct?.reservation?.startDate).format('YYYY/MM/DD'));
      setFieldValue('stalls.end', moment(values.initialStallProduct?.reservation?.endDate).format('YYYY/MM/DD'));
    }

    setWarningModalOpen(false);
  };

  const getRateName = () => {
    const rateName = values.initialStallProduct?.reservation?.stallProduct?.name;
    return rateName ? `in ${rateName}` : '';
  };

  const allStallsObj = {};
  const alreadyBookedStalls = [];
  availableStalls.forEach(s => {
    allStallsObj[`${s.id}-${s.building.id}`] = true;
  });

  selectedStalls.forEach(stall => {
    const id = `${stall.id}-${stall.building.id}`;
    if (!allStallsObj[id]) {
      alreadyBookedStalls.push(stall);
    }
  });

  if (alreadyBookedStalls.length && hasDatesDifference && isOpen) setUnavailableProducts(alreadyBookedStalls);
  else if (isOpen) setUnavailableProducts([]);

  const renderCardContents = () => {
    if (errors.availability && errors.availability !== 'oneNightFullyBooked') {
      return <p>Stall Selection unavailable</p>;
    }
    if (!stalls.quantity || !stalls.start || !stalls.end) {
      return <p>Complete Reservation Details to assign stalls</p>;
    }
    return (
      <div className={className}>
        <WarningModal
          isOpen={warningModalOpen}
          handleClose={handleWarningModalClose}
          onCancel={handleWarningModalClose}
          continueLabel="SWITCH"
          header="ARE YOU SURE?"
          text={`Switching stall rate will unassign stalls ${currentStallsNames} ${getRateName()}.
            Are you sure you want to switch stall rate?`}
          onContinue={() => {
            setFieldValue('selectedStalls', []);
            setWarningModalOpen(false);
          }}
        />
        <Grid className={`${className}__available-stalls-container`} container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormSelect
              className={`${className}__available-events`}
              key={buildings?.name}
              cb={e => setBuildingId(e.target.value)}
              label="STALL LOCATION"
              options={formatBuildingValues()}
              selectedOption={buildingId}
              shrink={Boolean(reservationEdit || buildingId)}
            />
            <div className={`${className}__available-stalls`}>
              {availableStalls.length > 0 &&
                availableStalls.map((stall, index) => (
                  <StallButton id={index} key={stall.id} stall={stall} isActive={isStallSelected(stall)} onClick={toggleStall} />
                ))}
            </div>
          </Grid>
          <Grid className={`${className}__selected-stalls--container${reservationEdit ? 'edit' : ''}`} item xs={12} md={6}>
            {renderHeadingContainer()}
            <div className={`${className}__selected-stalls--stalls-container`}>
              {selectedStallsList(selectedStalls)?.map((stall, index) => (
                <StallButton
                  id={`${index}-assigned`}
                  key={stall ? stall.id : `emptyStall_${index}`}
                  stall={stall}
                  isActive={isStallSelected(stall)}
                  onClick={toggleStall}
                  unavailable={!allStallsObj[stall ? `${stall.id}-${stall.building.id}` : ''] && hasDatesDifference}
                />
              ))}
            </div>
          </Grid>
        </Grid>
        {errors.selectedStalls && <Error label={errors.selectedStalls} id="selected-stalls-error" />}
      </div>
    );
  };
  return renderCardContents();
};

export default styled(StallSelection)`
  &__desc {
    margin-top: 0;
    margin-bottom: 20px;
  }

  &__available-stalls-container {
    margin-top: 1em !important;
  }

  &__assigned-stalls-count {
    font-size: 1rem;
    line-height: 25px;
  }

  &__available-stalls {
    background-color: ${colors.background.primary};
    padding: 0.5rem;
    border-radius: 5px;
    height: 250px;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: start;

    &-container {
      &&& {
        padding-right: 1rem;
      }
    }
  }

  &__selected-stalls--clear {
    font-weight: bold;
  }

  &__selected-stalls--stalls-container {
    margin-top: 10px;
  }

  &__selected-stalls--heading-container {
    .header-text-container {
      width: 100%;
      display: flex;
      flex-direction: column;

      .updated-chip-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: -10px;
      }

      .clear-button-container {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
    }
  }

  &__selected-stalls--container {
    margin-top: -45px !important;

    &edit {
      margin-top: -60px !important;
    }
  }

  &__selected-stalls {
    &--container {
      &&& {
        padding-left: 1rem;
      }
    }
    &--clear {
      text-align: right;
      margin-left: 20px;
      color: ${colors.text.link};
      ${paragraphReg}

      &disabled {
        color: ${colors.text.lightGray2};
        font-weight: bold;
        margin-left: 25px;
      }

      &-create {
        ${paragraphReg}
        color: ${colors.text.link};
      }
    }
    &--clear-container {
      &&& {
        padding: 0;
      }
    }
    &--heading-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    &--stalls-container {
      background-color: ${colors.background.primary};
      max-height: 325px;
      padding: 0.5rem;
      border-radius: 5px;
      overflow-y: auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      align-content: start;
    }
  }

  &__available-events {
    ${paragraphReg}
    color: rgb(0, 0, 0);
    font-size: 0.9375rem;
    line-height: 24px;
    margin: -10px 0 20px;
    padding: 13px 0 0;
    background-color: ${colors.background.primary} !important;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    &::placeholder {
      color: ${colors.text.secondary};
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
`;

import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Button } from '@material-ui/core';
import styled from 'styled-components';
import { useLazyQuery } from '@apollo/react-hooks';
import { useFormikContext } from 'formik';
import moment from 'moment';
import { getValueByPropPath } from '../../../../utils/objectHelpers';
import { RV_SPOT_AVAILABILITY } from '../../../../queries/RvSpotAvailability';
import IndeterminateLoading from '../../../../components/Loading/IndeterminateLoading';
import { HeadingFive } from '../../../../components/Headings';
import RvButton from '../../../../components/Button/RvButton';
import colors from '../../../../styles/Colors';
import { paragraphReg } from '../../../../styles/Typography';
import Error from '../../../../components/Alerts/Error';
import { DATE_FORMAT } from 'Helpers/DATE_FORMAT';
import UpdatedChip from './UpdatedChip';
import WarningModal from 'Components/WarningModal/WarningModal';
import { sortArrayOfObj } from 'Utils/arrayHelpers';

const RVSelection = ({ className, hasDatesDifference, hasQuantityDiff, setUnavailableProducts, isOpen }) => {
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const { values, errors, setFieldValue } = useFormikContext();
  const { initialRvProduct, selectedRvs, reservationEdit, rvProductId, rv_spot } = values;
  const { start, end } = rv_spot;
  const startDate = start ? moment(start).format(DATE_FORMAT) : null;
  const endDate = end ? moment(end).format(DATE_FORMAT) : null;
  const initialSpotsString = sortArrayOfObj(initialRvProduct?.reservation.rvSpots, 'id').reduce((acc, curr) => {
    if (acc !== '') return (acc += ', ' + curr.name);
    return (acc += curr.name);
  }, '');
  const currentSpotsString = sortArrayOfObj(selectedRvs, 'id').reduce((acc, curr) => {
    if (acc !== '') return (acc += ', ' + curr.name);
    return (acc += curr.name);
  }, '');
  const hasSpotsDiff = initialSpotsString !== currentSpotsString;

  const [getAvailableRvSpots, { data: availableRvSpotsData, error, loading }] = useLazyQuery(RV_SPOT_AVAILABILITY, {
    variables: {
      input: {
        startDate,
        endDate: endDate ?? startDate,
        productId: rvProductId,
        reservationId: reservationEdit ? initialRvProduct?.reservation.id : null
      }
    },
    fetchPolicy: 'network-only'
  });

  const selectedAssignmentsAreAvailable = useCallback(() => {
    if (!selectedRvs || !availableRvSpotsData || !reservationEdit || loading || error) return true;
    let sameRv;
    for (let rv of selectedRvs) {
      sameRv = availableRvSpotsData.rvSpotAvailability[0]?.availableSpaces.find(availableRv => availableRv.id == rv.id);
      if (!sameRv) return false;
    }
    return true;
  }, [availableRvSpotsData, availableRvSpotsData?.rvSpotAvailability, selectedRvs, reservationEdit, loading, error]);

  useEffect(() => {
    if (!availableRvSpotsData || !reservationEdit || loading || error) return;
    setWarningModalOpen(false);

    if (!selectedAssignmentsAreAvailable() && initialRvProduct?.reservation?.rvProduct?.id !== rvProductId) {
      setWarningModalOpen(true);
    }
  }, [availableRvSpotsData, reservationEdit, hasDatesDifference, hasQuantityDiff, initialRvProduct, rvProductId]);

  useEffect(() => {
    if (rvProductId) {
      getAvailableRvSpots();
    }
  }, [rvProductId]);

  useEffect(() => {
    if (reservationEdit) return;
    setFieldValue('selectedRvs', []);
  }, [rvProductId]);

  const handleWarningModalClose = () => {
    setFieldValue('rvProductId', values.initialRvProduct?.reservation?.rvProduct?.id || '');
    setFieldValue('selectedRvs', values.initialRvProduct?.reservation?.rvSpots || []);

    if (hasDatesDifference) {
      setFieldValue('rv_spot.start', moment(values.initialRvProduct?.reservation?.startDate).format('YYYY/MM/DD'));
      setFieldValue('rv_spot.end', moment(values.initialRvProduct?.reservation?.endDate).format('YYYY/MM/DD'));
    }

    setWarningModalOpen(false);
  };

  if (errors.rv_spot && reservationEdit) return <Error label={'Enter a valid quantity to assign RV spots'} />;
  if (error) {
    return 'Error fetching RV Spot availability';
  }
  if (loading) return <IndeterminateLoading />;

  let availableRvs = [];
  if (availableRvSpotsData) {
    let eventRvsAvailable = [...getValueByPropPath(availableRvSpotsData, 'rvSpotAvailability[0].availableSpaces', [])];
    availableRvs = eventRvsAvailable.sort((a, b) => (!!a && !!b ? a.name.localeCompare(b.name, 'en', { numeric: true }) : 0));
  }

  const toggleRV = clickedRv => {
    const newSelectedRvs = selectedRvs.length > 0 ? [...selectedRvs] : [];
    const index = newSelectedRvs.findIndex(rv => rv.id === clickedRv.id);
    if (index > -1) {
      newSelectedRvs.splice(index, 1);
    } else {
      if (rv_spot.quantity <= newSelectedRvs.length) return;
      newSelectedRvs.push(clickedRv);
    }
    setFieldValue('selectedRvs', newSelectedRvs);
  };

  const clearRvs = () => {
    setFieldValue('selectedRvs', []);
  };

  const isRvSelected = rv => {
    if (!rv) return false;
    const isRvActive = selectedRvs.findIndex(selectedRv => rv.id === selectedRv.id);
    return isRvActive > -1;
  };

  const allRvsObj = {};
  const alreadyBookedRvs = [];
  availableRvs.forEach(r => {
    allRvsObj[r.id] = true;
  });

  selectedRvs.forEach(rv => {
    if (!allRvsObj[rv.id]) {
      alreadyBookedRvs.push(rv);
    }
  });

  if (alreadyBookedRvs.length && hasDatesDifference && isOpen) setUnavailableProducts(alreadyBookedRvs);
  else if (isOpen) setUnavailableProducts([]);

  const renderHeadingContainer = () => {
    if (reservationEdit) {
      return (
        <div className={`${className}__selected-rvs--heading-container`}>
          <div className="header-text-container">
            <div className="updated-chip-container">
              <HeadingFive label={'Assigned Spots'} />
              {hasSpotsDiff && reservationEdit && <UpdatedChip />}
            </div>
            <div className="clear-button-container">
              <span className={`${className}__assigned-spots-count`}>{`${selectedRvs.length + '/' + rv_spot.quantity} spots assigned`}</span>
              <Button className={`${className}__selected-rvs--clear-container`} disabled={!selectedRvs.length} onClick={clearRvs}>
                <span className={`${className}__selected-rvs--clear${selectedRvs.length ? '' : 'disabled'}`}>CLEAR</span>
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={`${className}__selected-rvs--heading-container`}>
        <HeadingFive label={'ASSIGNED SPOTS'} />
        <Button className={`${className}__selected-rvs--clear-container`} onClick={clearRvs}>
          <span className={`${className}__selected-rvs--clear-create`}>CLEAR ALL</span>
        </Button>
      </div>
    );
  };

  const selectedRvsList = selectedRvs => {
    const rvsToRender = [];
    selectedRvs.forEach(rv => rvsToRender.push(rv));
    rvsToRender.sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }));
    for (let i = 1; i <= rv_spot.quantity - selectedRvs.length; i++) {
      rvsToRender.push(null);
    }
    return rvsToRender;
  };

  const renderCardContents = () => {
    if (errors.availability && errors.availability !== 'oneNightFullyBooked') {
      return <p>Spot Selection unavailable</p>;
    }
    return (
      <div className={className}>
        <WarningModal
          isOpen={warningModalOpen}
          handleClose={handleWarningModalClose}
          onCancel={handleWarningModalClose}
          continueLabel="SWITCH"
          header="ARE YOU SURE?"
          text={`Switching lots will unassign spots ${currentSpotsString}${
            values.initialRvProduct?.reservation?.rvProduct?.name ? ` in ${values.initialRvProduct.reservation.rvProduct.name}` : ''
          }. Are you sure you want to switch lots?`}
          onContinue={() => {
            setFieldValue('selectedRvs', []);
            setWarningModalOpen(false);
          }}
        />
        <Grid className={`${className}__available-rvs--container`} container spacing={2}>
          <Grid item xs={12} md={6}>
            <div className={`${className}__available-rvs`}>
              {availableRvs.length > 0 &&
                availableRvs.map((rv, index) => <RvButton id={index} key={rv.id} rv={rv} isActive={isRvSelected(rv)} onClick={toggleRV} />)}
            </div>
          </Grid>
          <Grid className={`${className}__selected-rvs--container${reservationEdit ? 'edit' : ''}`} item xs={12} md={6}>
            {renderHeadingContainer()}
            <div className={`${className}__selected-rvs--rvs-container`}>
              {selectedRvsList(selectedRvs).map((rv, index) => (
                <RvButton
                  unavailable={!allRvsObj[rv ? rv.id : ''] && hasDatesDifference}
                  id={`${index}-assigned`}
                  key={rv ? rv.id : `emptyStall_${index}`}
                  rv={rv}
                  isActive={isRvSelected(rv)}
                  onClick={toggleRV}
                />
              ))}
            </div>
          </Grid>
        </Grid>
        {errors.selectedRvs && <Error label={errors.selectedRvs} id="selected-rvs-error" />}
      </div>
    );
  };

  return renderCardContents();
};

export default styled(RVSelection)`
  &__desc {
    margin-bottom: 20px;
  }

  &__selected-rvs--clear-container {
    position: absolute;
    left: 110px;
  }

  &__selected-rvs--clear {
    font-weight: bold;
  }

  &__available-rvs--container {
    &:first-child {
      padding-top: 10px;
    }
  }

  &__assigned-spots-count {
    font-size: 1rem;
    line-height: 25px;
  }

  &__available-rvs {
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

  &__selected-rvs--container {
    margin-top: 15px !important;

    &edit {
      margin-top: 0;
    }
  }

  &__selected-rvs--heading-container {
    .header-text-container {
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
        justify-content: 'space-between';
        width: 100%;
      }
    }
  }

  &__selected-rvs {
    &--container {
      &&& {
        padding-left: 1rem;
      }
    }
    &--clear {
      margin-left: 20px;
      text-align: right;
      color: ${colors.text.link};
      ${paragraphReg}

      &-create {
        ${paragraphReg}
        color: ${colors.text.link};
        margin-left: -230px;
      }

      &disabled {
        margin-left: 25px;
        color: ${colors.text.lightGray2};
        font-weight: bold;
      }
    }
    &--clear-container {
      &&& {
        padding: 0;
      }
    }
    &--heading-container {
      margin-top: -50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    &--rvs-container {
      background-color: ${colors.background.primary};
      padding: 0.5rem;
      border-radius: 5px;
      max-height: 250px;
      overflow-y: auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      margin-top: 10px;
      align-content: start;
    }
  }

  &__available-events {
    ${paragraphReg}
    color: rgb(0, 0, 0);
    font-size: 0.9375rem;
    line-height: 24px;
    margin: 20px 0;
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

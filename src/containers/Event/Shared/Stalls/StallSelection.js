//@flow
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Add, Clear } from '@material-ui/icons';
import styled from 'styled-components';
import { useFormikContext } from 'formik';

import CheckboxThemed from '../Checkbox';
import colors from '../../../../styles/Colors';
import type { EventFormType } from '../Form';
import type { BuildingType } from '../../../../queries/Admin/CreateEvent/CreateEventsStalls';
import { HeadingFour } from 'Components/Headings';

const checkboxChangeHandlerHelper = (stallsPerBuilding, stallsForThisRate, setFieldValue, index, buildingId) => e => {
  if (!stallsPerBuilding) return;
  if (e.target.checked) {
    const { availableStalls: stallsToMap } = stallsPerBuilding.find(b => b.id === buildingId) || { availableStalls: [] };
    const stallsToPush = stallsToMap.map(stall => stall.id);
    const s = new Set(stallsForThisRate.concat(stallsToPush));
    setFieldValue(`stalls[${index}].stallsForThisRate`, Array.from(s));
  } else {
    if (!stallsForThisRate.length) return;
    const { availableStalls: stallsToMap } = stallsPerBuilding.find(b => b.id === buildingId) || { availableStalls: [] };
    const stallsToRemove = stallsToMap.map(stall => stall.id);
    const s = new Set(stallsToRemove);
    const updatedList = stallsForThisRate.filter(stallId => !s.has(stallId));
    setFieldValue(`stalls[${index}].stallsForThisRate`, updatedList);
  }
};

const stallClickHandlerHelper = (isSelected, stall, stallsForThisRate, setFieldValue, index) => e => {
  e.preventDefault();
  if (isSelected) {
    const s = new Set(stallsForThisRate);
    s.delete(stall.id);
    setFieldValue(`stalls[${index}].stallsForThisRate`, Array.from(s));
  } else {
    stallsForThisRate.push(stall.id);
    setFieldValue(`stalls[${index}].stallsForThisRate`, stallsForThisRate);
  }
};

type StallSelectionPropType = {|
  className: string,
  index: number,
  stallsPerBuilding: Array<BuildingType> | null
|};

const StallSelectionBase = ({ className, stallsPerBuilding, index }: StallSelectionPropType) => {
  const { values, setFieldValue } = useFormikContext<EventFormType>();
  const { stalls: formikStateStallsProp, hasStalls } = values;
  const singleProduct = values['stalls'].length ? values['stalls'][0] : '';
  const { stallsForThisRate } = formikStateStallsProp[index];
  const disableSelectAll = !stallsPerBuilding || !hasStalls || stallsForThisRate.length === 0;
  const deSelectAll = event => {
    event.preventDefault();
    setFieldValue(`stalls[${index}].stallsForThisRate`, []);
  };

  const selectAll = event => {
    event.preventDefault();
    const allStalls =
      stallsPerBuilding &&
      stallsPerBuilding.reduce((acc, building) => {
        acc = acc.concat(building.availableStalls.map(stall => stall.id));
        return acc;
      }, []);
    setFieldValue(`stalls[${index}].stallsForThisRate`, allStalls);
  };

  return (
    <div className={className}>
      <div className="heading-wrapper">
        <HeadingFour label={`Stalls for this Rate (${stallsForThisRate.length})`} />
        <span className="buttons-wrapper">
          <Button className={disableSelectAll ? 'disabled-button' : 'active-button'} onClick={deSelectAll} disabled={disableSelectAll}>
            DESELECT ALL
          </Button>
          <Button
            className={!stallsPerBuilding || !hasStalls ? 'disabled-button' : 'active-button'}
            onClick={selectAll}
            disabled={!stallsPerBuilding || !hasStalls}>
            SELECT ALL
          </Button>
        </span>
      </div>
      <AccordionStyled>
        {stallsPerBuilding &&
          stallsPerBuilding.map(building => {
            const { id: buildingId, name, availableStalls: unsortedStalls } = building;
            const stalls = unsortedStalls.sort((a, b) => (!!a && !!b ? a.name.localeCompare(b.name, 'en', { numeric: true }) : 0));
            const totalPossible = stalls.length;
            const numSelected = stalls.filter(stall => !!stallsForThisRate.find(v => v === stall.id)).length;
            const key = `${buildingId}-${name}`;
            const label = `${name.toUpperCase()} (${numSelected}/${totalPossible})`;
            const checked = numSelected === totalPossible;
            const indeterminate = numSelected !== 0 && numSelected < totalPossible;
            const checkboxChangeHandler = checkboxChangeHandlerHelper(stallsPerBuilding, stallsForThisRate, setFieldValue, index, buildingId);
            return (
              <Accordion key={key} disabled={!hasStalls}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id={`building-${buildingId}`}>
                  <FormControlLabel
                    aria-label="Acknowledge"
                    onClick={event => event.stopPropagation()}
                    onFocus={event => event.stopPropagation()}
                    control={
                      <CheckboxThemed onChange={checkboxChangeHandler} checked={checked} indeterminate={indeterminate} disabled={!hasStalls || checked} />
                    }
                    label={label}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <ul className="stall-selection-per-building">
                      {stalls.map(stall => {
                        const isSelected = stallsForThisRate.find(stallId => stallId === stall.id);
                        const className = singleProduct?.booked && isSelected ? 'disabled selected' : isSelected ? 'selected' : '';

                        const disableClickHandler = () => false;
                        const clickHandler = !isSelected
                          ? stallClickHandlerHelper(isSelected, stall, stallsForThisRate, setFieldValue, index)
                          : disableClickHandler;

                        return (
                          // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                          <li key={`stall-${stall.id}`} className={`stall-listing ${className}`} onClick={clickHandler}>
                            <span className="stall-name">{stall.name}</span>
                            {(isSelected && singleProduct?.booked) || isSelected ? <Clear /> : <Add />}
                          </li>
                        );
                      })}
                    </ul>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
      </AccordionStyled>
    </div>
  );
};

const StallSelection = styled(StallSelectionBase)`
  & {
    display: block;
    margin: 0;
    padding: 0;

    .heading-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      h4 {
        display: inline-flex;
        margin-bottom: 10px;
      }
    }

    .buttons-wrapper {
      display: inline-flex;
      transform: translate(10px, 0px);
    }

    .active-button {
      letter-spacing: 1.5px;
      color: ${colors.secondary};
      margin-top: -3px;
      border-bottom: #ffffff solid 1px;
    }

    .disabled-button {
      letter-spacing: 1.5px;
      color: ${colors.text.lightGray2};
      margin-top: -3px;
      border-bottom: #ffffff solid 1px;
    }
  }
`;

const StallsAccordionWrapper = ({ className, children }) => <div className={`${className} stalls-accordion-wrapper`}>{children}</div>;

const AccordionStyled = styled(StallsAccordionWrapper)`
  .stall-selection-per-building {
    list-style: none;
    display: flex;
    flex-direction: row;
    flex-flow: wrap;
    width: inherit;
    margin: 0;
    padding: 0 0 0 20px;
    justify-content: flex-start;

    li {
      cursor: pointer;
      display: inline-flex;
      width: 22%;
      height: 42px;
      margin-right: 10px;
      margin-bottom: 10px;
      border-radius: 3px;
      justify-content: space-between;
      background-color: ${colors.background.primary};
      border: 1px solid ${colors.text.lightGray2};
      color: ${colors.text.lightGray2};

      &.selected {
        background-color: ${colors.secondary};
        border: none;
        color: white;
      }

      &.disabled {
        background-color: ${colors.button.secondary.active};
        border: none;
        color: white;
        cursor: auto;
      }

      .stall-name {
        padding: 10px 0 0 10px;
        user-select: none;
      }

      .MuiSvgIcon-root {
        transform: translate(-5px, 10px);
        transition: 0s ease-in, color 0s;
      }
    }
  }

  &.stalls-accordion-wrapper {
    border-radius: 5px;
    margin-top: -12px;
  }

  &&& {
    .MuiAccordion-root:before {
      background: none;
    }

    .MuiPaper-root {
      transition: none;
      margin: 0;
      background-color: ${colors.background.primary};
    }

    .MuiPaper-root:first-child {
      margin-top: 12px;
    }

    .MuiPaper-root:last-child {
      margin-bottom: 12px;
    }

    .MuiPaper-elevation1 {
      box-shadow: none;
    }

    .MuiAccordionSummary-content {
      margin: 0;
    }

    .MuiAccordionDetails-root {
      padding: 0 16px;
    }

    .MuiTypography-root {
      width: 100%;
      margin-bottom: 0;
    }

    .MuiCheckbox-indeterminate {
      color: ${colors.secondary};
    }
  }
`;

export default StallSelection;

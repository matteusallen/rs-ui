// @flow
import React, { PureComponent } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button, Divider } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import styled from 'styled-components';

import FilterFields from './FilterFields';
import FilterChips from './FilterChips';

import colors from '../../styles/Colors';
import { displayFlex } from '../../styles/Mixins';
import { paragraphReg } from '../../styles/Typography';
import type { FiltersType } from '../Table';

type ExpandPanelPropsType = {|
  className: string,
  filters: FiltersType,
  onClearFilters: () => void,
  onClearSingleFilter: () => void,
  onSubmit: () => void
|};

type ExpandPanelStateType = {|
  expanded: boolean
|};

export class FiltersBase extends PureComponent<ExpandPanelPropsType, ExpandPanelStateType> {
  state = {
    expanded: false
  };

  togglePanel = () => {
    return this.setState(state => {
      const newExpanded = !state.expanded;
      return { expanded: newExpanded };
    });
  };

  applyFilters = () => {
    this.props.onSubmit();
    this.togglePanel();
  };

  render() {
    const { className, filters, onClearFilters, onClearSingleFilter } = this.props;
    const { expanded } = this.state;
    return (
      <>
        <Accordion expanded={expanded} className={className}>
          <PanelSummary className={`${className}__PanelSummary`}>
            <div className={`${className}__flex-wrapper--summary`}>
              <Button onClick={this.togglePanel} data-testid="filters-toggle">
                <FilterIcon />
                <TitleText className={`${className}__flex-wrapper--title`}>{!expanded ? `SHOW FILTERS` : `HIDE FILTERS`}</TitleText>
              </Button>
              <FilterChips expanded={expanded} filters={filters} onClearSingleFilter={onClearSingleFilter} />
            </div>
          </PanelSummary>
          <AccordionDetails className={`${className}__PanelDetails`}>
            <FilterFields filters={filters} />
            <div className={`${className}__flex-wrapper--buttons`}>
              <ButtonClear onClick={() => onClearFilters()} variant="outlined">
                Clear
              </ButtonClear>
              <ButtonApply onClick={this.applyFilters} data-testid="filters-apply-btn">
                Apply
              </ButtonApply>
            </div>
          </AccordionDetails>
        </Accordion>
        <Divider />
      </>
    );
  }
}

const FilterIcon = styled(FilterListIcon)`
  &&& {
    fill: ${colors.text.darkBlue};
  }
`;

const PanelSummary = styled(AccordionSummary)`
  &&& {
    margin: 0;
    padding: 0 24px 0 22px;
    * {
      margin: 0;
    }
  }
`;

const TitleText = styled.span`
  padding-left: 8px;
  color: ${colors.text.darkBlue};
  ${paragraphReg}
`;
const ButtonClear = styled(Button)`
  &&& {
    ${paragraphReg}
    width: 100px;
    height: 36px;
  }
`;
const ButtonApply = styled(Button)`
  &&& {
    ${paragraphReg}
    background-color: ${colors.button.secondary.active};
    color: ${colors.white};
    margin-left: 18px;
    width: 100px;
    height: 36px;
  }
`;

const Filters = styled(FiltersBase)`
  &&& {
    box-shadow: none;
    &__filter-button--apply {
      background-color: black;
    }
  }

  &__flex-wrapper--summary {
    ${displayFlex}
    flex-direction: row;
    align-items: center;
    width: 100%;
    position: absolute;
    top: 6px;
  }

  &__flex-wrapper--buttons {
    ${displayFlex}
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 4px;
  }
  &__PanelDetails {
    justify-content: space-between;
    align-items: center;
    padding: 0 24px !important;
  }
`;

export default Filters;

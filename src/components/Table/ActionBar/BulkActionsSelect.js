// @flow
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import Tooltip from '@material-ui/core/Tooltip';

import { compose } from 'recompose';

import { SimpleSelect } from '../../Select';

import { TableContext } from '../TableContext';
import SendAssignmentsModal from '../modals/SendAssignmentsModal';
import SendCustomMessageModal from '../modals/SendCustomMessageModal';
import ContextSnackbar from '../../Snackbar';

import { withSnackbarContextActions } from '../../../store/SnackbarContext';
import type { ShowSnackbarType } from '../../../store/SnackbarContext';

export type BulkActionsPropsType = {|
  className: string,
  showSnackbar: ShowSnackbarType
|};

const getAssignmentsModal = (assignmentsModalVisible, customSMSModalVisible, setAssignmentsModalVisible, selectedKey, selectedRows, onSuccess, onError) => {
  if (customSMSModalVisible || !assignmentsModalVisible) return null;

  return (
    <SendAssignmentsModal
      productType={selectedKey}
      open={assignmentsModalVisible}
      toggleAssignmentsModalVisible={setAssignmentsModalVisible}
      selectedRows={selectedRows || []}
      onClose={setAssignmentsModalVisible}
      onError={onError}
      onSuccess={onSuccess}
    />
  );
};

const getCustomMessageModal = (assignmentsModalVisible, customSMSModalVisible, setCustomSMSModalVisible, selectedRows, onSuccess, onError) => {
  if (!customSMSModalVisible || assignmentsModalVisible) return null;

  return (
    <SendCustomMessageModal
      selectedRows={selectedRows || []}
      open={customSMSModalVisible}
      toggleCustomMessageModal={setCustomSMSModalVisible}
      onError={onError}
      onSuccess={onSuccess}
    />
  );
};

const BulkActionsComponent = (props: BulkActionsPropsType) => {
  const { className, showSnackbar } = props;
  const tableContextRef = useContext(TableContext);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [assignmentsModalVisible, setAssignmentsModalVisible] = useState(false);
  const [customSMSModalVisible, setCustomSMSModalVisible] = useState(false);
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const showTooltip = () => {
    setTooltipVisible(true);
  };

  const hideTooltip = () => {
    setTooltipVisible(false);
  };

  const options = [
    { value: 0, label: 'Bulk Actions' },
    { value: 'stalls', label: 'Send Stall Assignments' },
    { value: 'rvs', label: 'Send RV Spot Assignments' },
    { value: 'custom', label: 'Send Custom Message' }
  ];

  const handleSelect = event => {
    setSelectedIndex(event.target.value);
    if (event.target.value !== 0) {
      if (event.target.value === 'custom') {
        setCustomSMSModalVisible(true);
      } else {
        setAssignmentsModalVisible(true);
      }
    } else {
      setAssignmentsModalVisible(false);
      setCustomSMSModalVisible(false);
    }
  };

  /** To open snackbar. Modal will close after sending this message */
  const handleError = message => {
    showSnackbar(message, {
      error: true
    });
  };

  const handleSuccess = message => {
    showSnackbar(message);
  };

  // Set to first item in dropdown on start
  useEffect(() => {
    setSelectedIndex(0);
  }, []);

  // Reset the select when modals are closed
  useEffect(() => {
    if (!assignmentsModalVisible && !customSMSModalVisible) {
      setSelectedIndex(0);
    }
  }, [assignmentsModalVisible, customSMSModalVisible]);

  useEffect(() => {
    setIsDisabled(tableContextRef.selectedRows.length < 1);
  }, [tableContextRef.selectedRows]);

  return (
    <>
      {/* Styled div with tooltip that looks like select control if disabled */}
      {isDisabled && (
        <Tooltip id="bulk-action-tooltip" open={isTooltipVisible} title="Select one or more reservations in order to complete bulk actions" placement="right">
          <div
            id="bulk-action-comp"
            className={`${className}__bulk_info  disabled`}
            onMouseOver={showTooltip}
            onFocus={showTooltip}
            onBlur={showTooltip}
            onMouseOut={hideTooltip}
            onMouseLeave={hideTooltip}
            role="button"
            tabIndex="0">
            Bulk Actions
            <svg className="MuiSvgIcon-root MuiSelect-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </div>
        </Tooltip>
      )}

      {!isDisabled && (
        <div id="bulk-action-comp" className={`${className}__bulk_info`}>
          <ContextSnackbar />
          <SimpleSelect
            id="bulk-actions-select"
            value={selectedIndex}
            label={'Bulk Actions'}
            hasLabel={false}
            cb={handleSelect}
            className={`${className}__bulk_info_select`}
            firstMenuItemStyle={{ borderBottom: '1px solid #d4d4d4' }}
            options={options}
          />
          {getAssignmentsModal(
            assignmentsModalVisible,
            customSMSModalVisible,
            setAssignmentsModalVisible,
            selectedIndex,
            tableContextRef.selectedRows,
            handleSuccess,
            handleError
          )}
          {getCustomMessageModal(
            assignmentsModalVisible,
            customSMSModalVisible,
            setCustomSMSModalVisible,
            tableContextRef.selectedRows,
            handleSuccess,
            handleError
          )}
        </div>
      )}
    </>
  );
};

const BulkActionsSelect = styled(BulkActionsComponent)`
  &__bulk_info {
    display: flex;
    align-items: center;
    cursor: pointer;
    &.disabled {
      color: rgba(0, 0, 0, 0.5);
      background-color: #ffffff;
      font-family: 'IBMPlexSans-Bold';
      font-size: 16px;
      padding-left: 10px;
      padding-top: 6px;
      padding-bottom: 7px;
      box-shadow: 0 2px 6px rgba(17, 24, 31, 0.03), 0 2px 3px rgba(17, 24, 31, 0.1);
      svg {
        position: relative;
        margin-left: 2px;
      }
    }
    &.disabled:active {
      box-shadow: 0 4px 8px rgba(17, 24, 31, 0.03), 3px 4px 5px rgba(17, 24, 31, 0.1);
    }
    &.disabled:focus {
      outline: none;
    }
  }

  &__bulk_info_select {
    height: 37px;
    margin-right: 7px !important;
    display: flex;
    flex-direction: row;
    box-shadow: 0 2px 6px rgba(17, 24, 31, 0.03), 0 2px 3px rgba(17, 24, 31, 0.1);

    .MuiInputBase-input {
      padding-bottom: 6px;
    }

    .MuiInputBase-formControl {
      background-color: white;
      height: 37px;
      .MuiSelect-root {
        font-family: 'IBMPlexSans-Bold';
        font-size: 16px;
        text-transform: none;
        padding-left: 7px;
      }
    }
  }
`;

export default compose(withSnackbarContextActions)(BulkActionsSelect);

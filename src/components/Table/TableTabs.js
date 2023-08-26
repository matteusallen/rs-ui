import React from 'react';
import styled from 'styled-components';

import SelectFilter from './Filters/SelectFilter';

const TableTabsBase = props => {
  const { className, count, checkingInCount, checkingOutCount, ordering, setOrdering, checkInOutFilter, setCheckInOutFilter, filters } = props;

  const handleOrder = event => {
    setOrdering(event.target.value === 'ASC' ? ['lastName', 'ASC'] : ['lastName', 'DESC']);
  };

  const switchTabs = tab => {
    switch (tab) {
      case 'checkin':
        setCheckInOutFilter({ checkInOnly: true, checkOutOnly: false });
        break;
      case 'checkout':
        setCheckInOutFilter({ checkInOnly: false, checkOutOnly: true });
        break;
      default:
        setCheckInOutFilter({ checkInOnly: false, checkOutOnly: false });
        break;
    }
  };

  return (
    <>
      <ul className={`${className}__table-tabs`}>
        <li className={!checkInOutFilter.checkInOnly && !checkInOutFilter.checkOutOnly ? 'active' : ''}>
          <button type="button" onClick={() => switchTabs('all')}>
            {' '}
            All <span className="counter">{count}</span>
          </button>
        </li>
        {filters.startDate && (
          <>
            <li className={checkInOutFilter.checkInOnly && !checkInOutFilter.checkOutOnly ? 'active' : ''}>
              <button type="button" onClick={() => switchTabs('checkin')}>
                Checking In <span className="counter">{checkingInCount}</span>
              </button>
            </li>
            <li className={!checkInOutFilter.checkInOnly && checkInOutFilter.checkOutOnly ? 'active' : ''}>
              <button type="button" onClick={() => switchTabs('checkout')}>
                Departing <span className="counter">{checkingOutCount}</span>
              </button>
            </li>
          </>
        )}
      </ul>
      <div className={`${className}__table-order-select-wrapper`}>
        <SelectFilter
          className={`${className}__table-order-select`}
          field={{ name: 'lastName' }}
          onChange={handleOrder}
          fieldlabel=""
          noempty="true"
          value={ordering[1] === 'ASC' ? 'ASC' : 'DESC'}
          options={[
            { value: 'ASC', name: 'LastName A-Z' },
            { value: 'DESC', name: 'LastName Z-A' }
          ]}
        />
      </div>
    </>
  );
};

const TableTabs = styled(TableTabsBase)`
  &__table-tabs {
    display: flex;
    margin-left: 20px;
    padding-left: 0;
    margin-bottom: 0;

    li {
      list-style: none;
      margin-right: 30px;

      button {
        text-transform: uppercase;
        color: #333;
        font-size: 22px;
        font-weight: bold;
        background: transparent;
        border: 0;
        padding: 0;
        letter-spacing: 2px;
      }
    }

    .active {
      border-bottom: #2573c2 4px solid;

      button {
        color: #2573c2;
      }

      .counter {
        background: #2573c2;
      }
    }

    .counter {
      background: #333;
      color: white;
      font-size: 10px;
      display: inline-block;
      position: relative;
      top: -4px;
      padding: 2px 2px 3px 4px;
      font-weight: normal;
      border-radius: 4px;
    }
  }

  &__table-order-select-wrapper {
    display: flex;
    flex-direction: row-reverse;
    margin-right: 23px;
  }

  &__table-order-select {
    width: 170px;
    height: 20px;

    .MuiOutlinedInput-notchedOutline {
      border: 0;
    }

    .MuiSelect-outlined.MuiSelect-outlined {
      background: white;
      height: 30px;
      padding: 10px 25px 0 10px;
      box-shadow: 0 2px 6px rgba(17, 24, 31, 0.03), 0 2px 3px rgba(17, 24, 31, 0.1);
    }

    .MuiOutlinedInput-input {
      padding: 0;
    }

    .MuiSelect-iconOutlined {
      right: 18px;
      color: #29b490;
    }

    .MuiInputBase-root {
      padding: 10px 14px;
    }
  }
`;

export default TableTabs;

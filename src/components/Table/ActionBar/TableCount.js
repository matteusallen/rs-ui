import React from 'react';
import styled from 'styled-components';

import IndeterminateLoading from '../../Loading/IndeterminateLoading';

const TableCountCountComponent = props => {
  const { className, count, filters, checkingInCount, checkingOutCount, checkInOutFilter, setCheckInOutFilter, loading } = props;

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
    <ul className={`${className}__table-count`}>
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
      <li>
        {loading && (
          <div className={`${className}__empty-list`}>
            <IndeterminateLoading size="25px" />
          </div>
        )}
      </li>
    </ul>
  );
};

const TableCount = styled(TableCountCountComponent)`
  &__table-count {
    display: flex;
    margin-left: 50px;
    padding-left: 0;
    margin-bottom: 28px;

    .MuiCircularProgress-root {
      position: relative;
      top: 5px;
    }

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
        cursor: pointer;
      }
      button:focus {
        outline: none;
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
`;
export default TableCount;

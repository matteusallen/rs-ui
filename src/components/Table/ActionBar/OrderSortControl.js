import React from 'react';
import styled from 'styled-components';

import SelectFilter from '../Filters/SelectFilter';

const OrderSortControlComponent = props => {
  const { className, ordering, setOrdering } = props;

  const handleOrder = event => {
    sessionStorage.setItem('reservationsOrder', event.target.value);
    setOrdering(event.target.value);
  };

  return (
    <SelectFilter
      className={`${className}__table-order-select`}
      field={{ name: 'orderBy' }}
      onChange={handleOrder}
      fieldlabel=""
      noempty="true"
      value={ordering}
      options={[
        { value: 'updatedAt_DESC', name: 'Last Edited' },
        { value: 'createdAt_DESC', name: 'Newest Created' },
        { value: 'createdAt_ASC', name: 'Oldest Created' },
        { value: 'lastName_ASC', name: 'Last Name (A-Z)' },
        { value: 'lastName_DESC', name: 'Last Name (Z-A)' }
      ]}
    />
  );
};

const OrderSortControl = styled(OrderSortControlComponent)`
  &__table-tabs {
    display: flex;
    margin-left: 20px;
    padding-left: 0;
    margin-bottom: 0;
  }

  &__table-order-select-wrapper {
    display: flex;
  }

  &__table-order-select {
    width: 200px;
    height: 37px;
    margin-left: auto;
    margin-top: 0;
    margin-bottom: 0;

    .MuiOutlinedInput-notchedOutline {
      border: 0;
    }

    .MuiSelect-outlined.MuiSelect-outlined {
      background: white;
      height: 27px;
      border-radius: 0;
      text-align: left;
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
export default OrderSortControl;

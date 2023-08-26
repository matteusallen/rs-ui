import React from 'react';
import styled from 'styled-components';

import OrdersTable from '../../containers/Tables/Admin/OrdersTable';
import ContextSnackbar from '../../components/Snackbar';

import colors from '../../styles/Colors';
import { displayFlex } from '../../styles/Mixins';

const AdminOrdersBase = props => {
  const { className } = props;

  return (
    <section className={className}>
      <ContextSnackbar />
      <OrdersTable {...props} />
    </section>
  );
};

const AdminOrders = styled(AdminOrdersBase)`
  margin: 85px 0 50px;
  min-width: 1130px;

  &__Page-Title {
    ${displayFlex}
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  &__Header {
    &&& {
      text-align: left;
      margin: 0 20px 0 0;
    }
  }

  &__Table-On {
    &&& {
      width: 100%;
      border: 1px solid ${colors.secondary};
      border-radius: 0;
      background-color: ${colors.secondary};
      color: ${colors.white};
    }
  }

  &__Table-Off {
    &&& {
      width: 100%;
      border: 1px solid ${colors.secondary};
      border-radius: 0;
      background-color: ${colors.white};
      color: ${colors.secondary};
    }
  }
`;

export default AdminOrders;

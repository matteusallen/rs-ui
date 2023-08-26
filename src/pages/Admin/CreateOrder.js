import React from 'react';
import styled from 'styled-components';
import { displayFlex } from '../../styles/Mixins';
import AdminOrderContainer from '../../containers/Order/Admin';
import { HeadingOne } from 'Components/Headings';

const AdminCreateOrderBase = props => {
  const { className } = props;
  return (
    <>
      <section className={className}>
        <FlexWrapper>
          <div className="header">
            <HeadingOne label="CREATE RESERVATION" />
          </div>
        </FlexWrapper>
        <AdminOrderContainer reservationEditable={false} />
      </section>
    </>
  );
};

const AdminCreateOrderStyled = styled(AdminCreateOrderBase)`
  margin: 85px 50px 50px;
  .header {
    margin: 0 0 20px;
  }
`;
const FlexWrapper = styled.div`
  ${displayFlex}
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export default AdminCreateOrderStyled;

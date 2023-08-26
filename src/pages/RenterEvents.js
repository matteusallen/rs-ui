// @flow
import React, { memo } from 'react';
import styled from 'styled-components';

import RentableEventsList from '../containers/RenterEvents';
import Footer from '../containers/Footer';

type RenterEventsPropsType = {|
  className: string
|};
const RenterEventsBase = (props: RenterEventsPropsType) => {
  const { className } = props;
  return (
    <>
      <section className={className}>
        <RentableEventsList limit={10} infiniteScroll />
      </section>
      <Footer />
    </>
  );
};

const RenterEventsStyle = styled(RenterEventsBase)`
  margin: 26px 0 0;

  @media screen and (max-width: 600px) {
    margin: 0 0 80px;
  }

  @media screen and (min-width: 960px) {
    margin: 70px auto 0 auto;
    max-width: 1800px;
    min-width: 1130px;
    height: calc(100% - 195px);
  }
`;

export default memo<{}>(RenterEventsStyle);

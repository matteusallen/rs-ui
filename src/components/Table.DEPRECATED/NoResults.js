import React from 'react';
import styled from 'styled-components';

import { paragraphReg } from '../../styles/Typography';

export const NoResultsBase = props => {
  return <p className={props.className}>NO RESULTS FOUND WITH CURRENT FILTERS</p>;
};

const NoResults = styled(NoResultsBase)`
  margin-top: 48px;
  height: 300px;
  ${paragraphReg}
`;

export default NoResults;

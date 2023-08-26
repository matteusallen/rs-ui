import React from 'react';
import styled from 'styled-components';

const RowStatBase = props => {
  const { className, value, title } = props;

  return (
    <div className={`${className}__row-stat ${value < 1 ? 'num-zero' : ''}`}>
      <div className="number">{value}</div>
      <div className="title">{title}</div>
    </div>
  );
};

const RowStat = styled(RowStatBase)`
  &__row-stat {
    text-align: center;
    width: 100px;

    &.num-zero {
      opacity: 20%;
    }

    .number {
      font-weight: bold;
      font-size: 24px;
    }

    .title {
      text-transform: uppercase;
      font-size: 13px;
    }
  }
`;

export default RowStat;

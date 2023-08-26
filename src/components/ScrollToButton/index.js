import React from 'react';
import styled from 'styled-components';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

const ScrollToButtonBase = props => {
  const { onClick, start, style } = props;
  const hide = start === 1 ? 'hide' : null;

  return (
    <>
      <button className={`${props.className}__scrollto ${hide}`} onClick={onClick} type="button" style={style}>
        <ArrowUpwardIcon />
        Top
      </button>
    </>
  );
};

const ScrollToButton = styled(ScrollToButtonBase)`
  &__scrollto {
    width: 40px;
    height: 40px;
    border-radius: 3px;
    z-index: 100000;
    background: #2875c3;
    border: 0;
    color: white;
    text-transform: uppercase;
    font-size: 11px;
    text-align: center;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(17, 24, 31, 0.03), 0 2px 3px rgba(17, 24, 31, 0.1);

    &.hide {
      display: none;
    }

    svg {
      with: 24px;
      height: 24px;
      margin-bottom: -7px;
      position: relative;
      top: -2px;
    }
  }
`;

export default ScrollToButton;

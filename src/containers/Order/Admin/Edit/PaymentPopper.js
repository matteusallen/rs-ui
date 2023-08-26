//@flow
import React, { useState } from 'react';
import { Popper, IconButton, ClickAwayListener } from '@material-ui/core';
import { Info } from '@material-ui/icons';
import styled from 'styled-components';
import colors from '../../../../styles/Colors';

type RefElementType = null | HTMLElement;

const PaymentPopper = ({ className, notes = '' }: { className: string, notes: string }) => {
  const [ref, setRef] = useState<RefElementType>(null);
  const [arrowRef, setArrowRef] = useState<RefElementType>(null);
  const id = ref ? 'PaymentPopper' : undefined;

  return (
    <ClickAwayListener onClickAway={() => setRef(null)}>
      <div className={`${className} paymentPopper`}>
        <Popper
          id={id}
          className="popper"
          open={Boolean(ref)}
          anchorEl={ref}
          placement="top"
          disablePortal
          modifiers={{
            flip: {
              enabled: true
            },
            arrow: {
              enabled: true,
              element: arrowRef
            }
          }}>
          <div className={'container'}>
            <div className={'content'}>
              <p>Refund Reason</p>
              {notes.split('\n').map(i => {
                return (
                  <>
                    {i}
                    <br />
                  </>
                );
              })}
            </div>
            <span
              className="arrow"
              // $FlowIgnore
              ref={(el: HTMLElement<HTMLSpanElement>) => setArrowRef(el)}
            />
          </div>
        </Popper>
        <IconButton
          aria-describedby={id}
          // $FlowIgnore
          onClick={(e: SyntheticEvent) => setRef(ref ? null : e.currentTarget)}>
          <Info style={{ color: colors.text.primary }} />
        </IconButton>
      </div>
    </ClickAwayListener>
  );
};

const PaymentPopperStyles = styled(PaymentPopper)`
  &.paymentPopper {
    display: contents;
    .popper {
      max-width: 500px;
      top: -10px !important;
      left: -5px !important;
    }
    .container {
      background: ${colors.white};
      padding: 20px;
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.16), 0 2px 5px 0 rgba(0, 0, 0, 0.26);
      z-index: 1;
      border-radius: 5px;
      overflow: hidden;
    }
    .content {
      padding: 0;
      margin: 0;
      font-size: 16px;
      line-height: 25px;
      text-align: left;
    }
    .arrow {
      position: absolute;
      top: calc(100% - 1px);
      width: 0;
      height: 0;
      transform: rotate(-45deg);
      box-sizing: border-box;
      border: 1em solid black;
      border-color: transparent transparent #ffffff #ffffff;
      transform-origin: 0 0;
      box-shadow: -2px 2px 4px -2px rgba(0, 0, 0, 0.23);
      content: '';
    }
  }
`;

export default PaymentPopperStyles;

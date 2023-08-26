//@flow
import React from 'react';
import styled from 'styled-components';

import colors from '../../../../styles/Colors';
import { displayFlex } from '../../../../styles/Mixins';

type SidePanelLayoutPropsType = {|
  children: React$Node,
  className?: string
|};

const SidePanelLayoutBase = ({ className = '', children }: SidePanelLayoutPropsType): React$Element<'div'> => (
  <div className={className + ' order-side-panel'}>{children}</div>
);

export const SidePanelLayout = styled(SidePanelLayoutBase)`
  &.order-side-panel {
    background: ${colors.white};
    height: calc(100% - 188px);
    overflow: overlay;
    overflow-y: auto;
    width: 350px;
    right: 0;
    position: absolute;
    z-index: 2;
    ${displayFlex}
    flex-flow: column nowrap;
    top: 188px;
    box-shadow: -2px 2px 5px 0 rgba(17, 24, 31, 0.3), -2px 2px 10px 0 rgba(17, 24, 31, 0.1);
    font-family: IBMPlexSans-Regular;

    .row {
      margin: 40px 25px 0 25px;
    }

    .row-20 {
      margin: 20px 25px 0 25px;
    }

    .order-user-name {
      font-size: 22px;
      font-family: 'IBMPlexSans-SemiBold';
      line-height: 25px;
      ${displayFlex}
      flex-flow: row nowrap;
      justify-content: space-between;

      .close-icon {
        img {
          height: 14px;
        }
      }
      .close-icon:hover {
        cursor: pointer;
      }
    }

    .phone-and-updated {
      margin-top: 5px;
      text-align: left;

      .user-phone {
        font-size: 16px;
      }

      p {
        margin-bottom: 0;
        font-size: 11px;
        letter-spacing: 0.48 px;
      }
    }

    .order-text {
      font-size: 16px;
      line-height: 25px;
      text-align: left;
      margin-top: 3px;
    }

    .order-divider {
      ${displayFlex}
      flex-flow: row nowrap;
      justify-content: space-between;
      flex-grow: 1;

      .section-name {
        font-size: 18px;
        font-family: 'IBMPlexSans-SemiBold';
        line-height: 23px;
        margin-right: 10px;
      }

      .line {
        background: ${colors.border.primary};
        height: 1px;
        flex: 1;
        position: relative;
        top: 11px;
      }
    }

    .order-details {
      ${displayFlex}
      flex-flow: row wrap;
      justify-content: flex-start;
      margin-top: 15px;

      .order-col {
        margin-right: 100px;
        font-size: 16px;
        line-height: 25px;
        text-align: left;

        .heading {
          font-size: 13px;
          font-family: 'IBMPlexSans-Bold';
          line-height: 17px;
          color: ${colors.text.secondary};
        }
      }
      .order-col.last {
        margin-right: 0;
      }
      .order-col.row-below {
        margin-top: 15px;
      }
    }

    .order-select {
      margin-top: 15px;
      .MuiFormControl-root {
        display: block;
      }
      .MuiInputBase-root {
        width: 100%;
        text-align: left;
        border: ${colors.text.lightGray2} 1px solid;
        border-radius: 3px;
        padding: 0 10px;
      }
      .MuiSelect-select {
        font-size: 15px;
        line-height: 24px;
      }
      .MuiSelect-select:focus {
        background: transparent;
      }
      .MuiInput-underline:before {
        border-bottom: none;
      }
      .Mui-disabled {
        background: #c6c6c6;
        svg {
          color: #999;
        }
      }
    }

    .row-edit-button {
      position: -webkit-sticky;
      position: sticky;
      bottom: 0px;
      background-color: white;
    }

    .row {
      button {
        width: 100%;
        margin-bottom: 25px;
      }
    }

    .loading {
      ${displayFlex};
      margin-top: 150px;
      justify-content: center;
    }
  }
`;

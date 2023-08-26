import styled from 'styled-components';

import { displayFlex } from '../../../styles/Mixins';
import colors from '../../../styles/Colors';

export const EventStyles = C => styled(C)`
  & {
    ${displayFlex}
    flex-direction: column;

    .title {
      color: ${colors.text.primary};
      font-family: 'IBMPlexSans-SemiBold';
      font-size: 41px;
      letter-spacing: 1.24px;
      line-height: 50px;
      text-align: left;
      margin: 25px 0 50px;
    }

    .sub-nav {
      ${displayFlex}
      flex-flow: row;
    }
    

    .breadcrumbs,
    .actions {
      width: 50%;
    }

    .breadcrumbs {
      color: ${colors.text.primary};
      font-family: 'IBMPlexSans-SemiBold';
      font-size: 22px;
      letter-spacing: 0.97px;
      line-height: 25px;
      ${displayFlex}
    }

    .breadcrumbs-item {
      margin-left: 30px;
      color: ${colors.text.primary};
      &:hover {
        cursor: pointer;
      }
    }

    .breadcrumbs-item:first-child {
      margin-left: unset;
    }

    .breadcrumbs-item.active {
      color: ${colors.border.tertiary};
      border-bottom: 4px solid ${colors.border.tertiary};
    }

    .breadcrumbs-item.disabled {
      color: ${colors.text.secondary};
      &:hover {
        cursor: default;
      }
    }


    .actions {
      ${displayFlex}
      flex-direction: row;
      justify-content: flex-end;
    }

    .actions-item {
      margin-right: 30px;
    }

    .actions-item:last-child {
      margin-right: unset;
    }

    .MuiCard-root.card-item {
      margin: 25px 0 0;
      ${displayFlex}
      flex-flow: column;

      .heading {
        ${displayFlex}
        justify-content: space-between;
        flex-direction: row;
        border-bottom: 1px solid ${colors.border.primary};
        margin: 0 0 20px;

        a {
          padding: 3px 0;
          color: #2875C3;
          font-family: "IBMPlexSans-Regular";
          font-size: 15px;
          letter-spacing: 1.05px;
          line-height: 17px;

          svg {
            position: relative;
            top: 6px;
          }
          &:hover {
            cursor: pointer;
          }
        }
      }
    }

    .card-item:last-child {
      margin-bottom: 45px;
    }

    .card-item.disabled {
      margin-bottom: 45px;
      opacity: 0.3;
    }

    .card-item.add-rv-lot-card {
      margin-top: 20px;
    }

    .card-row {
      ${displayFlex}
      flex-flow: row;
      margin-bottom: 20px;
      align-items: center;
    }

    .card-col {
      width: 50%;
      padding-right: 20px;

      h4 {
        margin-bottom: 20px;
      }

      &.right-col {
        h4 {
          margin-left: 50px;
        }
      }

      .optional-text {
        ${displayFlex}
        flex-direction: row;
        justify-content: space-between;

        div {
          font-family: 'IBMPlexSans-Regular';
          font-size: 16px;
          letter-spacing: 0;
          line-height: 25px;
        }
      }

      p {
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 16px;
        letter-spacing: 0;
        line-height: 25px;
      }

      .MuiFormControl-root {
        margin-top: 0px;
      }
    }

    .card-inner-row {
      ${displayFlex}
      flex-direction: row;

      .card-span {
        width: 285px;
        margin-right: 20px;
        margin-left: 50px;
      }
    }

    .time-picker {
      width: 285px;
    }

    .card-row.addOn {
      .card-select {
        &__disabled {
          opacity: 0.4;
          pointer-events: none;
        }
        .MuiFormControl-root {
          width: 320px;
          margin-right: 40px;

          label {
            padding-left: 14px;
            padding-top: 5px;
          }
        }
      }

      .remove-addOn,
      .toggle-addOn {
        svg {
          position: relative;
          top: 5px;
        }
      }

      .MuiFormControl-root.unit-price {
        &__disabled {
          opacity: 0.4;
          pointer-events: none;
        }
        width: 138px;
        margin-right: 25px;
        margin-top: 0px;
        margin-bottom: 0px;

        .MuiFilledInput-input {
          height: 21px;
        }
      }

      .MuiInput-input {
        width: 285px;
      }

      a {
        color: ${colors.border.tertiary};
        font-size: 15px;
        letter-spacing: 1.05px;
        line-height: 17px;
      }
      a:hover {
        cursor: pointer;
      }
    }

    .bottom-navigation {
      ${displayFlex}
      flex-direction: row;
      justify-content: space-between;
      margin: 20px 0;

      &.solo {
        justify-content: flex-end;
      }

      .next.MuiButtonBase-root {
        background: ${colors.background.primary};
        width: 173px;
        box-shadow: none;
      }

      .next.Mui-disabled {
        opacity: 0.3;
      }

      a {
        font-size: 15px;
        letter-spacing: 1.05px;
        line-height: 17px;
         &:hover {
           cursor: pointer;
         }
      }
    }

    .add-stalls {
      ${displayFlex}
      flex-direction: row;
      flex-grow: 1;

      .available-label {
        font-size: 16px;
        font-weight: bold;
        letter-spacing: 0.7px;
        line-height: 25px;
        margin-top: 8px;
        flex: 1;
        font-family: 'IBMPlexSans-Bold';
      }

      a {
        height: 17px;
        font-size: 15px;
        letter-spacing: 1.05px;
        line-height: 17px;
        &:hover {
          cursor: pointer;
        }
      }

      .skip {
        self-align: flex-end;
        margin-top: 10px;
        &.disabled {
          a {
            color: ${colors.text.lightGray};
            &:hover {
              cursor: default;
            }
          }
        }
      }
    }

    .file-uploads {
      display: flex;
    }

    .venue-agreement {
      width: 50%;
      .select-venue-agreement {
        margin-left: 50px;
        .MuiFormControl-root {
          width: 285px;
        }
      }

      .upload-venue-agreement {
        margin-top: 5px;
        margin-left: 50px;
        font-size: 16px;
        letter-spacing: 0;
        line-height: 25px;
        label {
          color: ${colors.text.link};
          &:hover {
            cursor: pointer;
          }
        }
      }

      .agreement-input {
        display: none;
      }
    }

    .rvs-spots-form {
      ${displayFlex}
      flex-flow: row nowrap;
      justify-content: space-between;
      justify-content: end;

      h4 {
        color: ${colors.text.primary};
        font-family: 'IBMPlexSans-SemiBold';
        font-size: 22px;
        letter-spacing: 0.97px;
        line-height: 25px;
        margin: 0 0 10px;
      }

      .spot-details {
        width: 100%;
        .select-field {
          .MuiFormControl-root {
            width: 100%;
            border-radius: 5px 5px 0 0;
            background-color: #f2f4f7;
          }
        }

        .available-date-range {
          margin-top: 30px;
          font-family: 'IBMPlexSans-Regular';
          font-size: 16px;
          font-style: italic;
          letter-spacing: 0;
          line-height: 25px;
        }

        .pricing {
          margin-top: 25px;
          .MuiTextField-root {
            width: 267px;
            margin-top: 0;
          }
        }
      }

      .reservable-spots {
        width: 95%;

        .select-spots {
          height: 330px;
          width: 100%;
          border-radius: 5px;
          background-color: ${colors.background.primary};
          margin-top: 4px;
          ${displayFlex}
          flex-flow: row wrap;
          justify-content: flex-start;
          padding: 20px 40px;
          overflow: auto;
          overflow-x: hidden;

          .selected-items-count {
            width: 100%;
            color: ${colors.text.primary};
            font-family: 'IBMPlexSans-Regular';
            font-size: 16px;
            letter-spacing: 0.7px;
            line-height: 20px;
            padding-bottom: 15px;
            margin-bottom: 15px;
            border-bottom: 1px solid ${colors.border.primary};
          }
        }

        .empty-rv-selection {
          color: ${colors.text.secondary};
          font-family: 'IBMPlexSans-Regular';
          font-size: 16px;
          letter-spacing: 0;
          line-height: 25px;
          text-align: center;
          padding-top: 115px;
          padding-left: 20px;
          width: 100%;
          ${displayFlex}
          flex-direction: column;

          img {
            width: 47px;
          }
        }

        .reservable-actions {
          ${displayFlex}
          flex-direction: row;
          justify-content: flex-start;
          flex-grow: 1;
          margin-top: -7px;

          h4 {
            width: 50%;
            flex: 1;
          }

          a {
            margin-top: 4px;
          }

          .action {
            color: ${colors.text.link};
            font-family: 'IBMPlexSans-Regular';
            font-size: 15px;
            letter-spacing: 1.05px;
            line-height: 17px;
            margin-left: 25px;

            &:hover {
              cursor: pointer;
            }

            &.disabled {
              color: ${colors.text.lightGray2};
              &:hover {
               cursor: default;
              }
            }
          }
        }
        .rv-item {
          box-sizing: border-box;
          height: 36px;
          width: 103px;
          border: 1px solid ${colors.border.secondary};
          border-radius: 3px;
          background-color: ${colors.border.secondary};
          color: ${colors.white};
          font-family: 'IBMPlexSans-Regular';
          font-size: 16px;
          letter-spacing: 0.7px;
          line-height: 20px;
          padding-top: 4px;
          ${displayFlex}
          flex-flow: row nowrap;
          justify-content: space-between;
          margin: 6px;

          &:hover {
            cursor: pointer;
          }

          div {
            margin: 5px;
          }

          &.inactive {
            border: 1px solid ${colors.text.lightGray2};
            color: ${colors.text.lightGray2};
            background: transparent;
          }

          svg {
            position: relative;
            top: -4px;
          }
        }
      }
    }

    .add-rv-lot {
      color: ${colors.text.link};
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      letter-spacing: 0.7px;
      line-height: 25px;
      position: relative;
      top: 5px;
      font-family: 'IBMPlexSans-Bold';

      &.disabled {
        color: ${colors.text.lightGray};
      }
      &:hover {
        cursor: pointer;
      }

      svg {
        position: relative;
        top: 6px;
      }
    }

    *:focus {
      outline: none;
    }
  }

  .DateRangePicker,
  .DateRangePickerInput {
    width: 320px;
  }
  &&&& {
    .MuiFormControl-root {
      background: ${colors.background.primary};
      border-radius: 5px 5px 0 0;
      background-color: ${colors.background.primary};

      .MuiSelect-selectMenu {
        padding: 10px;

        &:focus {
         background-color: ${colors.background.primary};
        }
      }
    }

    .card-col.description {
      margin-bottom: 40px;
      .MuiFilledInput-multiline {
        height: 56px;
        padding-top: 60px;
      }
    }

    fieldset.MuiFormControl-root {
      background: transparent;
    }

    .pricing-fields {
      ${displayFlex}
      flex-direction: column;
    }
    .labels {
      ${displayFlex}
      color: ${colors.text.lightGray2};
      flex-direction: row;
      font-family: 'IBMPlexSans-Regular';
      font-size: 12px;
      justify-content: flex-start;
      letter-spacing: 0;
      line-height: 16px;
      padding: 0 10px;
      text-transform: uppercase;
      width: 320px;

      & div:first-child {
        width: 213px;
      }
    }
    .stalls {
      .labels div:first-child {
        width: 130px;
      }
    }

    .pricing-fields {
      svg {
        color: ${colors.text.lightGray2};
      }
    }
  }
`;

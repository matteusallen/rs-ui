import styled from 'styled-components';

import colors from '../../../../styles/Colors';
import { displayFlex } from '../../../../styles/Mixins';

export default C => styled(C)`
  &__title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__switch-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .MuiSwitch-colorPrimary.Mui-checked {
    color: ${colors.white};
  }

  .MuiSwitch-colorPrimary.Mui-checked + .MuiSwitch-track {
    background-color: ${colors.button.primary.active};
    opacity: 1;
  }

  &__card-content {
    .add-on-row {
      ${displayFlex}
      flex-flow: row wrap;
      justify-content: flex-start;
      font-family: 'IBMPlexSans-Regular';
      font-size: 1rem;
      line-height: 25px;
      -webkit-letter-spacing: 0;
      -moz-letter-spacing: 0;
      -ms-letter-spacing: 0;
      letter-spacing: 0;

      h4 {
        font-family: 'IBMPlexSans-SemiBold';
        font-size: 18px;
        -webkit-letter-spacing: 0.79px;
        -moz-letter-spacing: 0.79px;
        -ms-letter-spacing: 0.79px;
        letter-spacing: 0.79px;
        line-height: 23px;
        margin-bottom: 0;
      }
    }

    .column {
      margin-right: 20px;
      &:last-child {
        margin-right: unset;
      }
      width: 30%;
      max-width: 33%;
    }
    .separator {
      margin-top: 10px;
      height: 1px;
      width: 660px;
      background-color: #c8d6e5;
    }
  }
`;

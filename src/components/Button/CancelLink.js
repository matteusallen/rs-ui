import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { paragraphReg } from '../../styles/Typography';
import colors from '../../styles/Colors';
import { displayFlex } from '../../styles/Mixins';

import Button from '.';

const CancelLink = styled(Link)`
  width: 160px;
  height: 36px;
  border-radius: 3px;
  ${paragraphReg}
  background-color: ${colors.button.secondary.active};
  color: ${colors.white};
  text-decoration: none;
  ${displayFlex}
  justify-content: center;
  align-items: center;
  &.active-link {
    &&& {
      &:active div[class^='MuiListItemIcon-root'],
      div[class*='MuiListItemIcon-root'] {
        color: white;
      }
      div[class^='MuiListItemText-root'],
      div[class*='MuiListItemText-root'] {
        p {
          color: white;
        }
      }
    }
  }
`;

export const CancelButtonAlt = styled(Button)`
  width: 225px !important;
  height: 36px;
  border-radius: 3px;
  ${paragraphReg}
  background-color: #F2F4F7 !important;
  color: black !important;
  border: 1px solid #11181f !important;
  box-shadow: none !important;
  text-decoration: none;
  ${displayFlex}
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  &.active-link {
    &&& {
      &:active div[class^='MuiListItemIcon-root'],
      div[class*='MuiListItemIcon-root'] {
        color: white;
      }
      div[class^='MuiListItemText-root'],
      div[class*='MuiListItemText-root'] {
        p {
          color: white;
        }
      }
    }
  }
`;

export default CancelLink;

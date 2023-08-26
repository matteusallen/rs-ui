import styled from 'styled-components';
import { TextField } from '@material-ui/core';

import { paragraphReg } from '../../styles/Typography';
import colors from '../../styles/Colors';

export default styled(TextField)`
  width: 215px;
  border-radius: 5px 5px 0 0;
  &&& {
    margin-right: 20px;
    .MuiFilledInput-root {
      background-color: ${colors.background.primary};
      font-family: 'IBMPlexSans-Regular';

      &:hover {
        background-color: ${colors.background.primary_hover};
      }
    }
    .MuiFilledInput-root.Mui-disabled {
      opacity: 0.5;
    }
    .MuiFormLabel-root {
      ${paragraphReg};
      color: ${colors.text.secondary};
      font-size: 0.9375rem;
      line-height: 24px;
    }
    .MuiFormLabel-root.Mui-disabled {
      opacity: 0.5;
    }
  }
`;

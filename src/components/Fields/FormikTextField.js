import styled from 'styled-components';
import { TextField } from 'formik-material-ui';

import { paragraphReg } from '../../styles/Typography';
import colors from '../../styles/Colors';

export default styled(TextField)`
  width: 100%;
  &&& {
    margin-top: 20px;
    margin-bottom: 20px;
}

    .MuiFilledInput-root {
      background-color: ${colors.background.primary};
      font-family: 'IBMPlexSans-Regular';

      &:hover {
        background-color: ${colors.background.primary_hover};
      }
    }
    .MuiFilledInput-root.Mui-disabled {
      background-color: ${colors.background.primary_hover};
      opacity: 0.5;
    }
    .MuiFilledInput-input {
      color: ${colors.text.primary};
      '& $error': {
        color: ${colors.error.primary};
      }
    }
    .MuiFilledInput-underline.Mui-error:after {
      border-bottom-color: ${colors.error.primary};
    }
    .MuiFilledInput-underline:after {
      border-bottom-color: ${colors.border.secondary};
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
    .MuiFormHelperText-root {
      color: ${colors.error.primary};
      text-transform: uppercase;
    }
    .Mui-error {
      color: ${colors.error.primary};
    }
  }
`;

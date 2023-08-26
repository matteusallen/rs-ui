//@flow
import styled from 'styled-components';

import colors from '../../styles/Colors';

/**
 * Padding to prevent overlap on header.
 * Text aligned center on .MuiSnackbarContent-root.
 */
export default styled.div`
  .MuiSnackbar-root {
    padding-top: 45px;
    &.rolo-snackbar {
      .MuiSnackbarContent-root {
        text-align: center;
        .MuiButton-label {
          font-weight: bold;
          color: white;
        }
      }
    }
  }
  .MuiSnackbarContent-root {
    ${({ isError, isInfo }) => {
      return isError ? `background: ${colors.error.primary}` : isInfo ? `background: ${colors.secondary}` : `background: ${colors.primary}`;
    }}
`;

import styled, { css } from 'styled-components';
import { Checkbox } from '@material-ui/core';

import colors from '../../styles/Colors';

export default styled(Checkbox)`
  &&& {
    span svg {
      ${({ checked }) =>
        checked
          ? css`
              color: ${colors.secondary};
            `
          : null}
    }
  }
`;

import { css } from 'styled-components';

import { displayFlex } from '../../../../styles/Mixins';

export const flexInputContainer = css`
  &__flex-input-container {
    ${displayFlex}
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
`;

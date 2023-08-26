//@flow
import styled from 'styled-components';

import { BIG_TABLET_WIDTH } from '../../styles/Mixins';

const Sticky = styled.div`
  @media screen and (min-width: ${BIG_TABLET_WIDTH}) {
    position: -webkit-sticky;
    position: sticky;
    top: 85px;
  }
`;

export default Sticky;

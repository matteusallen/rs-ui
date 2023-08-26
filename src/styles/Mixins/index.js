//@flow
import { css } from 'styled-components';

export const displayFlex = css`
  display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6, BB7 */
  display: -ms-flexbox; /* TWEENER - IE 10 */
  display: -webkit-flex; /* NEW - Safari 6.1+. iOS 7.1+, BB10 */
  display: flex; /* NEW, Spec - Firefox, Chrome, Opera */
`;

export const MEDIUM_MOBILE_WIDTH = '375px';
export const SMALL_TABLET_WIDTH = '768px';
export const BIG_TABLET_WIDTH = '960px';
export const DESKTOP_WIDTH = '1200px';

const screenSizes = {
  MEDIUM_MOBILE_WIDTH,
  DESKTOP_WIDTH,
  BIG_TABLET_WIDTH,
  SMALL_TABLET_WIDTH
};

type ScreenSizeType = 'MEDIUM_MOBILE_WIDTH' | 'DESKTOP_WIDTH' | 'BIG_TABLET_WIDTH' | 'SMALL_TABLET_WIDTH';

export const doMediaQuery = (screenSize: ScreenSizeType, rules: string) => `
  @media screen and (min-width: ${screenSizes[screenSize]}) {
    ${rules}
  }
`;

export const isMobile = (): boolean => window.innerWidth <= Number(BIG_TABLET_WIDTH.replace(/px/i, ''));

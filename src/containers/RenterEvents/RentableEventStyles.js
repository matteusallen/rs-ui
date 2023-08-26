import styled from 'styled-components';

import { BIG_TABLET_WIDTH, displayFlex, doMediaQuery, SMALL_TABLET_WIDTH } from '../../styles/Mixins';
import bannerDesktop from '../../assets/img/banner-desktop.png';

export const RentableEventStyles = C => styled(C)`
  &__Header {
    &&& {
      margin: 0 0 0 20px;
      ${doMediaQuery(
        'SMALL_TABLET_WIDTH',
        `
        margin: unset;
      `
      )}
    }
  }

  &__empty-list {
    margin-top: 130px;
    width: 100%;

    img {
      with: 110px;
      height: 110px;
    }

    #green-banner {
      background: url(${bannerDesktop}) center center no-repeat;
      background-size: 625px 100px;
      height: 100px;
      color: white;
      text-transform: uppercase;
      padding-top: 38px;
      font-size: 38px;
      letter-spacing: 15px;
    }

    p {
      text-transform: uppercase;
      font-size: 2rem;
      font-weight: bold;
      letter-spacing: 12px;
    }

    @media screen and (max-width: ${SMALL_TABLET_WIDTH}) {
      width: 90%;
      margin: 50px auto 50px auto;

      img {
        width: 60px;
        height: 60px;
      }

      #green-banner {
        background-size: 335px 55px;
        height: 55px;
        padding-top: 21px;
        font-size: 24px;
        font-size: 22px;
        letter-spacing: 8px;
        margin-bottom: 10px;
      }

      p {
        font-size: 1.16rem;
        letter-spacing: 6px;
        margin-top: 10px;
      }
    }
  }

  &__loader {
    display: flex;
    justify-content: center;
    width: 100%;
  }
`;

export const CardListContainer = styled.div`
  && {
    ${displayFlex}
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 100vw;
    @media screen and (min-width: ${BIG_TABLET_WIDTH}) {
      flex-direction: row;
      justify-content: end;
      align-items: flex-start;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      flex-wrap: wrap;
    }
    @media screen and (max-width: ${SMALL_TABLET_WIDTH}) {
      p.no-reservations {
        padding: 0 40px;
      }
    }
  }
`;

export const FlexWrapper = styled.div`
  ${displayFlex}
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  max-width: 1200px;
  padding-left: 6px;
  ${doMediaQuery(
    'SMALL_TABLET_WIDTH',
    `
    margin: 0 auto 25px auto;
  `
  )}
`;

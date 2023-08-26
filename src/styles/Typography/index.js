import { css } from 'styled-components';
import colors from '../Colors';

// NOTE: Mobile is default
export const headingOne = css`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 41px;
  font-weight: 600;
  line-height: 50px;
  letter-spacing: 0.9px;
  color: ${colors.text.primary};
  @media screen and (min-width: 960px) {
    font-size: 2.5625rem;
    line-height: 50px;
    letter-spacing: 1.2px;
  }
`;

export const headingTwo = css`
  font-family: 'IBMPlexSans-SemiBold';
  margin-bottom: 5px;
  font-size: 1.5625rem;
  line-height: 35px;
  letter-spacing: 1.1px;
  color: ${colors.text.primary};
  @media screen and (min-width: 960px) {
    font-size: 1.875rem;
    line-height: 50px;
    letter-spacing: 0.9px;
  }
`;

export const headingThree = css`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 1.375rem;
  line-height: 25px;
  letter-spacing: 1px;
  color: ${colors.text.primary};

  @media screen and (min-width: 960px) {
    font-size: 1.5625rem;
    line-height: 25px;
    letter-spacing: 1.1px;
  }
`;

export const headingFour = css`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 1.125rem;
  line-height: 0;
  letter-spacing: 0.8px;
  color: ${colors.text.primary};
  @media screen and (min-width: 960px) {
    font-size: 1.375rem;
    line-height: 25px;
    letter-spacing: 0.97px;
  }
`;

export const headingFive = css`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 1.125rem;
  margin: 0;
  letter-spacing: 0.8px;
  color: ${colors.text.primary};
`;

export const paragraphReg = css`
  font-family: 'IBMPlexSans-Regular';
  font-size: 1rem;
  line-height: 25px;
  letter-spacing: 0;
`;

export const paragraph700 = css`
  font-family: 'IBMPlexSans-Regular';
  font-weight: 700;
  font-size: 16px;
  line-height: 25px;
  letter-spacing: 0;
`;

export const paragraphBold = css`
  ${paragraphReg}
  font-family: 'IBMPlexSans-Bold';
  font-weight: bold;
`;

export const columnHeaderText = css`
  font-family: 'IBMPlexSans-Bold';
  font-size: 0.8125rem;
  line-height: 17px;
  letter-spacing: 0.65px;
  text-transform: uppercase;
`;

export const cellText = css`
  font-family: 'IBMPlexSans-Regular';
  font-size: 0.8125rem;
  line-height: 17px;
  letter-spacing: 0.65px;
  text-transform: uppercase;
`;

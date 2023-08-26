// @flow
import React from 'react';
import styled from 'styled-components';
import Icon from '@material-ui/core/Icon';

import colors from '../../styles/Colors';
import { HeadingTwo } from 'Components/Headings';

type CardSectionHeaderPropsType = {|
  className: string,
  headerIcon: Icon,
  text: string
|};

const CardSectionHeaderBase = (props: CardSectionHeaderPropsType) => {
  const { className, headerIcon, text } = props;

  return (
    <div className={`${className}__section-header`}>
      <HeadingTwo className={`${className}__section-header-text`} label={text} />
      {headerIcon && <img alt="Header Icon" src={headerIcon} />}
    </div>
  );
};

const CardSectionHeader = styled(CardSectionHeaderBase)`
  &__section-header {
    width: 100%;
    margin-top: 30px;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 767px) {
      width: 95%;
    }

    h2 {
      width: 100%;
      margin: 0;
      display: grid;
      grid-gap: 10px;
      grid-template-columns: auto 1fr;
      align-items: center;
      font-family: 'IBMPlexSans-SemiBold';
      font-size: 30px;
      line-height: 50px;
      letter-spacing: 0.91px;
      text-align: center;

      &::after {
        content: '';
        border-radius: 3.5px;
        border-top: 2px solid ${colors.border.primary};
      }
    }

    img {
      width: auto;
      height: 30px;
      margin-left: 10px;
    }
  }
`;

export default CardSectionHeader;

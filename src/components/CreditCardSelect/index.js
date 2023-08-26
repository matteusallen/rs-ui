// @flow
import React, { useState } from 'react';
import styled from 'styled-components';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import { Field } from '../Fields';
import colors from '../../styles/Colors';

const CreditCardSelectBase = props => {
  const { cards, setSelectedCard, className, setNewCard, newCard, cardValue, groupOrderLast4 } = props;
  const [cardListVisible, toggleCardListVisible] = useState(false);
  const [activeItem, setActiveItem] = useState<number>(0);
  const maxNumber = cards.length + 1;

  const handleClick = (last4, brand, country) => {
    setSelectedCard(last4, brand, country);
    setNewCard(false);
    toggleCardListVisible(false);
  };

  const handleNewCard = () => {
    setNewCard(true);
    setSelectedCard(null);
    toggleCardListVisible(false);
  };

  const onBlur = () => {
    setTimeout(() => toggleCardListVisible(false), 200);
  };

  const getValue = () => {
    if (cardValue) {
      return `**** **** **** ${cardValue}`;
    } else if (newCard) {
      return 'ADD NEW CARD';
    } else {
      return '';
    }
  };

  const handleKeyPress = () => (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Tab':
        e.preventDefault();
        return setActiveItem(activeItem === 0 || activeItem === maxNumber ? 1 : activeItem + 1);
      case 'ArrowDown':
        e.preventDefault();
        return setActiveItem(activeItem === 0 || activeItem === maxNumber ? 1 : activeItem + 1);
      case 'ArrowUp':
        e.preventDefault();
        return setActiveItem(activeItem === 0 || activeItem === 1 ? maxNumber : activeItem - 1);
      case 'Enter': {
        e.preventDefault();
        if (activeItem === 0) return;
        if (activeItem === 1) {
          return handleNewCard();
        } else {
          const item = cards[activeItem - 2 || 0] || {};
          if (item.last4) handleClick(item.last4, item.brand, item.country);
          return;
        }
      }

      default:
        return setActiveItem(0);
    }
  };

  return (
    <div role="button" className={`${className}__select-card-container`}>
      <Field
        label="SELECT CARD"
        type="text"
        className={`${className}__select-card-field`}
        variant="filled"
        value={getValue()}
        onBlur={onBlur}
        onFocus={() => toggleCardListVisible(true)}
        onKeyDown={handleKeyPress()}
        InputProps={{
          endAdornment: (
            <div onClick={() => toggleCardListVisible(!cardListVisible)}>
              <ArrowDropDownIcon style={{ fill: `${colors.button.primary.active}` }} />
            </div>
          )
        }}
      />
      <div className={`${className}__cards-container`}>
        {cardListVisible && (
          <div
            role="button"
            tabIndex="0"
            className={`${className}__card-field ${activeItem - 1 === 0 ? 'active' : ''}`}
            onKeyPress={handleNewCard}
            onClick={handleNewCard}>
            ADD A NEW CARD
          </div>
        )}
        {cardListVisible &&
          cards.map((card, key) => (
            <div
              role="button"
              tabIndex="0"
              className={`${className}__card-field ${activeItem - 2 === key ? 'active' : ''}`}
              onKeyPress={() => handleClick(card.last4, card.brand, card.country)}
              onClick={() => handleClick(card.last4, card.brand, card.country)}
              key={card.id}>
              **** **** **** {card.last4} {card.last4 === groupOrderLast4 ? '(recommended)' : ''}
            </div>
          ))}
      </div>
    </div>
  );
};

const CreditCardSelect = styled(CreditCardSelectBase)`
  &__select-card-container {
    position: relative;
    width: 100%;
    &:hover {
      cursor: pointer;
    }

    @media (max-width: 424px) {
      max-width: 100%;
    }
  }

  &__select-card-field {
    &&& {
      input {
        font-family: 'IBMPlexSans-Regular';
        &:hover {
          cursor: pointer;
        }
      }
      svg {
        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  &__cards-container {
    position: absolute;
    top: 75px;
    width: 100%;
    z-index: 2;
    max-height: 300px;
    overflow: auto;

    @media (max-width: 424px) {
      max-width: 100%;
    }
  }

  &__card-field {
    background-color: ${colors.background.primary};
    font-family: 'IBMPlexSans-Regular';
    height: 56px;
    padding: 20px;
    width: 100%;
    text-align: left;
    :hover,
    &.active {
      background-color: ${colors.primary};
    }
  }

  div.MuiPaper-root {
    display: none;
  }
`;

export default CreditCardSelect;

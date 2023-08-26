// @flow
import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import colors from '../../styles/Colors';
import { HeadingFive } from 'Components/Headings';

import Button from '../Button';

import Electric from '../../assets/img/icons/Electric.png';
import Sewer from '../../assets/img/icons/Sewer.png';
import Water from '../../assets/img/icons/Water.png';
import { displayFlex, doMediaQuery } from '../../styles/Mixins';
import { getPriceSubtext } from '../../helpers';

type ProductRowPropsType = {|
  endDate: string,
  startDate: string,
  availability: number,
  className: string,
  description?: string,
  disabled?: boolean,
  header: string,
  id: string,
  label: string | React$Node,
  nightly?: boolean,
  onClick: (e: SyntheticEvent<HTMLButtonElement>) => void,
  power?: string,
  price: number,
  unitPrice: number,
  productType: 'stalls' | 'rvs',
  quantity: number,
  reservationDuration: number,
  selected: boolean,
  sewer?: boolean,
  subheader: string,
  water?: boolean
|};

type GetPriceInputType = {|
  nightly: boolean,
  price: number,
  quantity?: number,
  reservationDuration?: number
|};

export const getPrice = (props: GetPriceInputType): number => {
  const { quantity = 1, reservationDuration = 1, price, nightly } = props;
  if (nightly) {
    return quantity * price * reservationDuration;
  }
  return quantity * price;
};

const getElectricDescription = power => {
  const powerArray = power?.split(',');
  if (power === '0' || !power || !powerArray) return '';
  let ampString = '';
  switch (powerArray.length) {
    case 1:
      ampString = `${powerArray[0]} amp`;
      break;
    case 2:
      ampString = `${powerArray[0]} & ${powerArray[1]} amp`;
      break;
    default:
      powerArray[powerArray.length - 1] = `& ${powerArray[powerArray.length - 1]} amp`;
      ampString = powerArray.join(', ');
  }
  return `Electric provided: ${ampString.replace(', &', ' &')}`;
};

const ProductRowBase = ({
  className,
  disabled = false,
  description,
  header,
  id,
  label,
  nightly,
  onClick,
  power = '0',
  price,
  startDate,
  endDate,
  unitPrice,
  productType,
  reservationDuration,
  quantity,
  selected = false,
  sewer,
  subheader,
  water,
  availability
}: ProductRowPropsType) => {
  const Amenities = (
    <div className={`${className}__product_amenities`}>
      {power !== '0' && (
        <span>
          <img src={Electric} alt="electric" />
          Electric
        </span>
      )}
      {water && (
        <span>
          <img src={Water} alt="water" />
          Water
        </span>
      )}
      {sewer && (
        <span>
          <img src={Sewer} alt="sewer" />
          Sewer
        </span>
      )}
    </div>
  );

  const pricingText = getPriceSubtext({
    productType,
    nightly,
    reservationDuration,
    quantity,
    price: unitPrice,
    availability
  });

  const splitPriceText = pricingText.split(',');

  return (
    <div className={`${className} ${className}__product_container ${selected ? 'selected' : ''}`}>
      <div className={`${className}__product_container_left`}>
        <HeadingFive label={header} />
        <span className={`${className}__product_description dates`}>
          Dates between {moment(startDate).format('MM/DD/YY')} – {moment(endDate).format('MM/DD/YY')}
        </span>
        <br />
        <span className={`${className}__product_description`}>
          {subheader} {getElectricDescription(power)}
        </span>
        {description && <br />}
        <span className={`${className}__product_description_main`}>{description || ''}</span>
        {power || sewer || water ? Amenities : ''}
      </div>
      <div className={`${className}__product_container_right`}>
        <div className={`${className}__product_calculations`}>
          <span className={`${className}__product_price`}>${price.toString().indexOf('.') > 0 ? price.toFixed(2) : price}</span>
          <span className={`${className}__product_price_subtext`}>
            <p>{splitPriceText[0]}</p>
            <p>{splitPriceText[1]}</p>
          </span>
        </div>
        <div className={`${className}__product_actions`}>
          <Button disabled={disabled} onClick={onClick} secondary size="large" variant="contained" data-testid={`${id}-${productType}-button`}>
            {label}
          </Button>
        </div>
      </div>
    </div>
  );
};

const ProductRow = styled(ProductRowBase)`
  &__product_container {
    display: grid;
    align-items: center;
    grid-gap: 10px;
    grid-template-columns: 1fr 1fr;
    padding: 15px;
    background-color: ${colors.background.primary};
    border-radius: 3.5px;

    &:not(:last-child) {
      margin-bottom: 15px;
    }

    &.selected {
      border: 3px solid ${colors.border.tertiary};

      .MuiButtonBase-root {
        background-color: ${colors.border.tertiary} !important;
        color: ${colors.white};
      }
    }

    @media (max-width: 767px) {
      grid-template-columns: 1fr;
    }
  }
  &__product_container_left {
    text-align: left;
    border-bottom: solid 1px ${colors.border.primary};
    padding-bottom: 15px;
    ${doMediaQuery(
      'SMALL_TABLET_WIDTH',
      `
      border-bottom: unset;
      padding-bottom: unset;
    `
    )}
    @media (min-width: 768px) {
      border-right: 1px solid ${colors.border.primary};
    }
  }
  &__product_description {
    font-family: 'IBMPlexSans-Regular';
    font-size: 16px;
    letter-spacing: normal;
    line-height: 25px;
  }
  &__product_amenities {
    margin-top: 13px;
    ${displayFlex}
    ${doMediaQuery(
      'SMALL_TABLET_WIDTH',
      `
      justify-content: flex-start;
      align-items: center;
    `
    )}

    span {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      letter-spacing: normal;
      line-height: 25px;

      img {
        width: auto;
        height: 18px;
        margin-right: 5px;
      }

      &:not(:last-child) {
        margin-right: 20px;
      }
    }
  }
  &__product_container_right &__product_calculations {
    width: 50%;
  }
  &__product_container_right {
    ${displayFlex}
    flex-flow: row nowrap;
    margin-top: 10px;

    ${doMediaQuery(
      'SMALL_TABLET_WIDTH',
      `
      justify-content: flex-end;
      align-items: center;
      text-align: right;
      margin-top: unset;
    `
    )}

    button {
      width: 135px !important;
      height: 45px !important;
      white-space: nowrap;

      ${doMediaQuery(
        'SMALL_TABLET_WIDTH',
        `
        margin-left: 40px;
      `
      )}
    }
  }
  &__product_price {
    display: block;
    color: ${colors.text.accent};
    font-family: 'IBMPlexSans-SemiBold';
    font-size: 22px;
    letter-spacing: 0.97px;
    line-height: 25px;
  }
  &__product_price_subtext {
    font-size: 12px;
    letter-spacing: 0.53px;
    line-height: 11px;

    p:first-child {
      margin-top: 5px !important;
    }

    p {
      font-size: 12px !important;
      line-height: 12px !important;
      margin: 2px !important;
    }
  }
`;

export default ProductRow;

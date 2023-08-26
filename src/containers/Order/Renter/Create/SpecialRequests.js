import React from 'react';
import styled from 'styled-components';

import SpecialRequestTextArea from '../../shared/SpecialRequestTextArea';
import FormCard from '../../../../components/Cards/FormCard';
import { HeadingTwo } from '../../../../components/Headings';
import colors from '../../../../styles/Colors';
import { paragraphBold } from '../../../../styles/Typography';

function SpecialRequestsBase(props) {
  const { className } = props;

  return (
    <FormCard className={className} dataTestId="renter_special_requests">
      <div className={`${className}__card-headline-wrapper`}>
        <HeadingTwo label={`Special Requests`} />
        <strong className={`${className}__required-text`}>(Optional)</strong>
      </div>
      <p className={`${className}__note-text`}>Enter any requests, such as stall location or other renters you want to be placed near.</p>
      <p className={`${className}__note-text`}>
        <strong>Please note: special requests are not guaranteed</strong>
      </p>
      <div className={`${className}__row`}>
        <div className={`${className}__item`}>
          <SpecialRequestTextArea {...props} />
        </div>
      </div>
    </FormCard>
  );
}

const SpecialRequests = styled(SpecialRequestsBase)`
  &__row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-bottom: -10px;
  }
  &__item {
    width: 100%;
    & {
      :nth-child(2) {
        margin-top: 8px;
      }
    }
  }

  &__cal-label {
    span {
      text-transform: uppercase;
      font-family: 'IBMPlexSans-Regular';
      font-size: 12px;
      color: ${colors.text.secondary};
      &:nth-child(1) {
        margin-left: 15px;
      }
      &:nth-child(2) {
        margin-left: 100px;
      }
    }
  }

  &__card-headline-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: baseline;
    margin: 0;
  }

  &__required-text {
    ${paragraphBold}
    font-weight: bold;
    margin: 0 0 0 5px;
    color: ${colors.text.secondary};
  }

  &__note-text {
    margin: 0;
  }
`;

export default SpecialRequests;

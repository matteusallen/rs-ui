import React from 'react';
import styled from 'styled-components';

import AddOnRows from '../../shared/AddOnRows';
import FormCard from '../../../../components/Cards/FormCard';
import { HeadingTwo } from '../../../../components/Headings';
import { paragraph700 } from '../../../../styles/Typography';
import colors from '../../../../styles/Colors';

const AddOnsBase = props => {
  const { className } = props;

  return (
    <FormCard className={className} dataTestId="renter_addons">
      <div className={`${className} heading-container`}>
        <HeadingTwo label={`Add Ons`} />
        <span className={`${className} optional-text`}>(Optional)</span>
      </div>
      <AddOnRows {...props} />
    </FormCard>
  );
};

const AddOns = styled(AddOnsBase)`
  & {
    .optional-text {
      color: ${colors.text.lightGray2};
      ${paragraph700}
      margin: 0 0 0 5px;
    }

    .heading-container {
      align-items: baseline;
      display: flex;
    }
  }
`;

export default AddOns;

//@flow
import React from 'react';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';

import FormCard from '../../../../components/Cards/FormCard';
import { HeadingTwo } from 'Components/Headings';

type EventCardPropsType = {|
  children: React$Node,
  className: string,
  disabled?: boolean,
  italicizeHeading: boolean,
  remove?: () => void,
  title?: string,
  testId?: string,
  useStallStyles: boolean,
  flip: boolean,
  product: string
|};

export const EventCardBase = ({
  title,
  children,
  className,
  disabled,
  useStallStyles,
  italicizeHeading,
  remove,
  flip,
  product,
  testId
}: EventCardPropsType) => (
  <FormCard className={`${className} card-item ${disabled ? 'disabled' : ''}`} dataTestId={testId}>
    {!!title && (
      <div className={'heading'}>
        <HeadingTwo className={useStallStyles ? `stall-rate ${italicizeHeading ? 'italic' : ''}` : ''} label={title} />
        {remove && (
          <a onClick={remove} onKeyPress={remove} tabIndex={0} role={'button'}>
            <DeleteIcon /> REMOVE
          </a>
        )}
        {product && (
          <span data-testid={`event-${product.toLowerCase()}-flip`}>
            <strong>{product} Flipping:</strong> {flip ? 'Enabled' : 'Disabled'}
          </span>
        )}
      </div>
    )}
    {children}
  </FormCard>
);

export const EventCard = styled(EventCardBase)`
  & {
    .stall-rate {
      margin-top: -10px;
      margin-bottom: 20px;
      padding-bottom: 10px;

      &.italic {
        font-style: italic;
      }
    }
  }
`;

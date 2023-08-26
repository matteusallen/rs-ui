// @flow
import React from 'react';
import styled from 'styled-components';
import WarningIcon from '@material-ui/icons/Warning';

const types = {
  'checked-in': { classType: 'checked-in', text: 'checked in' },
  'partial-check-in': {
    classType: 'partial-check-in',
    text: 'partially checked in'
  },
  reserved: { classType: 'reserved', text: 'reserved' },
  hasMultiple: { classType: 'hasMultiple', text: 'multiple orders' },
  canceled: { classType: 'canceled', text: 'canceled' },
  'need-assignment': {
    classType: 'need-assignment',
    text: 'needs assignment'
  },
  departed: { classType: 'departed', text: 'departed' }
};

type BadgePropsType = {|
  className: string,
  type: string
|};

const BadgeBase = (props: BadgePropsType) => {
  const badgeType = types[props.type];

  return (
    <span className={`${props.className}__badge ${badgeType.classType}`}>
      {props.type === 'need-assignment' && <WarningIcon />}
      <span>{badgeType.text}</span>
    </span>
  );
};

const Badge = styled(BadgeBase)`
  &__badge {
    border: 1px solid black;
    border-radius: 16px;
    display: block;
    padding: 4.5px 10.5px;
    text-transform: uppercase;
    font-size: 13px;
    letter-spacing: 0.7px;
    line-height: 17px;
    margin: 0 6px;
    height: max-content;

    &.checked-in {
      border-color: #29b490;
      color: #29b490;
    }

    &.partial-check-in {
      border-color: #387fc7;
      color: #387fc7;
    }

    &.reserved {
      border-color: #1c2229;
      color: #1c2229;
    }

    &.hasMultiple {
      color: #576574;
      border-color: #576574;
    }

    &.canceled {
      border-color: #ec494a;
      color: #ec494a;
    }

    &.need-assignment {
      border-color: #ff9e42;
      color: #495868;
      white-space: nowrap;

      svg {
        font-size: 15px;
        color: #ff9e42;
        position: relative;
        top: 2px;
        margin-right: 4px;
      }
    }

    &.departed {
      border-color: #cdd9e7;
      color: #5a6776;
    }
  }
`;

export default Badge;

//@flow
import React from 'react';

import { formatPhoneNumber } from '../../helpers';

type PhoneLinkPropsType = {|
  phone: string,
  className?: string
|};

const PhoneLink = ({ phone, className }: PhoneLinkPropsType): React$Element<'a'> => {
  return (
    <a href={`tel:${phone}`} style={{ textDecoration: 'underline' }} className={className}>
      {formatPhoneNumber(phone)}
    </a>
  );
};

export default PhoneLink;

//@flow
import React from 'react';

type SidePanelRowPropsType = {|
  children?: React$Node,
  className?: string,
  text?: string,
  title?: string
|};

export const SidePanelRow = ({ className = '', children, title, text }: SidePanelRowPropsType): React$Element<'div'> => {
  return (
    <div className={'row ' + className}>
      {!!title && (
        <div className={'order-divider'}>
          <div className={'section-name'}>{title}</div>
          <div className={'line'} />
        </div>
      )}
      {!!text && <div className={'order-text'}>{text}</div>}
      {children}
    </div>
  );
};

//@flow
import React from 'react';

type SidePanelColPropsType = {|
  columns?: { text: React$Node, title: string }[] | null
|};

export const SidePanelCol = ({ columns }: SidePanelColPropsType): React$Element<'div'> => {
  const items = columns || [];
  const nodes = items.map((column, index) => {
    return (
      <div key={`${column.title}${index.toString()}`} className={`order-col ${index > 1 ? 'row-below' : ''} ${(index + 1) % 2 === 0 ? 'last' : ''}`}>
        <div className={'heading'}>{column.title}</div>
        <div className={''}>{column.text}</div>
      </div>
    );
  });
  return <div className={'order-details'}>{nodes}</div>;
};

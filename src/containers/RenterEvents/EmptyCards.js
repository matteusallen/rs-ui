//@flow
import React from 'react';

import RentersGray from '../../assets/img/renters-light-gray.svg';
import { Card } from './EventCard';

type EmptyCardsPropsType = {|
  className: string,
  itemsCount: number,
  itemsPerRow?: number
|};

export default function EmptyCards({ className, itemsCount, itemsPerRow = 3 }: EmptyCardsPropsType): React$Node {
  const rows = Math.ceil(itemsCount / itemsPerRow);
  const times = rows * itemsPerRow - itemsCount;
  const items = Array.from(Array(times).keys());

  if (rows > 1) {
    return null;
  }

  return (
    <>
      {items.map(id => (
        <Card key={`empty-card-${id}`} className={`${className}__event-card empty`}>
          <div className={`${className}__empty-event-container`}>
            <img src={RentersGray} alt="Renters Icon" />
            <p>More events coming soon!</p>
          </div>
        </Card>
      ))}
    </>
  );
}

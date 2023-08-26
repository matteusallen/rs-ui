//@flow
import React from 'react';

import closeIcon from '../../../../assets/img/close.png';

type ClosePanelButtonPropsType = {|
  onClose: () => void
|};

export const ClosePanelButton = ({ onClose }: ClosePanelButtonPropsType): React$Element<'div'> => {
  return (
    <div className={'close-icon'} tabIndex={0} role="button" onKeyPress={() => onClose()} onClick={() => onClose()}>
      <img src={closeIcon} alt={'Close'} />
    </div>
  );
};

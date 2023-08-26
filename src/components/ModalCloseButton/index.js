import React from 'react';

const ModalCloseButton = props => {
  const { onClick } = props;
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
    <img
      className="closeButton"
      id="closeButton"
      src={require('../../assets/img/close.png')}
      alt={'Close'}
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '13px',
        right: '13px',
        width: '15px',
        height: '15px',
        cursor: 'pointer'
      }}
    />
  );
};

export default ModalCloseButton;

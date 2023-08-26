import React, { MouseEventHandler } from 'react';
import { Modal, Card, Button } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import './WarningModal.scss';
import { HeadingFour } from 'Components/Headings';

interface WarningModalProps {
  isOpen: boolean;
  header: string;
  text: string;
  continueLabel: string;
  onContinue: MouseEventHandler;
  handleClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
  cancelLabel?: string;
  onCancel?: MouseEventHandler;
  hideWarningIcon: boolean;
}

const WarningModal: React.FC<WarningModalProps> = ({
  isOpen,
  handleClose,
  onCancel,
  onContinue,
  header,
  text,
  continueLabel,
  cancelLabel = 'CANCEL',
  hideWarningIcon = false
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      disableAutoFocus={true}
      disableRestoreFocus={true}
      aria-labelledby="previous-date-selected"
      aria-describedby="back-date-warning">
      <Card className="back-date-modal-card" data-testid="back-date-modal">
        <div className="header-container">
          {!hideWarningIcon && <WarningIcon />}
          <HeadingFour label={header} />
        </div>
        <p>{text}</p>
        <div className="buttons-wrapper">
          <span>
            {cancelLabel && onCancel && (
              <Button variant="contained" data-testid="back-date-modal-cancel" onClick={onCancel}>
                {cancelLabel}
              </Button>
            )}
            <Button variant="contained" data-testid="back-date-modal-continue" onClick={onContinue}>
              {continueLabel}
            </Button>
          </span>
        </div>
      </Card>
    </Modal>
  );
};

export default WarningModal;

import React, { useState } from 'react';
import styled from 'styled-components';
import Popper from '@material-ui/core/Popper';
import IconButton from '@material-ui/core/IconButton';

import { paragraphBold } from '../../styles/Typography';
import NotesIcon from '../../assets/img/notes.png';

function NotesPopover({ notesData, className }) {
  const [arrowRef, setArrowRef] = useState(null);
  const { notes, anchorEl, onClickHandler } = notesData;

  const handleArrowRef = node => {
    setArrowRef(node);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  if (notes === 'null' || !notes) return null;

  return (
    <div className={`${className} NotesPopover`}>
      {anchorEl && (
        <Popper
          id={id}
          className="notes-tooltip"
          open={open}
          anchorEl={anchorEl}
          placement="bottom-end"
          disablePortal
          modifiers={{
            flip: {
              enabled: true
            },
            arrow: {
              enabled: true,
              element: arrowRef
            }
          }}>
          <div className={'popper-container'}>
            <span className="arrow" ref={handleArrowRef} />
            <div className={'popper-content'}>
              <p className="notes-header">Special Requests</p>
              <p className="notes-text">{notes}</p>
            </div>
          </div>
        </Popper>
      )}
      <IconButton onClick={onClickHandler}>
        <img src={NotesIcon} alt="paper-icon" className="paper-icon" />
      </IconButton>
    </div>
  );
}

export default styled(NotesPopover)`
  &.NotesPopover {
    z-index: 1;

    .notes-tooltip {
      top: 10px !important;
      left: 30px !important;
      z-index: 1;
      border-radius: 5px;
    }

    .popper-container {
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.16), 0 2px 5px 0 rgba(0, 0, 0, 0.26);
      z-index: 1;
      border-radius: 5px;
      overflow: hidden;
    }
    .popper-content {
      padding: 20px;
      background-color: #ffffff;
      width: 27rem;
    }
    .notes-header {
      ${paragraphBold}
      margin: 0;
    }
    .notes-text {
      overflow-wrap: break-word;
    }
    .arrow {
      position: absolute;
      padding: 1em;
      box-sizing: border-box;
    }
    .arrow::after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      box-sizing: border-box;
      border: 1em solid black;
      border-color: transparent transparent #ffffff #ffffff;
      transform-origin: 0 0;
      transform: rotate(135deg);
      box-shadow: -2px 2px 4px -2px rgba(0, 0, 0, 0.23);
      top: 0;
      left: 1px;
    }

    .paper-icon {
      width: 18px;
      height: 18px;
      align-self: center;
    }
  }
`;

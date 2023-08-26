import React from 'react';
import { Menu, Button, MenuItem } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ClearIcon from '@material-ui/icons/Clear';
import './SimpleMenu.scss';

type MenuItemType = {
  disabled?: boolean;
  onClick?: () => void;
  label: string;
  dataTestId?: string;
};

interface SimpleMenuProps {
  isParentOpen: boolean;
  handleParentClose: () => void;
  options: [MenuItemType];
}

const SimpleMenu: React.FC<SimpleMenuProps> = ({ handleParentClose, isParentOpen, options }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="edit-simple-menu">
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        data-testid="simple-menu"
        onClick={e => {
          if (isParentOpen) {
            handleParentClose();
            setAnchorEl(null);
          } else handleClick(e);
        }}>
        {isParentOpen ? <ClearIcon /> : <MoreHorizIcon />}
      </Button>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={!!anchorEl} onClose={handleClose}>
        {options.map((item: MenuItemType) => (
          <MenuItem
            data-testid={item.dataTestId}
            key={item.dataTestId}
            disabled={item.disabled}
            onClick={() => {
              item.onClick && item.onClick();
              handleClose();
            }}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default SimpleMenu;

import React from 'react';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import colors from '../../../styles/Colors';

const useStyles = makeStyles({
  select: {
    '& li': {
      fontSize: 15
    }
  }
});

// eslint-disable-next-line
const SelectFilterBase = ({ field, form, ...props }) => {
  const { className, fieldlabel, options, value, clear, ...rest } = props;

  const classes = useStyles();

  return (
    <div className={!clear ? `${className}__select-filter` + ' noclear' : `${className}__select-filter`}>
      {clear && (
        <FormLabel htmlFor={field.name}>
          {fieldlabel}
          {value && (
            <button
              type="button"
              onClick={e => {
                clear(e, field.name, form);
              }}
              className="clear">
              clear
            </button>
          )}
        </FormLabel>
      )}
      <FormControl variant="outlined" fullWidth>
        <Select
          {...rest}
          {...field}
          MenuProps={{ classes: { paper: classes.select } }}
          value={value}
          labelid="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined">
          {options.map(option => {
            return (
              <MenuItem value={option.value} key={option.name}>
                {option.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
};

const SelectFilter = styled(SelectFilterBase)`
  &__select-filter {
    width: 100%;
    margin: 0 0 25px 0;

    &.noclear {
      .MuiInputBase-root {
        padding: 0 14px;
      }
    }

    .MuiSelect-outlined {
      font-size: 15px;
    }

    .clear {
      color: #2875c3;
      float: right;
      text-transform: uppercase;
      font-family: 'IBMPlexSans-Bold';
      cursor: pointer;
      font-size: 12px;
      background: none;
      border: 0;
      padding: 0;
      position: relative;
      top: -2px;
    }

    .MuiSelect-selectMenu:focus {
      background: white;
    }

    .MuiOutlinedInput-notchedOutline {
      border-color: ${colors.text.lightGray2};
    }

    .MuiOutlinedInput-input {
      padding: 0;
    }

    label {
      display: block;
      text-transform: uppercase;
      font-family: 'IBMPlexSans-Bold';
      font-size: 12px;
      color: ${colors.text.secondary};
      margin-bottom: 10px;
    }

    .MuiInputBase-root {
      padding: 10px 14px;
    }

    .MuiListItem-root {
      font-size: 15px;
    }
  }
`;

export default SelectFilter;

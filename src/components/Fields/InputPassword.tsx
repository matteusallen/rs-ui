import React, { useState } from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import './InputPassword.scss';

const InputPassword: React.FC<any> = (props: any) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { onChange, label, name, ...rest } = props;

  return (
    <div className="input-password-wrapper">
      <TextField
        id="password"
        classes={{
          root: 'input-password'
        }}
        label={label}
        type={showPassword ? 'text' : 'password'}
        name={name || 'password'}
        autoComplete={name || 'password'}
        variant="filled"
        onChange={onChange}
        InputProps={{
          classes: {
            adornedEnd: 'input-password-adornment-end'
          },
          endAdornment: (
            <InputAdornment position="end" classes={{ root: 'input-password-adornment' }}>
              <span className="show-hide-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'HIDE' : 'SHOW'}
              </span>
            </InputAdornment>
          )
        }}
        {...rest}
      />
    </div>
  );
};

export default InputPassword;

import React, { PureComponent } from 'react';
import { FormControl, Input, InputLabel, withStyles } from '@material-ui/core';

import colors from '../../styles/Colors';
import StripeInput from './StripeInput';

const labelStyles = {
  root: {
    color: `${colors.text.secondary}`,
    fontFamily: 'IBMPlexSans-Regular',
    fontSize: '15px',
    lineHeight: '24px',
    marginBottom: '5px',
    '& ~ div.MuiInput-formControl': {
      marginTop: '0 !important'
    }
  }
};

const inputStyles = {
  root: {
    height: '54px'
  }
};

const formControlStyles = {
  root: {
    borderRadius: '5px 5px 0 0',
    boxSizing: 'content-box',
    marginBottom: '5px',
    marginTop: '10px',
    height: '56px',
    '& label[class*="MuiInputLabel-root"]': {
      color: `${colors.text.secondary}`
    }
  }
};

const StyledLabel = withStyles(labelStyles, { withTheme: true })(InputLabel);
const StyledInput = withStyles(inputStyles, { withTheme: true })(Input);
const StyledFormControl = withStyles(formControlStyles, { withTheme: true })(FormControl);

export default class extends PureComponent {
  static displayName = 'StripeElementWrapper';

  state = {
    focused: false,
    empty: true,
    error: false,
    value: ''
  };

  handleBlur = () => {
    this.setState({ focused: false });
  };

  handleFocus = () => {
    this.setState({ focused: true });
  };

  handleChange = changeObj => {
    this.setState({
      error: changeObj.error,
      empty: changeObj.empty
    });
    if (this.props.changeCallback) {
      this.props.changeCallback();
    }
  };

  render() {
    const { component, label } = this.props;
    const { focused, empty, error } = this.state;
    const errorStyles = {
      color: `${colors.error.primary}`,
      fontFamily: 'IBMPlexSans-Regular',
      fontSize: '12px',
      paddingLeft: '12px',
      textTransform: 'uppercase'
    };
    const pastExpiryYearCode = 'invalid_expiry_year_past';

    return (
      <div style={{ textAlign: 'left' }}>
        <StyledFormControl fullWidth margin="normal">
          <StyledLabel focused={focused} shrink={focused || !empty} error={!!error} variant="filled">
            {label}
          </StyledLabel>
          <StyledInput
            fullWidth
            error={!!error}
            inputComponent={StripeInput}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            inputProps={{ component }}
            value={this.state.value}
          />
        </StyledFormControl>
        {error && error.code !== pastExpiryYearCode && <span style={errorStyles}>{error.message}</span>}
        {/* Customize and shorten past expiration error message */}
        {error && error.code === pastExpiryYearCode && <span style={errorStyles}>{'PAST EXPIRY YEAR'}</span>}
      </div>
    );
  }
}

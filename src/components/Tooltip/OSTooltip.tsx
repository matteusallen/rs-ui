import React from 'react';
import { withStyles, Theme } from '@material-ui/core/styles';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';

const tooltipBackgroundColor = '#2875c3';

// eslint-disable-next-line
const TooltipBase = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: tooltipBackgroundColor,
    fontFamily: 'IBMPlexSans-Regular, Roboto, Helvetica, Arial, sans-serif',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 15,
    padding: 12,
    maxWidth: '400px !important',
    overflowWrap: 'break-word'
  },
  arrow: {
    color: tooltipBackgroundColor
  }
}))(Tooltip);

const OSTooltip: React.FC<TooltipProps> = (props: TooltipProps): JSX.Element => {
  const { children, ...rest } = props;
  return <TooltipBase {...rest}>{children}</TooltipBase>;
};

export default OSTooltip;

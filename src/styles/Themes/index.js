import { createMuiTheme } from '@material-ui/core/styles';

const os_theme = createMuiTheme({
  typography: {
    fontFamily: 'IBMPlexSans-Regular, Roboto, Helvetica, Arial, sans-serif'
  },
  palette: {
    primary: { 500: '#2875c3' }
  }
});

export default os_theme;

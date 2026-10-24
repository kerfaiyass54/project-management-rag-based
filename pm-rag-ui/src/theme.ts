import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#635bff',
      light: '#8b85ff',
      dark: '#4438ca',
    },
    secondary: {
      main: '#00b8a9',
    },
    background: {
      default: '#f6f7fb',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 800 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none', boxShadow: '0 8px 30px rgba(44, 52, 75, .06)' } } },
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiTableHead: { styleOverrides: { root: { backgroundColor: '#f8f9fc' } } },
  },
});

export default theme;
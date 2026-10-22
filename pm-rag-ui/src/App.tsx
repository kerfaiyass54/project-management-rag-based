
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import AppRouter from './AppRouter';
import Iris from './components/Iris';
import theme from './theme';
import './index.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Iris />
      <SnackbarProvider maxSnack={3}>
        <AppRouter />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
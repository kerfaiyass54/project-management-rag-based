import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Forbidden = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h1" component="h1" gutterBottom>
        403
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        Forbidden
      </Typography>
      <Typography variant="body1" gutterBottom>
        You don't have permission to access this page.
      </Typography>
      <Button component={Link} to="/" variant="contained" color="primary">
        Go to Homepage
      </Button>
    </Box>
  );
};

export default Forbidden;
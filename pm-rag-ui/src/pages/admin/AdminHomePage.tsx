import { Box, Typography, Card, CardContent, CardActions, Button } from '@mui/material';
import { Group, Build, Dashboard } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const AdminHomePage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)', // Adjust 64px based on Navbar height
        p: 3,
        textAlign: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '4rem', md: '6rem' } }}>
            Dashboard
          </Typography>
        </motion.div>
        <Typography variant="h6" sx={{ mb: 6, color: 'text.secondary' }}>
          From here, you can manage the core aspects of the application.
        </Typography>
      </motion.div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 4, width: '100%', maxWidth: 1200 }}>
          <Box>
            <motion.div variants={itemVariants}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '15px',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                  transition: 'background-color 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                  },
                }}
              >
                <CardContent>
                  <Dashboard sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h5" component="div">
                    Dashboard
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    View and manage the workspace.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button component={Link} to="/admin" size="small">
                    Open dashboard
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Box>
          <Box>
            <motion.div variants={itemVariants}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '15px',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                  transition: 'background-color 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                  },
                }}
              >
                <CardContent>
                  <Group sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h5" component="div">
                    Manage Engineers
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Add, edit, and remove engineers from the system.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button component={Link} to="/admin/engineers" size="small">
                    Manage Engineers
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Box>
          <Box>
            <motion.div variants={itemVariants}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '15px',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                  transition: 'background-color 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                  },
                }}
              >
                <CardContent>
                  <Build sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h5" component="div">
                    Manage Skills
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Define and assign skills to engineers.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button component={Link} to="/admin/skills" size="small">
                    Manage Skills
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default AdminHomePage;
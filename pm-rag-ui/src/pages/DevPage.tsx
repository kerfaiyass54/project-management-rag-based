import { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Badge,
  Chip,
  LinearProgress,
  Switch,
  Checkbox,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tooltip,
  Skeleton,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from '@mui/material';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import { useSnackbar } from 'notistack';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MailIcon from '@mui/icons-material/Mail';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';

const chartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 },
];

const MotionPaper = motion(Paper);

const AnimatedSection = ({ children }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

const DevPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const paperHover = {
    scale: 1.03,
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.3)',
    transition: {
      type: 'spring',
      stiffness: 300,
    },
  };

  const speedDialActions = [
    { icon: <SaveIcon />, name: 'Save' },
    { icon: <PrintIcon />, name: 'Print' },
    { icon: <ShareIcon />, name: 'Share' },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ color: 'white', fontWeight: 'bold', mb: 6 }}>
        Component Showcase
      </Typography>

      <Grid container spacing={4}>
        {/* Form Controls */}
        <Grid item xs={12}>
          <AnimatedSection>
            <MotionPaper whileHover={paperHover} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Form Controls</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Outlined" variant="outlined" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Filled" variant="filled" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Standard" variant="standard" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select</InputLabel>
                    <Select label="Select">
                      <MenuItem value={1}>Option 1</MenuItem>
                      <MenuItem value={2}>Option 2</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FormControlLabel control={<Switch defaultChecked />} label="Switch" />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="Checkbox" />
                  <RadioGroup row>
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                  </RadioGroup>
                </Grid>
              </Grid>
            </MotionPaper>
          </AnimatedSection>
        </Grid>

        {/* Data Display */}
        <Grid item xs={12}>
          <AnimatedSection>
            <MotionPaper whileHover={paperHover} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Data Display</Typography>
              <Grid container spacing={3} alignItems="center">
                <Grid item><Avatar>H</Avatar></Grid>
                <Grid item><Avatar sx={{ bgcolor: 'primary.main' }}>OP</Avatar></Grid>
                <Grid item>
                  <Badge badgeContent={4} color="primary">
                    <MailIcon color="action" />
                  </Badge>
                </Grid>
                <Grid item><Chip label="Chip" /></Grid>
                <Grid item>
                  <Tooltip title="This is a tooltip">
                    <Button>Tooltip</Button>
                  </Tooltip>
                </Grid>
              </Grid>
            </MotionPaper>
          </AnimatedSection>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={4}>
          <AnimatedSection>
            <MotionPaper whileHover={paperHover} sx={{ p: 3, height: 400, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>Bar Chart</Typography>
              <Box sx={{ flexGrow: 1, width: '100%', height: '100%' }}>
                <BarChart
                  dataset={chartData}
                  xAxis={[{ scaleType: 'band', dataKey: 'name' }]}
                  series={[{ dataKey: 'value', label: 'Value' }]}
                  layout="vertical"
                />
              </Box>
            </MotionPaper>
          </AnimatedSection>
        </Grid>
        <Grid item xs={12} md={4}>
          <AnimatedSection>
            <MotionPaper whileHover={paperHover} sx={{ p: 3, height: 400, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>Line Chart</Typography>
              <Box sx={{ flexGrow: 1, width: '100%', height: '100%' }}>
                <LineChart
                  dataset={chartData}
                  xAxis={[{ scaleType: 'point', dataKey: 'name' }]}
                  series={[{ dataKey: 'value', label: 'Value' }]}
                />
              </Box>
            </MotionPaper>
          </AnimatedSection>
        </Grid>
        <Grid item xs={12} md={4}>
          <AnimatedSection>
            <MotionPaper whileHover={paperHover} sx={{ p: 3, height: 400, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>Pie Chart</Typography>
              <Box sx={{ flexGrow: 1, width: '100%', height: '100%' }}>
                <PieChart
                  series={[
                    {
                      data: chartData.map(item => ({ id: item.name, value: item.value, label: item.name })),
                    },
                  ]}
                />
              </Box>
            </MotionPaper>
          </AnimatedSection>
        </Grid>

        {/* Feedback */}
        <Grid item xs={12} md={6}>
          <AnimatedSection>
            <MotionPaper whileHover={paperHover} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Feedback</Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button variant="contained" onClick={() => setDialogOpen(true)}>Open Dialog</Button>
                <Button variant="contained" onClick={() => enqueueSnackbar('This is a notification!', { variant: 'success' })}>
                  Show Notification
                </Button>
              </Box>
              <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogContent>This is a sample dialog.</DialogContent>
                <DialogActions>
                  <Button onClick={() => setDialogOpen(false)}>Close</Button>
                </DialogActions>
              </Dialog>
              <Typography variant="h6" gutterBottom>Progress</Typography>
              <LinearProgress variant="determinate" value={60} sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>Skeleton</Typography>
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="rectangular" width="100%" height={118} />
            </MotionPaper>
          </AnimatedSection>
        </Grid>

        {/* Navigation & Surface */}
        <Grid item xs={12} md={6}>
          <AnimatedSection>
            <MotionPaper whileHover={paperHover} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Navigation & Surface</Typography>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Accordion 1</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Accordion 2</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </MotionPaper>
          </AnimatedSection>
        </Grid>
      </Grid>

      <SpeedDial
        ariaLabel="SpeedDial"
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
        icon={<SpeedDialIcon />}
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
    </Container>
  );
};

export default DevPage;
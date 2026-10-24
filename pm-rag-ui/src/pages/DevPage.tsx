import { useState } from 'react';
import { Box, Button, Card, CardContent, Chip, Container, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Switch, Typography } from '@mui/material';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import { motion } from 'framer-motion';

const chartData = [400, 300, 600, 800, 500, 700];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export default function DevPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  return <Container className="page-enter" maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
    <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-.04em' }}>Component showcase</Typography>
    <Typography color="text.secondary" sx={{ mb: 4 }}>Reusable surfaces, feedback, and data visualization patterns.</Typography>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
      {[
        <BarChart key="bar" height={260} xAxis={[{ scaleType: 'band', data: months }]} series={[{ data: chartData, color: '#635bff' }]} />,
        <LineChart key="line" height={260} xAxis={[{ scaleType: 'point', data: months }]} series={[{ data: chartData, color: '#00a896' }]} />,
        <PieChart key="pie" height={260} series={[{ data: chartData.map((value, id) => ({ id, value, label: months[id] })) }]} />,
      ].map((chart, index) => <motion.div key={index} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .1 }}><Card sx={{ border: 1, borderColor: 'divider' }}><CardContent><Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>{['Bar chart', 'Line chart', 'Pie chart'][index]}</Typography>{chart}</CardContent></Card></motion.div>)}
    </Box>
    <Card sx={{ mt: 3, border: 1, borderColor: 'divider' }}><CardContent><Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { sm: 'center' } }}><Chip label="Feedback" color="primary" /><Switch defaultChecked /><Typography color="text.secondary">Live updates enabled</Typography><Button variant="contained" onClick={() => setDialogOpen(true)} sx={{ ml: { sm: 'auto' } }}>Open dialog</Button></Box><LinearProgress variant="determinate" value={68} sx={{ mt: 3, borderRadius: 4 }} /></CardContent></Card>
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}><DialogTitle>Reusable dialog</DialogTitle><DialogContent>This is the shared dialog pattern.</DialogContent><DialogActions><Button onClick={() => setDialogOpen(false)}>Close</Button></DialogActions></Dialog>
  </Container>;
}

import { ArrowForwardRounded, AutoAwesomeRounded, GroupsRounded, InsightsRounded } from '@mui/icons-material';
import { Box, Button, Chip, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const features = [
  { icon: GroupsRounded, title: 'Find your people', text: 'Keep engineering profiles organized and easy to discover.' },
  { icon: InsightsRounded, title: 'See the signal', text: 'Turn your team data into a clear, actionable overview.' },
  { icon: AutoAwesomeRounded, title: 'Move with confidence', text: 'Match skills and experience to the work that matters.' },
];

export default function HomePage() {
  return (
    <Box sx={{ minHeight: 'calc(100vh - 84px)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', bgcolor: 'primary.main', opacity: .08, filter: 'blur(4px)', top: -120, right: -100 }} />
      <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', bgcolor: 'secondary.main', opacity: .08, filter: 'blur(4px)', bottom: -100, left: -80 }} />
      <Container className="page-enter" maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, position: 'relative' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 760 }}>
          <Chip label="Project intelligence, beautifully organized" color="primary" variant="outlined" sx={{ width: 'fit-content', fontWeight: 700 }} />
          <Typography variant="h1" sx={{ fontSize: { xs: '3.5rem', md: '6.5rem' }, lineHeight: .95, letterSpacing: '-.07em', fontWeight: 800 }}>
            Make every <Box component="span" sx={{ color: 'primary.main' }}>skill</Box> count.
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 650, lineHeight: 1.5 }}>
            PM-RAG gives modern engineering teams one calm place to understand people, capabilities, and momentum.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, pt: 2 }}>
            <Button component={Link} to="/about" variant="contained" size="large" endIcon={<ArrowForwardRounded />} sx={{ borderRadius: 3, px: 3 }}>Explore PM-RAG</Button>
            <Button component={Link} to="/contact" variant="outlined" size="large" sx={{ borderRadius: 3, px: 3 }}>Talk to us</Button>
          </Box>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mt: { xs: 8, md: 12 } }}>
          {features.map(({ icon: Icon, title, text }, index) => (
            <motion.div key={title} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 + index * .12 }}>
              <Box sx={{ height: '100%', p: 3, borderRadius: 4, bgcolor: 'background.paper', border: 1, borderColor: 'divider', transition: 'transform 220ms ease, box-shadow 220ms ease', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 18px 40px rgba(44,52,75,.1)' } }}>
                <Icon color="primary" sx={{ fontSize: 34, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{title}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>{text}</Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
import { useEffect, useState } from 'react';
import { Alert, Box, Card, CardContent, Chip, CircularProgress, Container, Stack, Typography } from '@mui/material';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { BarChart } from '@mui/x-charts/BarChart';
import { motion } from 'framer-motion';
import StatusChip from '../../components/StatusChip';
import { usersSkillsApi } from '../../api/usersSkillsApi';
import type { SkillUsage } from '../../api/usersSkillsApi';

const MotionCard = motion(Card);

export default function DashboardPage() {
  const [data, setData] = useState<{ engineers: number; positions: Record<string, number>; usage: SkillUsage } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([usersSkillsApi.getEngineerTotal(), usersSkillsApi.getEngineersByType(), usersSkillsApi.getSkillUsage()])
      .then(([engineers, positions, usage]) => { if (active) setData({ engineers, positions, usage }); })
      .catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : 'Unable to load dashboard analytics'); });
    return () => { active = false; };
  }, []);

  if (error) return <Container maxWidth="xl" sx={{ py: 6 }}><Alert severity="error">{error}</Alert></Container>;
  if (!data) return <Container maxWidth="xl" sx={{ py: 10, display: 'grid', placeItems: 'center' }}><CircularProgress /></Container>;

  const labels = Object.keys(data.positions);
  const values = labels.map((label) => data.positions[label]);
  const cards = [
    { key: 'engineers', label: 'Total engineers', value: data.engineers, caption: 'Profiles in the directory', icon: GroupsRoundedIcon, color: '#635bff' },
    { key: 'positions', label: 'Active positions', value: labels.length, caption: 'Roles represented', icon: TrendingUpRoundedIcon, color: '#00a896' },
    { key: 'most-used', label: 'Most used skill', value: data.usage.mostUsed?.skillName ?? '—', caption: 'Based on assignments', icon: StarRoundedIcon, color: '#f59e0b' },
  ];

  return <Container className="page-enter" maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
    <Box sx={{ mb: 5 }}><Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: 1.5 }}>Workspace overview</Typography><Typography variant="h3" component="h1" sx={{ fontWeight: 800, letterSpacing: '-.04em', mt: .5 }}>Dashboard</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>A live view of your engineering capacity and capability mix.</Typography></Box>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2.5, mb: 3 }}>
      {cards.map((card, index) => { const Icon = card.icon; return <MotionCard key={card.key} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .1 }} sx={{ border: 1, borderColor: 'divider', overflow: 'hidden', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 18px 38px rgba(44,52,75,.12)' } }}><CardContent><Box sx={{ width: 42, height: 42, borderRadius: 2, display: 'grid', placeItems: 'center', bgcolor: `${card.color}18`, color: card.color, mb: 2 }}><Icon /></Box><Typography variant="body2" color="text.secondary">{card.label}</Typography><Typography variant="h4" sx={{ fontWeight: 800, mt: .5, overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.value}</Typography><Typography variant="caption" color="text.secondary">{card.caption}</Typography></CardContent></MotionCard>; })}
    </Box>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.5fr) minmax(300px, 1fr)' }, gap: 3 }}>
      <Card sx={{ border: 1, borderColor: 'divider', p: 2 }}><Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1, pt: 1 }}><Box><Typography variant="h6" sx={{ fontWeight: 800 }}>Team composition</Typography><Typography variant="body2" color="text.secondary">Engineers by position</Typography></Box><Chip icon={<GroupsRoundedIcon />} label={`${data.engineers} total`} color="primary" variant="outlined" /></Box><BarChart height={320} xAxis={[{ scaleType: 'band', data: labels.length ? labels : ['No data'] }]} series={[{ data: values.length ? values : [0], color: '#635bff' }]} borderRadius={8} margin={{ left: 50, right: 20, top: 30, bottom: 50 }} /></Card>
      <Card sx={{ border: 1, borderColor: 'divider', p: 3 }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}><AutoAwesomeRoundedIcon color="secondary" /><Typography variant="h6" sx={{ fontWeight: 800 }}>Skill signals</Typography></Box><Stack spacing={2}><Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(0,184,169,.08)' }}><Typography variant="caption" color="text.secondary">Most used</Typography><Typography variant="h6" sx={{ fontWeight: 800, mt: .5 }}>{data.usage.mostUsed?.skillName ?? 'No assignments yet'}</Typography>{data.usage.mostUsed && <StatusChip value={data.usage.mostUsed.skillField} />}</Box><Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(99,91,255,.08)' }}><Typography variant="caption" color="text.secondary">Least used</Typography><Typography variant="h6" sx={{ fontWeight: 800, mt: .5 }}>{data.usage.leastUsed?.skillName ?? 'No assignments yet'}</Typography>{data.usage.leastUsed && <StatusChip value={data.usage.leastUsed.skillField} />}</Box></Stack></Card>
    </Box>
  </Container>;
}

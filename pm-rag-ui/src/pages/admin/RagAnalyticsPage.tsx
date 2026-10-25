import { useMemo, useState } from 'react';
import {
  Alert, Box, Button, Card, Chip, CircularProgress, Container, FormControl,
  InputLabel, MenuItem, Select, Stack, TextField, Typography,
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { motion } from 'framer-motion';
import { usersSkillsApi } from '../../api/usersSkillsApi';
import type { RagAnalysis } from '../../api/usersSkillsApi';

type ViewMode = 'analytics' | 'interpretation';
type ChartType = 'bar' | 'line' | 'pie';
type MemoryItem = { query: string; answer: string; confidence: number; conversationId: string; createdAt: string };
const memoryKey = 'pm-rag-conversation-memory';

const MotionCard = motion(Card);

export default function RagAnalyticsPage() {
  const [mode, setMode] = useState<ViewMode>('analytics');
  const [chart, setChart] = useState<ChartType>('bar');
  const [query, setQuery] = useState('');
  const [analysis, setAnalysis] = useState<RagAnalysis | null>(null);
  const [memory, setMemory] = useState<MemoryItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(memoryKey) ?? '[]') as MemoryItem[]; } catch { return []; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const saveMemory = (result: RagAnalysis, originalQuery: string) => {
    const next = [
      { query: originalQuery, answer: result.answer, confidence: result.confidence, conversationId: result.conversation_id, createdAt: new Date().toISOString() },
      ...memory,
    ].slice(0, 12);
    setMemory(next);
    localStorage.setItem(memoryKey, JSON.stringify(next));
  };

  const runQuery = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const result = await usersSkillsApi.analyzeRag(query.trim(), analysis?.conversation_id);
      setAnalysis(result);
      saveMemory(result, query.trim());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to run RAG analysis');
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo(() => {
    const values = analysis?.sources.slice(0, 6).map((source) => Number((source.score * 100).toFixed(1))) ?? [];
    const labels = analysis?.sources.slice(0, 6).map((source) => source.source_id) ?? [];
    return { labels: labels.length ? labels : ['No retrieved sources'], values: values.length ? values : [0] };
  }, [analysis]);

  return (
    <Container maxWidth="xl" className="page-enter" sx={{ py: { xs: 3, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: 1.5 }}>RAG workspace</Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-.04em' }}>Analytics & interpretation</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>Ask operational questions, inspect retrieved evidence, and keep the conversation context visible.</Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.6fr) minmax(300px, .8fr)' }, gap: 3 }}>
        <Stack spacing={3}>
          <Card sx={{ p: { xs: 2, md: 3 }, border: 1, borderColor: 'divider' }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Response mode</InputLabel>
                <Select value={mode} label="Response mode" onChange={(event) => setMode(event.target.value as ViewMode)}>
                  <MenuItem value="analytics">Analytics</MenuItem>
                  <MenuItem value="interpretation">Interpretation</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Chart type</InputLabel>
                <Select value={chart} label="Chart type" onChange={(event) => setChart(event.target.value as ChartType)}>
                  <MenuItem value="bar">Bar chart</MenuItem>
                  <MenuItem value="line">Line chart</MenuItem>
                  <MenuItem value="pie">Pie chart</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField fullWidth multiline minRows={2} value={query} label={mode === 'analytics' ? 'Ask for a ranking or gap analysis' : 'Ask for an interpretation'} placeholder="Show the top 5 most used skills" onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void runQuery(); } }} />
              <Button variant="contained" startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SendRoundedIcon />} disabled={loading || !query.trim()} onClick={() => void runQuery()} sx={{ minWidth: 150, alignSelf: 'stretch' }}>Run query</Button>
            </Stack>
          </Card>
          {error && <Alert severity="error">{error}</Alert>}
          {analysis && (
            <MotionCard initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} sx={{ p: { xs: 2, md: 3 }, border: 1, borderColor: 'divider' }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box><Typography variant="h6" sx={{ fontWeight: 800 }}>{mode === 'analytics' ? 'Analytics result' : 'Interpretation result'}</Typography><Typography variant="body2" color="text.secondary">{analysis.answer}</Typography></Box>
                <Chip label={`${Math.round(analysis.confidence * 100)}% confidence`} color={analysis.self_check_passed ? 'success' : 'warning'} />
              </Stack>
              {chart === 'bar' && <BarChart height={300} xAxis={[{ scaleType: 'band', data: chartData.labels }]} series={[{ data: chartData.values, color: '#635bff' }]} borderRadius={8} margin={{ left: 50, right: 20, top: 25, bottom: 70 }} />}
              {chart === 'line' && <LineChart height={300} xAxis={[{ scaleType: 'point', data: chartData.labels }]} series={[{ data: chartData.values, label: 'Evidence score', color: '#00a896' }]} margin={{ left: 50, right: 20, top: 25, bottom: 70 }} />}
              {chart === 'pie' && <PieChart height={300} series={[{ data: chartData.labels.map((label, index) => ({ id: label, label, value: chartData.values[index] })) }]} />}
              <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                {analysis.rewritten_queries.map((item) => <Chip key={item} size="small" variant="outlined" label={item} />)}
              </Stack>
            </MotionCard>
          )}
          {!analysis && <Card sx={{ p: 6, textAlign: 'center', border: 1, borderColor: 'divider' }}><AutoAwesomeRoundedIcon color="primary" sx={{ fontSize: 44 }} /><Typography variant="h6" sx={{ mt: 1, fontWeight: 800 }}>Your RAG result will appear here</Typography><Typography color="text.secondary">Choose a mode and ask the admin assistant a question.</Typography></Card>}
        </Stack>
        <Card sx={{ p: 3, border: 1, borderColor: 'divider', alignSelf: 'start' }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}><PsychologyRoundedIcon color="secondary" /><Typography variant="h6" sx={{ fontWeight: 800 }}>Conversation memory</Typography></Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Recent admin questions are kept locally for quick follow-up context.</Typography>
          <Stack spacing={1.5}>{memory.length ? memory.map((item) => <Box key={`${item.conversationId}-${item.createdAt}`} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover', cursor: 'pointer' }} onClick={() => { setQuery(item.query); setAnalysis(null); }}><Typography variant="body2" sx={{ fontWeight: 700 }}>{item.query}</Typography><Typography variant="caption" color="text.secondary">{Math.round(item.confidence * 100)}% confidence · {new Date(item.createdAt).toLocaleString()}</Typography></Box>) : <Typography variant="body2" color="text.secondary">No conversation turns yet.</Typography>}</Stack>
        </Card>
      </Box>
    </Container>
  );
}

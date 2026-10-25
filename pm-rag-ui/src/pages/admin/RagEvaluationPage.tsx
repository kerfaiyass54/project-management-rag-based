import { useState } from 'react';
import { Alert, Box, Button, Card, Chip, CircularProgress, Container, Stack, TextField, Typography } from '@mui/material';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import { motion } from 'framer-motion';
import { usersSkillsApi } from '../../api/usersSkillsApi';
import type { RagEvaluation } from '../../api/usersSkillsApi';

const MotionCard = motion(Card);
const memoryKey = 'pm-rag-conversation-memory';

export default function RagEvaluationPage() {
  const [savedInput] = useState(() => {
    try {
      const latest = JSON.parse(localStorage.getItem(memoryKey) ?? '[]') as { query?: string; answer?: string }[];
      return { query: latest[0]?.query ?? '', answer: latest[0]?.answer ?? '' };
    } catch { return { query: '', answer: '' }; }
  });
  const [query, setQuery] = useState(savedInput.query);
  const [answer, setAnswer] = useState(savedInput.answer);
  const [contexts, setContexts] = useState('');
  const [reference, setReference] = useState('');
  const [result, setResult] = useState<RagEvaluation | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const evaluate = async () => {
    setLoading(true); setError('');
    try {
      setResult(await usersSkillsApi.evaluateRag({ query, answer, contexts: contexts.split('\n').map((item) => item.trim()).filter(Boolean), referenceAnswer: reference || undefined }));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to evaluate the RAG response');
    } finally { setLoading(false); }
  };

  return <Container maxWidth="xl" className="page-enter" sx={{ py: { xs: 3, md: 6 } }}>
    <Box sx={{ mb: 4 }}><Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: 1.5 }}>Quality control</Typography><Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-.04em' }}>RAG evaluation</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>Measure grounding, relevance, precision, and recall for an admin response.</Typography></Box>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) minmax(300px, .8fr)' }, gap: 3 }}>
      <Card sx={{ p: { xs: 2, md: 3 }, border: 1, borderColor: 'divider' }}>
        <Stack spacing={2}><TextField label="Query" value={query} onChange={(event) => setQuery(event.target.value)} /><TextField label="Answer" multiline minRows={4} value={answer} onChange={(event) => setAnswer(event.target.value)} /><TextField label="Retrieved contexts (one per line)" multiline minRows={5} value={contexts} onChange={(event) => setContexts(event.target.value)} /><TextField label="Reference answer (optional)" multiline minRows={2} value={reference} onChange={(event) => setReference(event.target.value)} /><Button variant="contained" startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AssessmentRoundedIcon />} disabled={loading || !query || !answer} onClick={() => void evaluate()}>Evaluate response</Button></Stack>
      </Card>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        {result ? <><Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>{[['Faithfulness', result.faithfulness], ['Relevancy', result.answer_relevancy], ['Precision', result.context_precision], ['Recall', result.context_recall]].map(([label, value], index) => <MotionCard key={String(label)} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .08 }} sx={{ p: 2.5, border: 1, borderColor: 'divider' }}><Typography variant="body2" color="text.secondary">{label}</Typography><Typography variant="h4" sx={{ fontWeight: 800 }}>{Math.round(Number(value) * 100)}%</Typography></MotionCard>)}</Box><Card sx={{ p: 3, border: 1, borderColor: 'divider' }}><Typography variant="h6" sx={{ fontWeight: 800 }}>Overall score</Typography><Typography variant="h2" color="primary.main" sx={{ fontWeight: 900 }}>{Math.round(result.overall * 100)}%</Typography><Chip label={`${Number(result.details.contexts_evaluated ?? 0)} contexts evaluated`} variant="outlined" /></Card><Button variant="outlined" startIcon={<PictureAsPdfRoundedIcon />} onClick={() => window.print()}>Export evaluation to PDF</Button></> : <Card sx={{ p: 5, textAlign: 'center', border: 1, borderColor: 'divider' }}><AssessmentRoundedIcon color="primary" sx={{ fontSize: 44 }} /><Typography variant="h6" sx={{ mt: 1, fontWeight: 800 }}>No evaluation yet</Typography><Typography color="text.secondary">Submit a response to generate quality metrics.</Typography></Card>}
      </Stack>
    </Box>
  </Container>;
}

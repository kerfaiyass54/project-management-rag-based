import { useState } from 'react';
import { Alert, Box, Button, Container, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usersSkillsApi } from '../../api/usersSkillsApi';
import type { EngineerExperience } from '../../api/usersSkillsApi';

export default function AddEngineerPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ engineerName: '', engineerSpeciality: '', engineerExperience: 'MID' as EngineerExperience, engineerPosition: '', teamId: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: '' }));
  };
  const validate = () => {
    const errors: Record<string, string> = {};
    if (form.engineerName.trim().length < 2) errors.engineerName = 'Enter at least 2 characters.';
    if (form.engineerSpeciality.trim().length < 2) errors.engineerSpeciality = 'Enter a speciality.';
    if (!form.engineerPosition.trim()) errors.engineerPosition = 'Enter a position.';
    if (form.teamId && (!Number.isInteger(Number(form.teamId)) || Number(form.teamId) < 1)) errors.teamId = 'Team ID must be a positive number.';
    setFieldErrors(errors);
    setTouched({ engineerName: true, engineerSpeciality: true, engineerPosition: true, teamId: true });
    return Object.keys(errors).length === 0;
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await usersSkillsApi.createEngineer({ ...form, teamId: form.teamId ? Number(form.teamId) : null, engineerExperience: form.engineerExperience });
      navigate('/admin/engineers');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to create engineer'); }
    finally { setSubmitting(false); }
  };
  return <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
    <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800 }}>People directory</Typography>
    <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-.04em', mb: 1 }}>Add engineer</Typography>
    <Typography color="text.secondary" sx={{ mb: 4 }}>Create a profile that can be discovered by teams and project leads.</Typography>
    <Paper className="page-enter-delay" component="form" onSubmit={submit} noValidate sx={{ p: { xs: 2, md: 4 }, border: 1, borderColor: 'divider' }}>
      {error && <Alert severity="error" className="form-shake" sx={{ mb: 2 }}>{error}</Alert>}
      <Stack spacing={2.5}>
        <TextField label="Full name" required value={form.engineerName} onChange={(e) => update('engineerName', e.target.value)} onBlur={() => setTouched((current) => ({ ...current, engineerName: true }))} error={Boolean(touched.engineerName && fieldErrors.engineerName)} helperText={touched.engineerName ? fieldErrors.engineerName : 'Use the engineer’s full name.'} />
        <TextField label="Speciality" required value={form.engineerSpeciality} onChange={(e) => update('engineerSpeciality', e.target.value)} onBlur={() => setTouched((current) => ({ ...current, engineerSpeciality: true }))} error={Boolean(touched.engineerSpeciality && fieldErrors.engineerSpeciality)} helperText={touched.engineerSpeciality ? fieldErrors.engineerSpeciality : 'For example, Platform Engineering.'} />
        <TextField select label="Experience" value={form.engineerExperience} onChange={(e) => update('engineerExperience', e.target.value)}>
          {(['JUNIOR', 'MID', 'SENIOR', 'LEAD'] as EngineerExperience[]).map((level) => <MenuItem key={level} value={level}>{level}</MenuItem>)}
        </TextField>
        <TextField label="Position" required value={form.engineerPosition} onChange={(e) => update('engineerPosition', e.target.value)} onBlur={() => setTouched((current) => ({ ...current, engineerPosition: true }))} error={Boolean(touched.engineerPosition && fieldErrors.engineerPosition)} helperText={touched.engineerPosition ? fieldErrors.engineerPosition : ''} />
        <TextField label="Team ID" type="number" value={form.teamId} onChange={(e) => update('teamId', e.target.value)} onBlur={() => setTouched((current) => ({ ...current, teamId: true }))} error={Boolean(touched.teamId && fieldErrors.teamId)} helperText={touched.teamId ? fieldErrors.teamId : 'Optional.'} />
        <Box sx={{ display: 'flex', gap: 1.5, pt: 1 }}>
          <Button type="submit" variant="contained" disabled={submitting}>{submitting ? 'Saving...' : 'Create engineer'}</Button>
          <Button variant="outlined" disabled={submitting} onClick={() => navigate('/admin/engineers')}>Cancel</Button>
        </Box>
      </Stack>
    </Paper>
  </Container>;
}

import { useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from '@mui/material';
import { usersSkillsApi } from '../api/usersSkillsApi';
import type { Engineer, EngineerExperience } from '../api/usersSkillsApi';

interface Props { engineer: Engineer | null; open: boolean; onClose: () => void; onSaved: (engineer: Engineer) => void }
const levels: EngineerExperience[] = ['JUNIOR', 'MID', 'SENIOR', 'LEAD'];

export default function EngineerEditDialog({ engineer, open, onClose, onSaved }: Props) {
  const [form, setForm] = useState<Engineer | null>(engineer);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  if (!engineer || !form) return null;
  const update = (key: keyof Engineer, value: string | number | null) => setForm((current) => current ? { ...current, [key]: value } : current);
  const submit = async () => {
    if (!form.engineerName.trim() || !form.engineerSpeciality.trim() || !form.engineerPosition.trim()) {
      setError('Name, speciality, and position are required.');
      return;
    }
    setSaving(true); setError('');
    try {
      const saved = await usersSkillsApi.updateEngineer(form.id, {
        engineerName: form.engineerName,
        engineerSpeciality: form.engineerSpeciality,
        engineerExperience: form.engineerExperience,
        engineerPosition: form.engineerPosition,
        teamId: form.teamId,
      });
      onSaved(saved);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to update engineer');
    } finally { setSaving(false); }
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>Update engineer</DialogTitle>
      <DialogContent><Stack spacing={2} sx={{ pt: 1 }}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Name" required value={form.engineerName} onChange={(event) => update('engineerName', event.target.value)} />
        <TextField label="Speciality" required value={form.engineerSpeciality} onChange={(event) => update('engineerSpeciality', event.target.value)} />
        <TextField select label="Experience" value={form.engineerExperience} onChange={(event) => update('engineerExperience', event.target.value)}>{levels.map((level) => <MenuItem key={level} value={level}>{level}</MenuItem>)}</TextField>
        <TextField label="Position" required value={form.engineerPosition} onChange={(event) => update('engineerPosition', event.target.value)} />
        <TextField label="Team ID" type="number" value={form.teamId ?? ''} onChange={(event) => update('teamId', event.target.value ? Number(event.target.value) : null)} />
      </Stack></DialogContent>
      <DialogActions><Button onClick={onClose}>Cancel</Button><Button variant="contained" disabled={saving} onClick={() => void submit()}>{saving ? 'Saving...' : 'Save changes'}</Button></DialogActions>
    </Dialog>
  );
}

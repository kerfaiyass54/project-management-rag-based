import { useState } from 'react';
import {
  Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField,
} from '@mui/material';
import { usersSkillsApi } from '../api/usersSkillsApi';
import type { SkillField } from '../api/usersSkillsApi';

const fields: SkillField[] = ['FRONTEND', 'BACKEND', 'DEVOPS', 'TESTING', 'DATABASE', 'MACHINE_LEARNING', 'MOBILE'];

interface SkillFormDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => Promise<void> | void;
}

export default function SkillFormDialog({ open, onClose, onCreated }: SkillFormDialogProps) {
  const [skillName, setSkillName] = useState('');
  const [skillField, setSkillField] = useState<SkillField>('FRONTEND');
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const nameError = touched && skillName.trim().length < 2 ? 'Enter at least 2 characters.' : '';

  const close = () => {
    if (submitting) return;
    setSkillName('');
    setSkillField('FRONTEND');
    setTouched(false);
    setError('');
    onClose();
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (nameError || skillName.trim().length < 2) return;
    setSubmitting(true);
    setError('');
    try {
      await usersSkillsApi.createSkill({ skillName: skillName.trim(), skillField });
      await onCreated();
      close();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to create skill. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm" slotProps={{ paper: { className: 'dialog-enter' } }}>
      <form onSubmit={submit} noValidate>
        <DialogTitle sx={{ fontWeight: 800, letterSpacing: '-.02em' }}>Add skill</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {error && <Alert severity="error" className="form-shake">{error}</Alert>}
            <TextField
              label="Skill name"
              value={skillName}
              onChange={(event) => setSkillName(event.target.value)}
              onBlur={() => setTouched(true)}
              error={Boolean(nameError)}
              helperText={nameError || 'Use a clear, searchable capability name.'}
              required
              autoFocus
            />
            <TextField
              select
              label="Field"
              value={skillField}
              onChange={(event) => setSkillField(event.target.value as SkillField)}
              required
            >
              {fields.map((field) => <MenuItem key={field} value={field}>{field.replaceAll('_', ' ')}</MenuItem>)}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={close} disabled={submitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Saving...' : 'Create skill'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

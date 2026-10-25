import { useEffect, useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { usersSkillsApi } from '../api/usersSkillsApi';
import type { Manager } from '../api/usersSkillsApi';

interface ManagerFormDialogProps {
  open: boolean;
  manager?: Manager | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
}

export default function ManagerFormDialog({ open, manager, onClose, onSaved }: ManagerFormDialogProps) {
  const [name, setName] = useState('');
  const [experience, setExperience] = useState('');
  const [area, setArea] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    // Reset the dialog form whenever a different manager is selected.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(manager?.managerName ?? '');
    setExperience(manager ? String(manager.managerExperience) : '');
    setArea(manager?.managementArea ?? '');
    setError('');
    setTouched(false);
  }, [manager, open]);

  const validationError = touched && (!name.trim() || !experience || !area.trim())
    ? 'Name, experience, and management area are required.'
    : '';

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (!name.trim() || !experience || !area.trim()) return;
    setSaving(true);
    setError('');
    try {
      const payload = { managerName: name.trim(), managerExperience: Number(experience), managementArea: area.trim() };
      if (manager) await usersSkillsApi.updateManager(manager.id, payload);
      else await usersSkillsApi.createManager(payload);
      await onSaved();
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save manager');
    } finally {
      setSaving(false);
    }
  };

  return <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm" slotProps={{ paper: { className: 'dialog-enter' } }}>
    <form onSubmit={submit} noValidate>
      <DialogTitle sx={{ fontWeight: 800 }}>{manager ? 'Edit manager' : 'Add manager'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {error && <Alert severity="error" className="form-shake">{error}</Alert>}
          <TextField label="Manager name" required value={name} onChange={(event) => setName(event.target.value)} onBlur={() => setTouched(true)} error={Boolean(validationError)} helperText={validationError} autoFocus />
          <TextField label="Experience (years)" type="number" required value={experience} onChange={(event) => setExperience(event.target.value)} slotProps={{ htmlInput: { min: 0 } }} />
          <TextField label="Management area" required value={area} onChange={(event) => setArea(event.target.value)} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={saving}>{saving ? 'Saving...' : manager ? 'Save changes' : 'Create manager'}</Button>
      </DialogActions>
    </form>
  </Dialog>;
}

import { useEffect, useState } from 'react';
import {
  Alert, Autocomplete, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, MenuItem, Stack, TextField,
} from '@mui/material';
import { usersSkillsApi } from '../api/usersSkillsApi';
import type { Engineer, Skill } from '../api/usersSkillsApi';

interface Props {
  engineer: Engineer | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const proficiencyLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

export default function EngineerSkillAssignmentDialog({ engineer, open, onClose, onSaved }: Props) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [skillSearch, setSkillSearch] = useState('');
  const [proficiency, setProficiency] = useState('INTERMEDIATE');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      setLoadingSkills(true);
      void usersSkillsApi.getSkills(0, 25, skillSearch, 'skillName', 'asc')
        .then((result) => setSkills(result.content))
        .catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load skills'))
        .finally(() => setLoadingSkills(false));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [open, skillSearch]);

  const submit = async () => {
    if (!engineer || !selectedSkill) {
      setError('Choose a skill before assigning it.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await usersSkillsApi.assignSkill({
        engineerId: engineer.id,
        skillId: selectedSkill.id,
        proficiencyLevel: proficiency,
      });
      onSaved();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to assign skill');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>Assign skills to {engineer?.engineerName}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <Autocomplete
            options={skills}
            value={selectedSkill}
            loading={loadingSkills}
            onChange={(_, value) => { setSelectedSkill(value); setError(''); }}
            onInputChange={(_, value) => setSkillSearch(value)}
            getOptionLabel={(skill) => `${skill.skillName} - ${skill.skillField}`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            noOptionsText={skillSearch ? 'No matching skills' : 'No skills available'}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search and choose a skill"
                placeholder="Type a skill name or field"
                helperText={loadingSkills ? 'Searching skills...' : undefined}
              />
            )}
          />
          <TextField select label="Proficiency" value={proficiency} onChange={(event) => setProficiency(event.target.value)}>
            {proficiencyLevels.map((level) => <MenuItem key={level} value={level}>{level}</MenuItem>)}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={saving || loadingSkills} onClick={() => void submit()}>
          {saving ? 'Assigning...' : 'Assign skill'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

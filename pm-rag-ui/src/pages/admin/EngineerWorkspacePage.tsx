import { useEffect, useMemo, useState } from 'react';
import { ArrowBackRounded, CheckCircleRounded, PersonRounded, PsychologyRounded } from '@mui/icons-material';
import {
  Alert, Autocomplete, Avatar, Box, Button, Chip, CircularProgress, Container, Divider,
  MenuItem, Paper, Stack, Tab, Tabs, TextField, Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { usersSkillsApi } from '../../api/usersSkillsApi';
import type { Engineer, EngineerExperience, EngineerSkillDetails, Skill } from '../../api/usersSkillsApi';

const levels: EngineerExperience[] = ['JUNIOR', 'MID', 'SENIOR', 'LEAD'];
const proficiencies = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

export default function EngineerWorkspacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const engineerId = Number(id);
  const [engineer, setEngineer] = useState<Engineer | null>(null);
  const [assigned, setAssigned] = useState<EngineerSkillDetails[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [proficiency, setProficiency] = useState('INTERMEDIATE');
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!Number.isInteger(engineerId)) return;
    // Loading state is synchronized with the route-driven API request.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    void Promise.all([usersSkillsApi.getEngineer(engineerId), usersSkillsApi.getEngineerSkills(engineerId)])
      .then(([engineerResult, assignedResult]) => {
        setEngineer(engineerResult);
        setAssigned(assignedResult);
      })
      .catch((cause) => setMessage({ type: 'error', text: cause instanceof Error ? cause.message : 'Unable to load engineer' }))
      .finally(() => setLoading(false));
  }, [engineerId]);

  useEffect(() => {
    if (tab !== 1) return;
    const timer = window.setTimeout(() => {
      setLoadingSkills(true);
      void usersSkillsApi.getSkills(0, 25, skillSearch, 'skillName', 'asc')
        .then((result) => setSkills(result.content))
        .catch((cause) => setMessage({ type: 'error', text: cause instanceof Error ? cause.message : 'Unable to load skills' }))
        .finally(() => setLoadingSkills(false));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [skillSearch, tab]);

  const availableSkills = useMemo(() => {
    const assignedIds = new Set(assigned.map((item) => item.skillId));
    return skills.filter((skill) => !assignedIds.has(skill.id));
  }, [assigned, skills]);

  const updateField = (key: keyof Engineer, value: string | number | null) => {
    setEngineer((current) => current ? { ...current, [key]: value } : current);
    setMessage(null);
  };

  const saveEngineer = async () => {
    if (!engineer || !engineer.engineerName.trim() || !engineer.engineerSpeciality.trim() || !engineer.engineerPosition.trim()) {
      setMessage({ type: 'error', text: 'Name, speciality, and position are required.' });
      return;
    }
    setSaving(true);
    try {
      const saved = await usersSkillsApi.updateEngineer(engineer.id, engineer);
      setEngineer(saved);
      setMessage({ type: 'success', text: 'Engineer profile updated successfully.' });
    } catch (cause) {
      setMessage({ type: 'error', text: cause instanceof Error ? cause.message : 'Unable to update engineer' });
    } finally {
      setSaving(false);
    }
  };

  const assignSkills = async () => {
    if (!engineer || selectedSkills.length === 0) {
      setMessage({ type: 'error', text: 'Select at least one skill to assign.' });
      return;
    }
    setSaving(true);
    try {
      await Promise.all(selectedSkills.map((skill) => usersSkillsApi.assignSkill({
        engineerId: engineer.id,
        skillId: skill.id,
        proficiencyLevel: proficiency,
      })));
      setAssigned(await usersSkillsApi.getEngineerSkills(engineer.id));
      setSelectedSkills([]);
      setSkillSearch('');
      setMessage({ type: 'success', text: `${selectedSkills.length} skill${selectedSkills.length === 1 ? '' : 's'} assigned successfully.` });
    } catch (cause) {
      setMessage({ type: 'error', text: cause instanceof Error ? cause.message : 'Unable to assign skills' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Container sx={{ py: 8, textAlign: 'center' }}><CircularProgress /></Container>;
  if (!engineer) return <Container sx={{ py: 8 }}><Alert severity="error">{message?.text ?? 'Engineer not found'}</Alert></Container>;

  return (
    <Container maxWidth="lg" className="page-enter" sx={{ py: { xs: 3, md: 6 } }}>
      <Button startIcon={<ArrowBackRounded />} onClick={() => navigate('/admin/engineers')} sx={{ mb: 2 }}>Back to engineers</Button>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <Paper sx={{ overflow: 'hidden', borderRadius: 4, border: 1, borderColor: 'divider' }}>
          <Box sx={{ p: { xs: 3, md: 5 }, color: 'white', background: 'linear-gradient(135deg, #342b78, #635bff 55%, #8b83ff)' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(255,255,255,.2)', fontSize: 28 }}>{engineer.engineerName.charAt(0).toUpperCase()}</Avatar>
              <Box><Typography variant="overline" sx={{ opacity: .8 }}>Engineer workspace</Typography><Typography variant="h3" sx={{ fontWeight: 900 }}>{engineer.engineerName}</Typography><Typography sx={{ opacity: .85 }}>{engineer.engineerPosition} · {engineer.engineerSpeciality}</Typography></Box>
            </Stack>
          </Box>
          <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Tab icon={<PersonRounded />} iconPosition="start" label="Profile" />
            <Tab icon={<PsychologyRounded />} iconPosition="start" label="Assign skills" />
            <Tab icon={<CheckCircleRounded />} iconPosition="start" label={`Assigned (${assigned.length})`} />
          </Tabs>
          <Box sx={{ p: { xs: 3, md: 5 } }}>
            {message && <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 3 }}>{message.text}</Alert>}
            {tab === 0 && (
              <Stack component={motion.div} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} spacing={2}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>Edit profile</Typography>
                <Divider />
                <TextField label="Name" required value={engineer.engineerName} onChange={(event) => updateField('engineerName', event.target.value)} />
                <TextField label="Speciality" required value={engineer.engineerSpeciality} onChange={(event) => updateField('engineerSpeciality', event.target.value)} />
                <TextField select label="Experience" value={engineer.engineerExperience} onChange={(event) => updateField('engineerExperience', event.target.value)}>{levels.map((level) => <MenuItem key={level} value={level}>{level}</MenuItem>)}</TextField>
                <TextField label="Position" required value={engineer.engineerPosition} onChange={(event) => updateField('engineerPosition', event.target.value)} />
                <TextField label="Team ID" type="number" value={engineer.teamId ?? ''} onChange={(event) => updateField('teamId', event.target.value ? Number(event.target.value) : null)} />
                <Button variant="contained" size="large" onClick={() => void saveEngineer()} disabled={saving} sx={{ alignSelf: 'flex-start', mt: 1 }}>{saving ? 'Saving...' : 'Save profile'}</Button>
              </Stack>
            )}
            {tab === 1 && (
              <Stack component={motion.div} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} spacing={2}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>Assign multiple skills</Typography>
                <Typography color="text.secondary">Search and select several skills, then apply one proficiency level to all of them.</Typography>
                <Autocomplete multiple options={availableSkills} value={selectedSkills} loading={loadingSkills} onChange={(_, value) => setSelectedSkills(value)} onInputChange={(_, value) => setSkillSearch(value)} getOptionLabel={(skill) => `${skill.skillName} - ${skill.skillField}`} isOptionEqualToValue={(option, value) => option.id === value.id} noOptionsText={skillSearch ? 'No matching unassigned skills' : 'No unassigned skills'} renderInput={(params) => <TextField {...params} label="Search skills" placeholder="Type a skill name or field" helperText={loadingSkills ? 'Searching skills...' : 'You can select more than one'} />} />
                <TextField select label="Proficiency for selected skills" value={proficiency} onChange={(event) => setProficiency(event.target.value)}>{proficiencies.map((level) => <MenuItem key={level} value={level}>{level}</MenuItem>)}</TextField>
                <Button variant="contained" size="large" onClick={() => void assignSkills()} disabled={saving || loadingSkills || selectedSkills.length === 0} sx={{ alignSelf: 'flex-start' }}>{saving ? 'Assigning...' : `Assign ${selectedSkills.length || ''} skill${selectedSkills.length === 1 ? '' : 's'}`}</Button>
              </Stack>
            )}
            {tab === 2 && (
              <Stack component={motion.div} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} spacing={2}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>Assigned skills</Typography>
                <Typography color="text.secondary">Skills currently linked to this engineer.</Typography>
                {assigned.length === 0 ? <Alert severity="info">No skills assigned yet. Use the Assign skills tab to add them.</Alert> : <Stack spacing={1.5}>{assigned.map((item) => <Paper key={item.id} variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 180ms ease, box-shadow 180ms ease', '&:hover': { transform: 'translateX(5px)', boxShadow: 3 } }}><Box><Typography sx={{ fontWeight: 700 }}>{item.skillName}</Typography><Typography variant="body2" color="text.secondary">{item.skillField}</Typography></Box><Chip color="primary" label={item.proficiencyLevel} /></Paper>)}</Stack>}
              </Stack>
            )}
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
}

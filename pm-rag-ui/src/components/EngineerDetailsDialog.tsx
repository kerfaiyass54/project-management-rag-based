import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, Typography } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import type { Engineer } from '../api/usersSkillsApi';

interface Props {
  engineer: Engineer | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (engineer: Engineer) => void;
  onAssignSkills: (engineer: Engineer) => void;
}

export default function EngineerDetailsDialog({ engineer, open, onClose, onUpdate, onAssignSkills }: Props) {
  if (!engineer) return null;
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>Engineer details</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{engineer.engineerName}</Typography>
            <Chip color="primary" label={engineer.engineerExperience} />
          </Stack>
          <Divider />
          <Typography><strong>Speciality:</strong> {engineer.engineerSpeciality || 'Not specified'}</Typography>
          <Typography><strong>Position:</strong> {engineer.engineerPosition || 'Not specified'}</Typography>
          <Typography><strong>Team:</strong> {engineer.teamId ? `Team ${engineer.teamId}` : 'Unassigned'}</Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button variant="outlined" startIcon={<PsychologyRoundedIcon />} onClick={() => onAssignSkills(engineer)}>Assign skills</Button>
        <Button variant="contained" startIcon={<EditRoundedIcon />} onClick={() => onUpdate(engineer)}>Update engineer</Button>
      </DialogActions>
    </Dialog>
  );
}

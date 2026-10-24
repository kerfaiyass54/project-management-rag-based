import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';

const colors: Record<string, ChipProps['color']> = {
  JUNIOR: 'info',
  MID: 'primary',
  SENIOR: 'warning',
  LEAD: 'secondary',
  FRONTEND: 'info',
  BACKEND: 'primary',
  DEVOPS: 'warning',
  TESTING: 'success',
  DATABASE: 'secondary',
  MACHINE_LEARNING: 'error',
  MOBILE: 'info',
};

export default function StatusChip({ value }: { value: string }) {
  return <Chip label={value.replaceAll('_', ' ')} color={colors[value] ?? 'default'} size="small" sx={{ fontWeight: 700, transition: 'transform 180ms ease, filter 180ms ease', '&:hover': { transform: 'translateY(-2px) scale(1.03)', filter: 'saturate(1.18)' } }} />;
}

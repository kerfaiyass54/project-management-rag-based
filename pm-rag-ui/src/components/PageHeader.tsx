import { Box, Button, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  actionIcon?: ReactNode;
}

export default function PageHeader({ eyebrow, title, description, actionLabel, onAction, actionHref, actionIcon }: PageHeaderProps) {
  return (
    <Box className="page-enter" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, justifyContent: 'space-between', alignItems: { md: 'flex-end' }, mb: 4 }}>
      <Box>
        <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: 1.5, display: 'inline-block', animation: 'soft-pulse 3s ease-in-out infinite' }}>{eyebrow}</Typography>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 800, letterSpacing: '-.04em', mt: .5, transition: 'color 220ms ease', '&:hover': { color: 'primary.main' } }}>{title}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 620 }}>{description}</Typography>
      </Box>
      {actionLabel && (actionHref
        ? <Button component={Link} to={actionHref} variant="contained" startIcon={actionIcon ?? <AddRoundedIcon />} sx={{ borderRadius: 2.5, px: 2.5, whiteSpace: 'nowrap', transition: 'transform 220ms ease, box-shadow 220ms ease', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 24px rgba(99, 91, 255, .24)' } }}>{actionLabel}</Button>
        : <Button onClick={onAction} variant="contained" startIcon={actionIcon ?? <AddRoundedIcon />} sx={{ borderRadius: 2.5, px: 2.5, whiteSpace: 'nowrap', transition: 'transform 220ms ease, box-shadow 220ms ease', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 24px rgba(99, 91, 255, .24)' } }}>{actionLabel}</Button>
      )}
    </Box>
  );
}

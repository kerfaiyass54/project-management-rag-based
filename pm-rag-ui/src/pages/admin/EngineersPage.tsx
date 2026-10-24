import { useCallback, useEffect, useState } from 'react';
import { Box, Chip, Container } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import ResourceTable from '../../components/ResourceTable';
import StatusChip from '../../components/StatusChip';
import { usersSkillsApi } from '../../api/usersSkillsApi';
import type { Engineer } from '../../api/usersSkillsApi';

export default function EngineersPage() {
  const [rows, setRows] = useState<Engineer[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<keyof Engineer>('engineerName');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const result = await usersSkillsApi.getEngineers(page, size, search, String(sortBy), direction);
      setRows(result.content); setTotal(result.totalElements);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load engineers'); }
    finally { setLoading(false); }
  }, [page, size, search, sortBy, direction]);
  // Synchronize server data with the current table query.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);

  const remove = async (engineer: Engineer) => {
    if (!window.confirm(`Delete ${engineer.engineerName}?`)) return;
    try { await usersSkillsApi.deleteEngineer(engineer.id); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to delete engineer'); }
  };
  const sort = (key: keyof Engineer) => {
    setDirection(sortBy === key && direction === 'asc' ? 'desc' : 'asc'); setSortBy(key); setPage(0);
  };

  return <Container className="page-enter" maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
    <PageHeader eyebrow="People directory" title="Engineers" description="Search, sort, and manage the engineering talent available to your teams." actionLabel="Add engineer" actionHref="/admin/engineers/add" />
    <Box sx={{ borderRadius: 4, overflow: 'hidden', transition: 'transform 260ms ease', '&:focus-within': { transform: 'scale(1.002)' } }}>
      <ResourceTable rows={rows} total={total} page={page} rowsPerPage={size} search={search} sortBy={sortBy} sortDirection={direction} loading={loading} error={error} onPageChange={setPage} onRowsPerPageChange={(value) => { setSize(value); setPage(0); }} onSearchChange={(value) => { setSearch(value); setPage(0); }} onSortChange={sort} onDelete={remove}
        columns={[
          { key: 'engineerName', label: 'Name' },
          { key: 'engineerSpeciality', label: 'Speciality' },
          { key: 'engineerExperience', label: 'Experience', render: (value) => <StatusChip value={String(value)} /> },
          { key: 'engineerPosition', label: 'Position', render: (value) => <Chip label={String(value)} variant="outlined" size="small" /> },
          { key: 'teamId', label: 'Team', render: (value) => value ? `Team ${value}` : 'Unassigned' },
        ]}
      />
    </Box>
  </Container>;
}

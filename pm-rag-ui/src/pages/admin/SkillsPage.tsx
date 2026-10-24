import { useCallback, useEffect, useState } from 'react';
import { Container } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import ResourceTable from '../../components/ResourceTable';
import StatusChip from '../../components/StatusChip';
import SkillFormDialog from '../../components/SkillFormDialog';
import { usersSkillsApi } from '../../api/usersSkillsApi';
import type { Skill } from '../../api/usersSkillsApi';

export default function SkillsPage() {
  const [rows, setRows] = useState<Skill[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<keyof Skill>('skillName');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { const result = await usersSkillsApi.getSkills(page, size, search, String(sortBy), direction); setRows(result.content); setTotal(result.totalElements); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load skills'); }
    finally { setLoading(false); }
  }, [page, size, search, sortBy, direction]);
  // Synchronize server data with the current table query.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);
  const remove = async (skill: Skill) => {
    if (!window.confirm(`Delete ${skill.skillName}?`)) return;
    try { await usersSkillsApi.deleteSkill(skill.id); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to delete skill'); }
  };
  const sort = (key: keyof Skill) => { setDirection(sortBy === key && direction === 'asc' ? 'desc' : 'asc'); setSortBy(key); setPage(0); };

  return <Container className="page-enter" maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
    <PageHeader eyebrow="Capability library" title="Skills" description="Keep the shared capability catalogue clean, searchable, and ready for team planning." actionLabel="Add skill" onAction={() => setDialogOpen(true)} />
    <ResourceTable rows={rows} total={total} page={page} rowsPerPage={size} search={search} sortBy={sortBy} sortDirection={direction} loading={loading} error={error} onPageChange={setPage} onRowsPerPageChange={(value) => { setSize(value); setPage(0); }} onSearchChange={(value) => { setSearch(value); setPage(0); }} onSortChange={sort} onDelete={remove}
      columns={[
        { key: 'skillName', label: 'Skill' },
        { key: 'skillField', label: 'Field', render: (value) => <StatusChip value={String(value)} /> },
      ]}
    />
    <SkillFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onCreated={load} />
  </Container>;
}

import { useCallback, useEffect, useState } from 'react';
import { Button, Chip, Container } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import PageHeader from '../../components/PageHeader';
import ResourceTable from '../../components/ResourceTable';
import ManagerFormDialog from '../../components/ManagerFormDialog';
import { usersSkillsApi } from '../../api/usersSkillsApi';
import type { Manager } from '../../api/usersSkillsApi';

export default function ManagersPage() {
  const [rows, setRows] = useState<Manager[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState<keyof Manager>('managerName');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Manager | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const result = await usersSkillsApi.getManagers(page, size, String(sortBy), direction);
      setRows(result.content); setTotal(result.totalElements);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load managers'); }
    finally { setLoading(false); }
  }, [page, size, sortBy, direction]);
  // Synchronize the table with the server-side query.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);

  const remove = async (manager: Manager) => {
    if (!window.confirm(`Delete ${manager.managerName}?`)) return;
    try { await usersSkillsApi.deleteManager(manager.id); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to delete manager'); }
  };
  const sort = (key: keyof Manager) => { setDirection(sortBy === key && direction === 'asc' ? 'desc' : 'asc'); setSortBy(key); setPage(0); };

  return <Container className="page-enter" maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
    <PageHeader eyebrow="Leadership directory" title="Managers" description="Manage the people guiding teams, delivery, and engineering capability." actionLabel="Add manager" onAction={() => { setEditing(null); setDialogOpen(true); }} />
    <ResourceTable rows={rows} columns={[
      { key: 'managerName', label: 'Name' },
      { key: 'managerExperience', label: 'Experience', render: (value) => <Chip label={`${value} years`} color="primary" size="small" /> },
      { key: 'managementArea', label: 'Area' },
      { key: 'id', label: 'Actions', render: (_, row) => <Button size="small" startIcon={<EditRoundedIcon />} onClick={() => { setEditing(row); setDialogOpen(true); }}>Edit</Button> },
    ]} total={total} page={page} rowsPerPage={size} search="" sortBy={sortBy} sortDirection={direction} loading={loading} error={error} onPageChange={setPage} onRowsPerPageChange={(value) => { setSize(value); setPage(0); }} onSearchChange={() => undefined} onSortChange={sort} onDelete={remove} />
    <ManagerFormDialog open={dialogOpen} manager={editing} onClose={() => setDialogOpen(false)} onSaved={load} />
  </Container>;
}

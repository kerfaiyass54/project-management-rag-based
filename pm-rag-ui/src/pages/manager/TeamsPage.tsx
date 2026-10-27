import { useCallback, useEffect, useState } from 'react';
import { Alert, Chip, Container } from '@mui/material';
import { useKeycloak } from '@react-keycloak/web';
import PageHeader from '../../components/PageHeader';
import ResourceTable from '../../components/ResourceTable';
import { managementApi } from '../../api/managementApi';
import type { Team } from '../../api/managementApi';
import { usersSkillsApi } from '../../api/usersSkillsApi';

export default function TeamsPage() {
  const { keycloak } = useKeycloak();
  const [rows, setRows] = useState<Team[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('name');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [managerId, setManagerId] = useState<number | null>(null);
  const managerName = keycloak.tokenParsed?.name ?? keycloak.tokenParsed?.preferred_username;
  const load = useCallback(async () => {
    if (!keycloak.token) return;
    try {
      const result = await managementApi.getTeams(keycloak.token, page, size, search, sortBy, direction);
      setRows(result.content); setTotal(result.totalElements);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load teams'); }
  }, [keycloak.token, page, size, search, sortBy, direction]);
  // Synchronize the table query with the server.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    if (!managerName) return;
    void usersSkillsApi.getManagerByName(managerName).then((manager) => setManagerId(manager.id)).catch(() => undefined);
  }, [managerName]);
  return (
    <Container maxWidth="xl" className="page-enter" sx={{ py: { xs: 3, md: 6 } }}>
      <PageHeader eyebrow="Manager workspace" title="Teams" description={`Review and manage teams for ${managerName ?? 'your account'}${managerId ? ` (manager #${managerId})` : ''}.`} />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <ResourceTable rows={rows} total={total} page={page} rowsPerPage={size} search={search} sortBy={sortBy} sortDirection={direction} loading={!keycloak.token} error={error} onPageChange={setPage} onRowsPerPageChange={(value) => { setSize(value); setPage(0); }} onSearchChange={(value) => { setSearch(value); setPage(0); }} onSortChange={(key) => { const next = key as 'name' | 'createdAt'; setDirection(sortBy === next && direction === 'asc' ? 'desc' : 'asc'); setSortBy(next); setPage(0); }} columns={[
        { key: 'name', label: 'Team name' },
        { key: 'memberIds', label: 'Members', render: (value) => <Chip size="small" color="primary" label={`${(value as string[]).length} engineers`} /> },
        { key: 'createdAt', label: 'Created' },
      ]} />
    </Container>
  );
}

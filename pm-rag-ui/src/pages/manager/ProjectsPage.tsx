import { useCallback, useEffect, useState } from 'react';
import { Alert, Chip, Container, MenuItem, TextField } from '@mui/material';
import { useKeycloak } from '@react-keycloak/web';
import PageHeader from '../../components/PageHeader';
import ResourceTable from '../../components/ResourceTable';
import { managementApi } from '../../api/managementApi';
import type { Project, Team } from '../../api/managementApi';

export default function ProjectsPage() {
  const { keycloak } = useKeycloak();
  const [rows, setRows] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamId, setTeamId] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'durationDays'>('name');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    if (!keycloak.token) return;
    try {
      const result = await managementApi.getProjects(keycloak.token, page, size, search, sortBy, direction, teamId || undefined);
      setRows(result.content); setTotal(result.totalElements);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load projects'); }
  }, [keycloak.token, page, size, search, sortBy, direction, teamId]);
  // Synchronize the table query with the server.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    if (!keycloak.token) return;
    void managementApi.getTeams(keycloak.token, 0, 100, '', 'name', 'asc').then((result) => setTeams(result.content)).catch(() => undefined);
  }, [keycloak.token]);
  return (
    <Container maxWidth="xl" className="page-enter" sx={{ py: { xs: 3, md: 6 } }}>
      <PageHeader eyebrow="Manager workspace" title="Projects" description="Search, filter, sort, and monitor projects across your teams." />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField select size="small" label="Filter by team" value={teamId} onChange={(event) => { setTeamId(event.target.value); setPage(0); }} sx={{ mb: 2, minWidth: 230 }}>
        <MenuItem value="">All teams</MenuItem>{teams.map((team) => <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>)}
      </TextField>
      <ResourceTable rows={rows} total={total} page={page} rowsPerPage={size} search={search} sortBy={sortBy} sortDirection={direction} loading={!keycloak.token} error={error} onPageChange={setPage} onRowsPerPageChange={(value) => { setSize(value); setPage(0); }} onSearchChange={(value) => { setSearch(value); setPage(0); }} onSortChange={(key) => { const next = key as 'name' | 'durationDays'; setDirection(sortBy === next && direction === 'asc' ? 'desc' : 'asc'); setSortBy(next); setPage(0); }} onDelete={async (project) => { if (!keycloak.token || !window.confirm(`Delete ${project.name}?`)) return; await managementApi.deleteProject(keycloak.token, project.id); await load(); }} columns={[
        { key: 'name', label: 'Project' },
        { key: 'description', label: 'Description' },
        { key: 'durationDays', label: 'Duration', render: (value) => `${value ?? 0} days` },
        { key: 'teamId', label: 'Team', render: (value) => <Chip size="small" variant="outlined" label={value ? (teams.find((team) => team.id === value)?.name ?? value) : 'Unassigned'} /> },
        { key: 'repositoryUrl', label: 'Repository' },
      ]} />
    </Container>
  );
}

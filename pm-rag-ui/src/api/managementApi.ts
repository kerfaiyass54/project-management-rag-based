export interface ManagementPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface Team { id: string; name: string; memberIds: string[]; members?: Array<{ id: string; engineerName: string }>; createdAt?: string; updatedAt?: string }
export interface Project { id: string; name: string; description?: string; durationDays?: number; teamId?: string | null; repositoryUrl?: string; createdAt?: string; updatedAt?: string }
export interface EngineerOption { id: string; engineerName: string; role?: string }

const API_URL = import.meta.env.VITE_MANAGEMENT_API_URL ?? 'http://localhost:8360/api';

async function request<T>(path: string, token: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(options?.headers ?? {}) },
  });
  if (!response.ok) throw new Error(`Management request failed (${response.status})`);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function query(page: number, size: number, search: string, sortBy: string, direction: string, teamId?: string) {
  const params = new URLSearchParams({ page: String(page), size: String(size), sort: `${sortBy},${direction}` });
  if (search.trim()) params.set('search', search.trim());
  if (teamId) params.set('teamId', teamId);
  return params;
}

export const managementApi = {
  getTeams: (token: string, page: number, size: number, search: string, sortBy: string, direction: string) =>
    request<ManagementPage<Team>>(`/teams?${query(page, size, search, sortBy, direction)}`, token),
  getTeam: (token: string, id: string) => request<Team>(`/teams/${id}`, token),
  createTeam: (token: string, body: { name: string; memberIds: string[] }) =>
    request<Team>('/teams', token, { method: 'POST', body: JSON.stringify(body) }),
  updateTeam: (token: string, id: string, body: { name: string; addMemberIds?: string[]; removeMemberIds?: string[] }) =>
    request<Team>(`/teams/${id}`, token, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteTeam: (token: string, id: string) => request<void>(`/teams/${id}`, token, { method: 'DELETE' }),
  getProjects: (token: string, page: number, size: number, search: string, sortBy: string, direction: string, teamId?: string) =>
    request<ManagementPage<Project>>(`/projects?${query(page, size, search, sortBy, direction, teamId)}`, token),
  getProjectStats: (token: string) => request<{ total: number; assigned: number; unassigned: number }>('/projects/stats', token),
  deleteProject: (token: string, id: string) => request<void>(`/projects/${id}`, token, { method: 'DELETE' }),
};

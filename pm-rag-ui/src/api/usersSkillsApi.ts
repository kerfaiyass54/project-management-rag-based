export type EngineerExperience = 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD';
export type SkillField =
  | 'FRONTEND'
  | 'BACKEND'
  | 'DEVOPS'
  | 'TESTING'
  | 'DATABASE'
  | 'MACHINE_LEARNING'
  | 'MOBILE';

export interface Engineer {
  id: number;
  engineerName: string;
  engineerSpeciality: string;
  engineerExperience: EngineerExperience;
  engineerPosition: string;
  teamId: number | null;
}

export interface Skill {
  id: number;
  skillName: string;
  skillField: SkillField;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface EngineerSkill {
  id: number;
  engineerId: number;
  skillId: number;
  proficiencyLevel: string;
}

export interface EngineerSkillDetails extends EngineerSkill {
  skillName: string;
  skillField: string;
}

export interface SkillUsage {
  mostUsed?: Skill;
  leastUsed?: Skill;
}

export interface Manager {
  id: number;
  managerName: string;
  managerExperience: number;
  managementArea: string;
}

export interface ManagerStats {
  totalManagers: number;
  mostExperienced: Manager | null;
}

const API_URL = import.meta.env.VITE_USERS_SKILLS_API_URL ?? 'http://localhost:8350/api/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function pageParams(page: number, size: number, search: string, sortBy: string, sortDirection: string) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort: `${sortBy},${sortDirection}`,
  });
  if (search.trim()) params.set('search', search.trim());
  return params;
}

export const usersSkillsApi = {
  getEngineers: (page: number, size: number, search: string, sortBy: string, sortDirection: string) =>
    request<PageResponse<Engineer>>(`/engineers?${pageParams(page, size, search, sortBy, sortDirection)}`),
  createEngineer: (engineer: Omit<Engineer, 'id'>) =>
    request<Engineer>('/engineers', { method: 'POST', body: JSON.stringify(engineer) }),
  getEngineer: (id: number) => request<Engineer>(`/engineers/${id}`),
  getEngineerSkills: (id: number) => request<EngineerSkillDetails[]>(`/engineers/${id}/skills`),
  updateEngineer: (id: number, engineer: Omit<Engineer, 'id'>) =>
    request<Engineer>(`/engineers/${id}`, { method: 'PUT', body: JSON.stringify(engineer) }),
  deleteEngineer: (id: number) => request<void>(`/engineers/${id}`, { method: 'DELETE' }),
  assignSkill: (assignment: Omit<EngineerSkill, 'id'>) =>
    request<EngineerSkill>('/engineers/skills', { method: 'POST', body: JSON.stringify(assignment) }),
  updateEngineerSkill: (id: number, assignment: Omit<EngineerSkill, 'id'>) =>
    request<EngineerSkill>(`/engineers/skills/${id}`, { method: 'PUT', body: JSON.stringify(assignment) }),
  getEngineerTotal: () => request<number>('/engineers/count'),
  getEngineersByType: () => request<Record<string, number>>('/engineers/count-by-type'),
  getSkills: (page: number, size: number, search: string, sortBy: string, sortDirection: string) =>
    request<PageResponse<Skill>>(`/skills?${pageParams(page, size, search, sortBy, sortDirection)}`),
  createSkill: (skill: Omit<Skill, 'id'>) =>
    request<Skill>('/skills', { method: 'POST', body: JSON.stringify(skill) }),
  getSkill: (id: number) => request<Skill>(`/skills/${id}`),
  deleteSkill: (id: number) => request<void>(`/skills/${id}`, { method: 'DELETE' }),
  getSkillUsage: () => request<SkillUsage>('/skills/usage'),
  getManagers: (page: number, size: number, sortBy = 'managerName', sortDirection = 'asc') =>
    request<PageResponse<Manager>>(`/managers?page=${page}&size=${size}&sort=${sortBy},${sortDirection}`),
  createManager: (manager: Omit<Manager, 'id'>) =>
    request<Manager>('/managers', { method: 'POST', body: JSON.stringify(manager) }),
  updateManager: (id: number, manager: Omit<Manager, 'id'>) =>
    request<Manager>(`/managers/${id}`, { method: 'PUT', body: JSON.stringify(manager) }),
  deleteManager: (id: number) => request<void>(`/managers/${id}`, { method: 'DELETE' }),
  getManagerStats: () => request<ManagerStats>('/managers/stats'),
};

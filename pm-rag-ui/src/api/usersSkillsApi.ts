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
  deleteEngineer: (id: number) => request<void>(`/engineers/${id}`, { method: 'DELETE' }),
  getSkills: (page: number, size: number, search: string, sortBy: string, sortDirection: string) =>
    request<PageResponse<Skill>>(`/skills?${pageParams(page, size, search, sortBy, sortDirection)}`),
  createSkill: (skill: Omit<Skill, 'id'>) =>
    request<Skill>('/skills', { method: 'POST', body: JSON.stringify(skill) }),
  deleteSkill: (id: number) => request<void>(`/skills/${id}`, { method: 'DELETE' }),
};

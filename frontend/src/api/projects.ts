import { apiGet, apiPost, apiPatch, apiDelete } from './client';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  _count?: { tasks: number };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export function getProjects(): Promise<Project[]> {
  return apiGet<Project[]>('/projects');
}

export function getProject(id: string): Promise<Project> {
  return apiGet<Project>(`/projects/${id}`);
}

export function createProject(input: CreateProjectInput): Promise<Project> {
  return apiPost<Project>('/projects', input);
}

export function updateProject(id: string, input: Partial<CreateProjectInput>): Promise<Project> {
  return apiPatch<Project>(`/projects/${id}`, input);
}

export function deleteProject(id: string): Promise<void> {
  return apiDelete<void>(`/projects/${id}`);
}

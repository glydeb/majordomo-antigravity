import { apiGet, apiPost, apiPatch, apiDelete } from './client';

export interface TaskFilters {
  status?: string;
  contextId?: string;
  projectId?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  contextId: string | null;
  projectId: string | null;
  dueDate: string | null;
  energyLevel: string;
  estimatedDuration: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: string;
  contextId?: string;
  projectId?: string;
  dueDate?: string;
  energyLevel?: string;
  estimatedDuration?: number;
}

export function getTasks(filters?: TaskFilters): Promise<Task[]> {
  const query = new URLSearchParams();
  if (filters?.status) query.append('status', filters.status);
  if (filters?.contextId) query.append('contextId', filters.contextId);
  if (filters?.projectId) query.append('projectId', filters.projectId);
  const qs = query.toString();
  return apiGet<Task[]>(`/tasks${qs ? `?${qs}` : ''}`);
}

export function getTask(id: string): Promise<Task> {
  return apiGet<Task>(`/tasks/${id}`);
}

export function createTask(input: CreateTaskInput): Promise<Task> {
  return apiPost<Task>('/tasks', input);
}

export function updateTask(id: string, input: Partial<CreateTaskInput>): Promise<Task> {
  return apiPatch<Task>(`/tasks/${id}`, input);
}

export function deleteTask(id: string): Promise<void> {
  return apiDelete<void>(`/tasks/${id}`);
}

import { apiGet, apiPost, apiPatch, apiDelete } from './client';

export interface Context {
  id: string;
  name: string;
  userId: string;
  _count?: { tasks: number };
  createdAt: string;
  updatedAt: string;
}

export interface CreateContextInput {
  name: string;
}

export function getContexts(): Promise<Context[]> {
  return apiGet<Context[]>('/contexts');
}

export function createContext(input: CreateContextInput): Promise<Context> {
  return apiPost<Context>('/contexts', input);
}

export function updateContext(id: string, input: Partial<CreateContextInput>): Promise<Context> {
  return apiPatch<Context>(`/contexts/${id}`, input);
}

export function deleteContext(id: string): Promise<void> {
  return apiDelete<void>(`/contexts/${id}`);
}

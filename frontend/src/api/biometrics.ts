import { apiGet, apiPost, apiDelete } from './client';

export interface BiometricLog {
  id: string;
  source: string;
  metricType: string;
  value: number;
  timestamp: string;
  userId: string;
}

export interface CreateBiometricLogInput {
  source: string;
  metricType: string;
  value: number;
  timestamp: string;
}

export interface BiometricFilters {
  metricType?: string;
  source?: string;
}

export function getBiometricLogs(filters?: BiometricFilters): Promise<BiometricLog[]> {
  const query = new URLSearchParams();
  if (filters?.metricType) query.append('metricType', filters.metricType);
  if (filters?.source) query.append('source', filters.source);
  const qs = query.toString();
  return apiGet<BiometricLog[]>(`/biometrics${qs ? `?${qs}` : ''}`);
}

export function createBiometricLog(input: CreateBiometricLogInput): Promise<BiometricLog> {
  return apiPost<BiometricLog>('/biometrics', input);
}

export function deleteBiometricLog(id: string): Promise<void> {
  return apiDelete<void>(`/biometrics/${id}`);
}

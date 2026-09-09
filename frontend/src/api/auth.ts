import { apiGet, apiPost } from './client';

export interface User {
  id: string;
  email: string;
}

export function getSession(): Promise<User> {
  return apiGet<User>('/auth/session');
}

export function registerGenerate(email: string): Promise<any> {
  return apiPost('/auth/register/generate', { email });
}

export function registerVerify(body: any): Promise<any> {
  return apiPost('/auth/register/verify', body);
}

export function loginGenerate(email: string): Promise<any> {
  return apiPost('/auth/login/generate', { email });
}

export function loginVerify(body: any): Promise<any> {
  return apiPost('/auth/login/verify', body);
}

export function logout(): Promise<void> {
  return apiPost('/auth/logout');
}

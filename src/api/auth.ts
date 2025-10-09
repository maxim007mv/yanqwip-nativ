import { api } from './client';
import type { TokenResponse, User } from '../types/api';

export const login = async (email: string, password: string) => {
  const response = await api.post<TokenResponse>('/auth/login', { email, password });
  return response.data;
};

export const register = async (email: string, password: string, fullName?: string) => {
  const response = await api.post<User>('/auth/register', {
    email,
    password,
    full_name: fullName,
  });
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await api.get<User>('/auth/me');
  return response.data;
};

export const refreshSession = async (refreshToken: string) => {
  const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
  return response.data as TokenResponse;
};

export const logout = async (refreshToken: string) => {
  await api.post('/auth/logout', { refresh_token: refreshToken });
};

export const updateUser = async (data: { full_name?: string; email?: string }) => {
  const response = await api.put('/auth/me', data);
  return response.data;
};

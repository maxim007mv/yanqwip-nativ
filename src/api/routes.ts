import { api } from './client';
import type {
  JobCreateResponse,
  JobStatusResponse,
  RouteGeneratePayload,
  RouteSavePayload,
  SavedRouteDetail,
  SavedRouteSummary,
} from '../types/api';

export const createGenerationJob = async (payload: RouteGeneratePayload) => {
  const response = await api.post<JobCreateResponse>('/routes/generate', payload);
  return response.data;
};

export const getGenerationStatus = async (jobId: string) => {
  const response = await api.get<JobStatusResponse>(`/routes/generate/${jobId}`);
  return response.data;
};

export const saveRoute = async (payload: RouteSavePayload) => {
  const response = await api.post<SavedRouteDetail>('/routes/save', payload);
  return response.data;
};

export const getUserRoutes = async () => {
  const response = await api.get<SavedRouteSummary[]>('/routes/user');
  return response.data;
};

export const getRouteById = async (routeId: number) => {
  const response = await api.get<SavedRouteDetail>(`/routes/${routeId}`);
  return response.data;
};

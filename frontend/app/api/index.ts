import apiClient from './client';
import {
  User,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  Route,
  Place,
  ChatMessage,
  GenerateRouteRequest,
  GenerateRouteResponse,
} from '@/lib/types';

// ============ AUTH ============
export const authApi = {
  login: async (data: LoginRequest): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch('/auth/profile', data);
    return response.data;
  },
};

// ============ ROUTES ============
export const routesApi = {
  generate: async (data: GenerateRouteRequest): Promise<GenerateRouteResponse> => {
    const response = await apiClient.post('/routes/generate', data);
    return response.data;
  },

  getMyRoutes: async (): Promise<Route[]> => {
    const response = await apiClient.get('/routes/my');
    return response.data;
  },

  getPublicRoutes: async (limit = 10): Promise<Route[]> => {
    const response = await apiClient.get('/routes/public', { params: { limit } });
    return response.data;
  },

  getRouteById: async (id: string): Promise<Route> => {
    const response = await apiClient.get(`/routes/${id}`);
    return response.data;
  },

  saveRoute: async (route: Omit<Route, 'id' | 'createdAt' | 'userId'>): Promise<Route> => {
    const response = await apiClient.post('/routes', route);
    return response.data;
  },

  deleteRoute: async (id: string): Promise<void> => {
    await apiClient.delete(`/routes/${id}`);
  },

  likeRoute: async (id: string): Promise<void> => {
    await apiClient.post(`/routes/${id}/like`);
  },
};

// ============ PLACES ============
export const placesApi = {
  getAll: async (category?: string): Promise<Place[]> => {
    const response = await apiClient.get('/places', { 
      params: category && category !== 'all' ? { category } : {} 
    });
    return response.data;
  },

  getById: async (id: string): Promise<Place> => {
    const response = await apiClient.get(`/places/${id}`);
    return response.data;
  },

  search: async (query: string, category?: string): Promise<Place[]> => {
    const response = await apiClient.get('/places/search', {
      params: { q: query, category },
    });
    return response.data;
  },

  toggleFavorite: async (id: string): Promise<void> => {
    await apiClient.post(`/places/${id}/favorite`);
  },
};

// ============ AGENT (Chat) ============
export const agentApi = {
  chat: async (
    message: string,
    history: ChatMessage[] = [],
    context?: Record<string, any>
  ): Promise<ReadableStream<Uint8Array>> => {
    const response = await fetch(`${apiClient.defaults.baseURL}/agent/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiClient.defaults.headers.Authorization}`,
      },
      body: JSON.stringify({ message, history, context }),
    });

    if (!response.ok) {
      throw new Error('Chat request failed');
    }

    if (!response.body) {
      throw new Error('No response body');
    }

    return response.body;
  },
};

export default {
  auth: authApi,
  routes: routesApi,
  places: placesApi,
  agent: agentApi,
};

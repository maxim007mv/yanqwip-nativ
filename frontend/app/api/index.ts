import apiClient from './client';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
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
  PlaceCategory,
  Achievement,
  AchievementProgress,
} from '@/lib/types';

export { friendsApi } from './friends';

// Кроссплатформенное хранилище для избранного
const favoritesStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
};

// ============ AUTH ============
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthTokens & { user: User }> => {
    const response = await apiClient.post('/auth/login', data);
    // Backend возвращает { access_token, refresh_token, expires_in }
    // Преобразуем в формат frontend
    const backendData = response.data;
    
    // Получаем данные пользователя
    const userResponse = await apiClient.get('/auth/me', {
      headers: { Authorization: `Bearer ${backendData.access_token}` }
    });
    
    return {
      accessToken: backendData.access_token,
      refreshToken: backendData.refresh_token,
      expiresIn: backendData.expires_in || 1800,
      user: {
        id: userResponse.data.id.toString(),
        email: userResponse.data.email,
        name: userResponse.data.full_name || userResponse.data.email,
        createdAt: userResponse.data.created_at,
      }
    };
  },

  register: async (data: RegisterRequest): Promise<AuthTokens & { user: User }> => {
    // Сначала регистрируем
    const registerResponse = await apiClient.post('/auth/register', {
      email: data.email,
      password: data.password,
      full_name: data.name,
    });
    
    // Затем логинимся
    return await authApi.login({ email: data.email, password: data.password });
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return {
      id: response.data.id.toString(),
      email: response.data.email,
      name: response.data.full_name || response.data.email,
      createdAt: response.data.created_at,
    };
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put('/auth/me', {
      full_name: data.name,
      email: data.email,
    });
    return {
      id: response.data.id.toString(),
      email: response.data.email,
      name: response.data.full_name || response.data.email,
      createdAt: response.data.created_at,
    };
  },
};

// ============ ROUTES ============
export const routesApi = {
  // Новый метод: запуск асинхронной генерации
  startGeneration: async (data: GenerateRouteRequest): Promise<{ jobId: string; status: string }> => {
    const backendRequest = {
      start_time: data.answers.find(a => a.questionId === 'start_time')?.answer || '10:00',
      duration: data.answers.find(a => a.questionId === 'duration')?.answer || '4-6 часов',
      walk_type: data.answers.find(a => a.questionId === 'walk_type')?.answer || 'romantic',
      start_point: data.answers.find(a => a.questionId === 'start_point')?.answer || 'Центр города',
      budget: data.context.budget || 'medium',
      preferences: data.answers.find(a => a.questionId === 'preferences')?.answer || '',
      activities: data.context.categories?.join(', ') || '',
      food: data.answers.find(a => a.questionId === 'food')?.answer || '',
      transport: data.answers.find(a => a.questionId === 'transport')?.answer || 'пешком',
      limitations: data.answers.find(a => a.questionId === 'limitations')?.answer || '',
      context: JSON.stringify(data.context),
    };

    console.log('🚀 Запуск асинхронной генерации маршрута');
    const response = await apiClient.post('/routes/generate/start', backendRequest);
    return {
      jobId: response.data.job_id,
      status: response.data.status,
    };
  },

  // Новый метод: проверка статуса генерации
  checkGenerationStatus: async (jobId: string): Promise<{
    jobId: string;
    status: 'pending' | 'running' | 'done' | 'error';
    result?: any;
    error?: string;
  }> => {
    const response = await apiClient.get(`/routes/generate/status/${jobId}`);
    return response.data;
  },

  // Улучшенный метод генерации с polling
  generateAsync: async (data: GenerateRouteRequest): Promise<GenerateRouteResponse> => {
    // Запускаем генерацию
    const { jobId } = await routesApi.startGeneration(data);
    console.log(`� Задача создана: ${jobId}`);

    // Polling: проверяем статус каждые 2 секунды
    const maxAttempts = 60; // максимум 2 минуты
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const status = await routesApi.checkGenerationStatus(jobId);
      console.log(`🔄 Статус [${i + 1}/${maxAttempts}]:`, status.status);

      if (status.status === 'done' && status.result) {
        const routeData = status.result;
        return {
          route: {
            id: routeData.route_id || `route_${Date.now()}`,
            title: routeData.title,
            summary: routeData.summary?.intro || '',
            tags: routeData.summary?.transport ? [routeData.summary.transport] : [],
            steps: routeData.steps.map((step: any, index: number) => ({
              id: `step_${index}`,
              title: step.title,
              description: step.description,
              address: step.address || '',
              category: 'cafe' as PlaceCategory,
              duration: step.duration_minutes || 60,
              coordinates: step.coordinates ? {
                lat: step.coordinates.lat,
                lon: step.coordinates.lon,
              } : undefined,
              order: index,
            })),
            tips: [
              routeData.summary?.tips,
              routeData.summary?.food,
              routeData.summary?.weather_plan,
            ].filter(Boolean),
            totalDuration: routeData.steps.reduce((sum: number, s: any) => sum + (s.duration_minutes || 60), 0),
            city: data.context.city,
            createdAt: routeData.created_at || new Date().toISOString(),
            userId: data.context.userId || '',
            isPublic: false,
            yandexUrl: routeData.yandex_url,
          },
          estimatedTime: 0,
        };
      } else if (status.status === 'error') {
        throw new Error(status.error || 'Ошибка генерации маршрута');
      }
    }

    throw new Error('Превышено время ожидания генерации маршрута');
  },

  // Старый синхронный метод (оставляем для совместимости)
  generate: async (data: GenerateRouteRequest): Promise<GenerateRouteResponse> => {
    // Теперь используем асинхронный метод
    return await routesApi.generateAsync(data);
  },

  getMyRoutes: async (): Promise<Route[]> => {
    const response = await apiClient.get('/routes/user');
    return response.data.map((item: any) => ({
      id: item.id.toString(),
      title: item.title,
      summary: '',
      tags: [],
      steps: [],
      tips: [],
      totalDuration: 0,
      city: 'Москва',
      createdAt: item.created_at,
      userId: '',
      isPublic: false,
    }));
  },

  getPublicRoutes: async (limit = 10): Promise<Route[]> => {
    // Backend не имеет публичных маршрутов, возвращаем пустой массив
    return [];
  },

  getRouteById: async (id: string): Promise<Route> => {
    const response = await apiClient.get(`/routes/${id}`);
    const data = response.data;
    
    const summaryData = typeof data.summary === 'string' ? JSON.parse(data.summary) : data.summary;
    const stepsData = typeof data.steps_json === 'string' ? JSON.parse(data.steps_json) : data.steps;
    
    return {
      id: data.id.toString(),
      title: data.title,
      summary: summaryData?.intro || '',
      tags: [],
      steps: stepsData.map((step: any, index: number) => ({
        id: step.id || `step_${index}`,
        title: step.title,
        description: step.description,
        address: step.address || '',
        category: 'cafe' as PlaceCategory,
        duration: step.duration_minutes || 60,
        coordinates: step.coordinates,
        order: index,
      })),
      tips: Array.isArray(summaryData?.tips) 
        ? summaryData.tips 
        : summaryData?.tips 
          ? [summaryData.tips] 
          : [],
      totalDuration: stepsData.reduce((sum: number, s: any) => sum + (s.duration_minutes || 60), 0),
      city: 'Москва',
      createdAt: data.created_at,
      userId: data.user_id?.toString() || '',
      isPublic: false,
      yandexUrl: data.yandex_url || null,
    };
  },

  saveRoute: async (route: Omit<Route, 'id' | 'createdAt' | 'userId'>): Promise<Route> => {
    const response = await apiClient.post('/routes/save', {
      title: route.title,
      summary: {
        intro: route.summary,
        tips: route.tips.join('. '),
      },
      steps: route.steps.map(step => ({
        title: step.title,
        description: step.description,
        duration_minutes: step.duration,
        address: step.address,
        coordinates: step.coordinates,
      })),
      yandex_url: null,
      deepseek_raw: '',
    });
    
    return {
      ...route,
      id: response.data.id.toString(),
      createdAt: response.data.created_at,
      userId: response.data.user_id?.toString() || '',
    };
  },

  deleteRoute: async (id: string): Promise<void> => {
    await apiClient.delete(`/routes/${id}`);
  },

  likeRoute: async (id: string): Promise<void> => {
    // Backend не поддерживает лайки пока
    console.log('Likes not implemented in backend yet');
  },
};

// ============ PLACES ============
export const placesApi = {
  getAll: async (category?: string): Promise<Place[]> => {
    const params: any = {};
    if (category && category !== 'all') {
      // Маппинг категорий frontend в place_type_id backend
      const categoryMap: Record<string, number> = {
        'cafe': 1,
        'restaurant': 2,
        'bar': 3,
        'museum': 4,
        'park': 19,
      };
      if (categoryMap[category]) {
        params.place_type_id = categoryMap[category];
      }
    }
    
    const response = await apiClient.get('/places/search', { params });
    return response.data.places?.map((p: any) => ({
      id: p.place_id.toString(),
      title: p.name,
      description: p.description || '',
      address: p.address || '',
      category: 'cafe' as PlaceCategory,
      area: '',
      rating: 4.5,
      reviewCount: 0,
      priceLevel: p.price_category_id || 2,
      imageUrl: '',
      isOpen: true,
      coordinates: p.latitude && p.longitude ? {
        lat: parseFloat(p.latitude),
        lon: parseFloat(p.longitude),
      } : undefined,
      tags: [],
    })) || [];
  },

  getById: async (id: string): Promise<Place> => {
    const response = await apiClient.get(`/places/${id}`);
    const p = response.data;
    return {
      id: p.place_id.toString(),
      title: p.name,
      description: p.description || '',
      address: p.address || '',
      category: 'cafe' as PlaceCategory,
      area: '',
      rating: 4.5,
      reviewCount: 0,
      priceLevel: p.price_category?.id || 2,
      imageUrl: '',
      isOpen: true,
      coordinates: p.latitude && p.longitude ? {
        lat: parseFloat(p.latitude),
        lon: parseFloat(p.longitude),
      } : undefined,
      tags: [],
    };
  },

  search: async (query: string, category?: string): Promise<Place[]> => {
    const response = await apiClient.get('/places/search', {
      params: { query },
    });
    return response.data.places?.map((p: any) => ({
      id: p.place_id.toString(),
      title: p.name,
      description: p.description || '',
      address: p.address || '',
      category: 'cafe' as PlaceCategory,
      area: '',
      rating: 4.5,
      reviewCount: 0,
      priceLevel: p.price_category_id || 2,
      imageUrl: '',
      isOpen: true,
      coordinates: p.latitude && p.longitude ? {
        lat: parseFloat(p.latitude),
        lon: parseFloat(p.longitude),
      } : undefined,
      tags: [],
    })) || [];
  },

  toggleFavorite: async (id: string): Promise<void> => {
    const FAVORITES_KEY = 'favorite_places';
    const placeId = parseInt(id, 10);
    
    if (isNaN(placeId)) {
      throw new Error(`Invalid place ID: ${id}`);
    }

    // Пытаемся синхронизировать с бэкендом
    try {
      // Проверяем, есть ли уже в избранном
      const favorites = await placesApi.getFavorites();
      const isFavorite = favorites.includes(id);
      
      if (isFavorite) {
        // Удаляем из избранного
        await apiClient.delete(`/places/${placeId}/favorite`);
      } else {
        // Добавляем в избранное
        await apiClient.post(`/places/${placeId}/favorite`);
      }
      
      // После успешного обновления на сервере, обновляем локальное хранилище
      try {
        const stored = await favoritesStorage.getItem(FAVORITES_KEY);
        const localFavorites: string[] = stored ? JSON.parse(stored) : [];
        const index = localFavorites.indexOf(id);
        if (isFavorite) {
          // Удаляем из локального хранилища
          if (index > -1) {
            localFavorites.splice(index, 1);
          }
        } else {
          // Добавляем в локальное хранилище
          if (index === -1) {
            localFavorites.push(id);
          }
        }
        await favoritesStorage.setItem(FAVORITES_KEY, JSON.stringify(localFavorites));
      } catch {
        // Игнорируем ошибки локального хранилища
      }
    } catch (error) {
      // Если API недоступен или ошибка, используем только локальное хранилище как fallback
      try {
        const stored = await favoritesStorage.getItem(FAVORITES_KEY);
        const favorites: string[] = stored ? JSON.parse(stored) : [];
        const index = favorites.indexOf(id);
        if (index > -1) {
          favorites.splice(index, 1);
        } else {
          favorites.push(id);
        }
        await favoritesStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      } catch {
        // Тихая обработка ошибок
      }
      // Пробрасываем ошибку дальше, чтобы React Query мог обработать её
      throw error;
    }
  },
  
  getFavorites: async (): Promise<string[]> => {
    // Получить список ID избранных мест
    try {
      const response = await apiClient.get('/places/favorites/ids');
      return response.data.place_ids?.map((id: number) => id.toString()) || [];
    } catch (error) {
      // Если пользователь не авторизован, используем локальное хранилище как fallback
      const FAVORITES_KEY = 'favorite_places';
      try {
        const stored = await favoritesStorage.getItem(FAVORITES_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
  },
};

// ============ AGENT (Chat) ============
export const agentApi = {
  chat: async (
    message: string,
    history: ChatMessage[] = [],
    context?: Record<string, any>
  ): Promise<{ response: string }> => {
    // Backend использует простой POST без streaming пока
    const response = await apiClient.post('/agent/message', {
      message,
      history: history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      })),
    });
    
    return {
      response: response.data.reply,
    };
  },
};

// ============ ACHIEVEMENTS ============
export const achievementsApi = {
  getUserAchievements: async (): Promise<AchievementProgress[]> => {
    const response = await apiClient.get('/achievements/');
    return response.data;
  },

  getAchievementDetail: async (achievementId: number): Promise<AchievementProgress> => {
    const response = await apiClient.get(`/achievements/${achievementId}`);
    return response.data;
  },

  acceptChallenge: async (achievementId: number): Promise<{ message: string }> => {
    const response = await apiClient.post(`/achievements/${achievementId}/accept`);
    return response.data;
  },

  updateProgress: async (
    achievementId: number,
    data: { current_progress?: number; is_completed?: boolean; is_accepted?: boolean }
  ): Promise<any> => {
    const response = await apiClient.put(`/achievements/${achievementId}/progress`, data);
    return response.data;
  },
};

export default {
  auth: authApi,
  routes: routesApi,
  places: placesApi,
  agent: agentApi,
  achievements: achievementsApi,
};

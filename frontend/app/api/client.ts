import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { useAuthStore } from '@/store/authStore';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 120000, // 120 секунд для генерации маршрута (AI может долго думать)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - автоматически добавляем токен
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { tokens } = useAuthStore.getState();
    
    if (tokens?.accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - обрабатываем 401 и рефрешим токен
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { tokens, setTokens, logout } = useAuthStore.getState();

        if (!tokens?.refreshToken) {
          await logout();
          return Promise.reject(error);
        }

        // Пытаемся обновить токен
        const response = await axios.post(`${API_URL}/api/auth/refresh`, {
          refresh_token: tokens.refreshToken,
        });

        const newTokens = {
          accessToken: response.data.access_token,
          refreshToken: tokens.refreshToken, // Backend не возвращает новый refresh token
          expiresIn: response.data.expires_in || 1800,
        };
        await setTokens(newTokens);

        // Повторяем оригинальный запрос с новым токеном
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        }
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Если рефреш не удался - выходим
        await useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '../store/auth.store';
import type { RefreshResponse } from '../types/api';

const baseUrl = (process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
console.log('API Base URL:', baseUrl);
const apiBase = `${baseUrl}/api`;

const api = axios.create({
  baseURL: apiBase,
  timeout: 20000,
});

const refreshClient = axios.create({
  baseURL: apiBase,
  timeout: 20000,
});

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

type RequestConfig = AxiosRequestConfig & { _retry?: boolean };

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const processQueue = (token: string | null) => {
  pendingQueue.forEach((resolve) => resolve(token));
  pendingQueue = [];
};

const refreshAccessToken = async (): Promise<string> => {
  const { refreshToken, setTokens, clear } = useAuthStore.getState();
  if (!refreshToken) {
    await clear();
    throw new Error('REFRESH_TOKEN_MISSING');
  }

  const response = await refreshClient.post<RefreshResponse>('/auth/refresh', {
    refresh_token: refreshToken,
  });

  const { access_token: accessToken } = response.data;
  await setTokens(accessToken, refreshToken);
  return accessToken;
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const { response, config } = error;
    const originalRequest = config as RequestConfig;

    if (response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((token) => {
            if (!token) {
              reject(error);
              return;
            }
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(newToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(null);
        await useAuthStore.getState().clear();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { api };

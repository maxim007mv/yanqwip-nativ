import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '../store/auth.store';
import type { RefreshResponse } from '../types/api';
import { apiBaseUrl, apiConfig } from '../config/api';
import { logger } from '../utils/logger';

// Log the API base URL on startup
console.log('API Base URL:', apiBaseUrl);
console.log('API Config:', apiConfig);

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: apiConfig.timeout,
});

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

type RequestConfig = AxiosRequestConfig & { _retry?: boolean };

// Request interceptor - add auth headers and log requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  const startTime = new Date().getTime();

  // Save start time for duration calculation
  (config as any).metadata = { startTime };

  // Add auth token if available
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Log the outgoing request
  logger.info(`REQUEST: ${config.method?.toUpperCase()} ${config.url}`);

  return config;
}, (error) => {
  logger.error(`REQUEST ERROR: ${error.message}`);
  return Promise.reject(error);
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

// Helper function to calculate request duration
function calculateRequestDuration(config: any): number {
  const startTime = config.metadata?.startTime;
  return startTime ? new Date().getTime() - startTime : -1;
}

// Response interceptor - handle refresh token and log responses
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Calculate request duration
    const duration = calculateRequestDuration(response.config);

    // Log successful response
    logger.info(`RESPONSE: ${response.config.method?.toUpperCase()} ${response.config.url} | ${response.status}`, {
      duration: `${duration}ms`
    });

    return response;
  },
  async (error: AxiosError) => {
    const { response, config } = error;
    const originalRequest = config as RequestConfig;

    // Log error response
    const duration = config ? calculateRequestDuration(config) : -1;
    logger.error(`API ERROR: ${config?.method?.toUpperCase()} ${config?.url} | ${response?.status || 'NETWORK_ERROR'}`, {
      message: error.message,
      code: error.code,
      duration: duration >= 0 ? `${duration}ms` : 'unknown',
      stack: error.stack
    });

    // Handle network errors specifically
    if (!response && error.code) {
      logger.error('NETWORK ERROR DETAILS:', {
        code: error.code,
        errno: (error as any).errno,
        syscall: (error as any).syscall,
        hostname: (error as any).hostname,
        config: {
          url: config?.url,
          method: config?.method,
          baseURL: config?.baseURL,
          timeout: config?.timeout
        }
      });
    }

    // Handle 401 unauthorized error (token expired)
    if (response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((token) => {
            if (!token) {
              logger.error('Token refresh failed in queue');
              reject(error);
              return;
            }

            logger.info('Retrying request with new token');
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
        logger.info('Attempting token refresh');
        const newToken = await refreshAccessToken();
        processQueue(newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        logger.info('Request retried after token refresh');
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(null);
        await useAuthStore.getState().clear();
        logger.error('Authentication failed, user logged out');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { api };

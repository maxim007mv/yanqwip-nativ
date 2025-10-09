import { logger } from './logger';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiBaseUrl, apiConfig } from '../config/api';
import { useAuthStore } from '../store/auth.store';
import { RefreshResponse } from '../types/api';

// Create axios instance with configuration
const api: AxiosInstance = axios.create({
    baseURL: apiBaseUrl,
    timeout: apiConfig.timeout,
});

// Create separate instance for refresh token to avoid circular requests
const refreshClient = axios.create({
    baseURL: apiBaseUrl,
    timeout: apiConfig.timeout,
});

// State for refresh token process
let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

// Request interceptor - add auth headers and log
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    const startTime = new Date().getTime();

    // Set request start time for duration calculation
    config.metadata = { startTime };

    // Add auth token if available
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Log outgoing request
    logger.info(`🚀 REQUEST: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        params: config.params,
        data: config.data ? '(data present)' : undefined,
        timestamp: new Date().toISOString()
    });

    return config;
}, (error) => {
    logger.error(`❌ REQUEST ERROR: ${error.message}`);
    return Promise.reject(error);
});

// Process queue of pending requests after token refresh
const processQueue = (token: string | null) => {
    pendingQueue.forEach((resolve) => resolve(token));
    pendingQueue = [];
};

// Refresh access token function
const refreshAccessToken = async (): Promise<string> => {
    const { refreshToken, setTokens, clear } = useAuthStore.getState();

    if (!refreshToken) {
        logger.warn('🔒 Refresh token missing, logging out user');
        await clear();
        throw new Error('REFRESH_TOKEN_MISSING');
    }

    try {
        logger.info('🔄 Attempting token refresh');
        const response = await refreshClient.post<RefreshResponse>('/auth/refresh', {
            refresh_token: refreshToken,
        });

        const { access_token: accessToken } = response.data;
        await setTokens(accessToken, refreshToken);
        logger.info('✅ Token refreshed successfully');
        return accessToken;
    } catch (error) {
        logger.error('❌ Token refresh failed', error);
        throw error;
    }
};

// Response interceptor - handle refresh token, log responses
api.interceptors.response.use(
    (response: AxiosResponse) => {
        const duration = calculateRequestDuration(response);

        logger.info(`✅ RESPONSE: ${response.config.method?.toUpperCase()} ${response.config.url} | ${response.status}`, {
            status: response.status,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString()
        });

        return response;
    },
    async (error: AxiosError) => {
        const { response, config } = error;
        const originalRequest = config as any;

        // Log the error with appropriate details
        logResponseError(error);

        // Handle 401 error and token refresh
        if (response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    pendingQueue.push((token) => {
                        if (!token) {
                            logger.error('🔒 Token refresh failed in queue');
                            reject(error);
                            return;
                        }

                        logger.info('🔄 Retrying request with new token');
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
                logger.error('🔒 Authentication failed, user logged out');
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// Helper function to calculate request duration
function calculateRequestDuration(response: AxiosResponse): number {
    const config = response.config as any;
    const startTime = config.metadata?.startTime;
    return startTime ? new Date().getTime() - startTime : -1;
}

// Helper function to log response errors
function logResponseError(error: AxiosError): void {
    const { response, config, message } = error;
    const duration = config ? calculateRequestDuration(config as any as AxiosResponse) : -1;

    logger.error(`❌ API ERROR: ${config?.method?.toUpperCase()} ${config?.url} | ${response?.status || 'NETWORK_ERROR'}`, {
        status: response?.status,
        statusText: response?.statusText,
        data: response?.data,
        message: message,
        duration: duration >= 0 ? `${duration}ms` : 'unknown',
        timestamp: new Date().toISOString()
    });
}

export { api };
// API configuration
const apiConfig = {
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://yanqwip.ru:8443',
    apiPrefix: '/api',
    timeout: 20000, // 20 seconds
    retries: 2,     // number of retries for failed requests
};

// Full API URL with prefix
const apiBaseUrl = `${apiConfig.baseUrl.replace(/\/$/, '')}${apiConfig.apiPrefix}`;

// External API configs
const externalApis = {
    deepseek: {
        baseUrl: process.env.EXPO_PUBLIC_DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
        apiKey: process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY || '',
        timeout: 25000, // 25 seconds for LLM responses
    },
    yandex: {
        geocoderKey: process.env.EXPO_PUBLIC_YANDEX_GEOCODER_KEY || '',
    },
};

// Export all configurations
export {
    apiConfig,
    apiBaseUrl,
    externalApis
};
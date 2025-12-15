import axios from 'axios';

function normalizeHttpError(error) {
  if (error.response) {
    return {
      type: 'HTTP_ERROR',
      status: error.response.status,
      message:
        error.response.data?.message ||
        error.response.statusText ||
        'Request failed',
      data: error.response.data,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
    };
  }

  if (error.request) {
    return {
      type: 'NETWORK_ERROR',
      status: null,
      message: 'Network error or no response from server',
      data: null,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
    };
  }

  return {
    type: 'UNKNOWN_ERROR',
    status: null,
    message: error.message || 'Unexpected error',
    data: null,
  };
}

export function createHttpClient(config = {}, getToken) {
  const client = axios.create({
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });

  if (getToken) {
    client.interceptors.request.use((reqConfig) => {
      const token = typeof getToken === 'function' ? getToken() : getToken;

      if (token && !reqConfig.headers.Authorization) {
        reqConfig.headers.Authorization = `Bearer ${token}`;
      }

      return reqConfig;
    }, (error) => {
      return Promise.reject(error);
    });
  }

  client.interceptors.response.use(
    (response) => {
      if (typeof import.meta !== 'undefined' && import.meta?.env?.DEV) {
        console.info(
          `[HTTP ${response.status}] ${response.config.method?.toUpperCase()} ${response.config.url}`,
          response.data
        );
      }

      return response.data;
    },

    (error) => {
      const normalizedError = normalizeHttpError(error);

      console.error(
        `[HTTP ERROR] ${normalizedError.status ?? 'N/A'} ${normalizedError.method} ${normalizedError.url}`,
        normalizedError.message,
        normalizedError.data
      );

      return Promise.reject(normalizedError);
    }
  );

  return client;
}
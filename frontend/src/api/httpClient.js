import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:3000/api';
const TIMEOUT = 15000;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const status = error.response?.status;
    
    if (status === 401 && error.config.url !== '/auth/login') {
        localStorage.removeItem('token');
    }

    return Promise.reject(error.response?.data || error);
  }
);

export const axiosService = client;
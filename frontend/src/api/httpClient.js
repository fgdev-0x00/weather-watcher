// src/api/httpClient.js
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:3000/api';
const TIMEOUT = 15000;

// 1. Creación de la instancia
const client = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor de SOLICITUD: Inyección del Bearer Token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Adjuntar el token si existe y el header Authorization no está ya definido
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor de RESPUESTA: Normalización de salida y manejo de errores
client.interceptors.response.use(
  (response) => {
    // Retornamos directamente response.data (la respuesta de tu API: { success: true, data: ... })
    return response.data;
  },
  (error) => {
    const status = error.response?.status;
    
    // Manejo de 401: Si el token falla en cualquier llamada que no sea el login, forzamos logout
    if (status === 401 && error.config.url !== '/auth/login') {
        localStorage.removeItem('token');
        // NOTA: No podemos usar navigate aquí, la redirección se gestiona mejor en el Context/Hooks.
    }

    // Rechazamos la promesa con el cuerpo del error de la API (ej. { success: false, message: "..." })
    // Esto permite que el try/catch de la vista acceda al mensaje de error.
    return Promise.reject(error.response?.data || error);
  }
);

// Exportamos como axiosService para que coincida con la importación de tu service
export const axiosService = client;
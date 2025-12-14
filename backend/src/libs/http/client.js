// httpClient.js
import axios from 'axios';

// ============================
// * ERROR NORMALIZATION
// ============================
/**
 * Normaliza el objeto de error de Axios a una estructura consistente.
 * @param {import('axios').AxiosError} error El objeto de error de Axios.
 * @returns {{ type: string, status: number|null, message: string, data: any, url: string|undefined, method: string|undefined }}
 */
function normalizeHttpError(error) {
  // 1. Error de respuesta (servidor respondió con 4xx o 5xx)
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

  // 2. Error de solicitud (ej. timeout, sin conexión)
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

  // 3. Otros errores (ej. error en el código antes de la solicitud)
  return {
    type: 'UNKNOWN_ERROR',
    status: null,
    message: error.message || 'Unexpected error',
    data: null,
  };
}

// ============================
// * HTTP CLIENT FACTORY
// ============================
/**
 * Crea una instancia de cliente HTTP de Axios preconfigurada.
 *
 * @param {import('axios').AxiosRequestConfig} config La configuración inicial de Axios.
 * @param {string | (() => string | null | undefined)} [getToken] Opcional. Una función que retorna el token de autenticación (Bearer Token) o una cadena directamente.
 * @returns {import('axios').AxiosInstance}
 */
export function createHttpClient(config = {}, getToken) {
  // Creamos la instancia con configuración por defecto y la configuración pasada.
  const client = axios.create({
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...config, // Permite sobrescribir baseURL, timeout, o headers
  });

  // --- INTERCEPTORES ---

  /* ============================
   * 1. REQUEST INTERCEPTOR (Autenticación)
   * ============================ */
  if (getToken) {
    client.interceptors.request.use((reqConfig) => {
      // Intenta obtener el token (si es una función, la ejecuta)
      const token = typeof getToken === 'function' ? getToken() : getToken;

      // Solo adjunta el token si existe y la solicitud no lo ha establecido ya
      if (token && !reqConfig.headers.Authorization) {
        reqConfig.headers.Authorization = `Bearer ${token}`;
      }

      return reqConfig;
    }, (error) => {
      // Reenvía cualquier error de configuración
      return Promise.reject(error);
    });
  }


  /* ============================
   * 2. RESPONSE INTERCEPTOR (Manejo de Respuestas/Errores)
   * ============================ */
  client.interceptors.response.use(
    (response) => {
      // Log de éxito (opcional)
      if (typeof import.meta !== 'undefined' && import.meta?.env?.DEV) {
        console.info(
          `[HTTP ${response.status}] ${response.config.method?.toUpperCase()} ${response.config.url}`,
          response.data
        );
      }

      // Retornamos siempre `data` directamente para simplificar el uso
      return response.data;
    },

    (error) => {
      const normalizedError = normalizeHttpError(error);

      // Log de error
      console.error(
        `[HTTP ERROR] ${normalizedError.status ?? 'N/A'} ${normalizedError.method} ${normalizedError.url}`,
        normalizedError.message,
        normalizedError.data // Muestra la respuesta del error para debugging
      );

      // Rechazamos la promesa con el error normalizado
      return Promise.reject(normalizedError);
    }
  );

  return client;
}
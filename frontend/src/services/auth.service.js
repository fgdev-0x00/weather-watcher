// src/services/auth.service.js
import { axiosService } from '../api/httpClient';

export const authService = {
  /**
   * Registra un nuevo usuario.
   */
  register: (payload) =>
    axiosService.post('/auth/register', payload),

  /**
   * Inicia sesión, solicitando el token.
   * @param {{ username: string, password: string }} payload 
   */
  login: (payload) =>
    axiosService.post('/auth/login', payload),

  /**
   * Obtiene los datos del usuario actual (protegido por token).
   * NOTA: Asumo que el endpoint es '/user' o '/auth/me'.
   */
  getUser: () =>
    axiosService.get('/user'),
};
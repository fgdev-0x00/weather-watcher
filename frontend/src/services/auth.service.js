import { axiosService } from '../api/httpClient';

export const authService = {
  register: (payload) =>
    axiosService.post('/auth/register', payload),
  login: (payload) =>
    axiosService.post('/auth/login', payload),
  getUser: () =>
    axiosService.get('/user'),
};
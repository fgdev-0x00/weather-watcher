// src/services/weather.service.js
import { axiosService } from '../api/httpClient';

const API_ROUTES = {
  CITIES: '/city',
};

/**
 * Obtiene el pronóstico actual y los pronósticos de 7 días para las ciudades principales.
 * El token se adjunta automáticamente por el interceptor de Axios.
 * @returns {Promise<{ cities: Array<object> }>} Retorna la propiedad 'data' de la respuesta (el array de ciudades).
 */
const getPopularCities = async () => {
  // axiosService ya devuelve response.data, que en este caso es 
  // { success: true, data: { cities: [...] } }
  const res = await axiosService.get(API_ROUTES.CITIES);
  
  // Retornamos solo el array de ciudades
  return res.data.cities;
};

export const weatherService = {
  getPopularCities,
};
import { axiosService } from '../api/httpClient';

const API_ROUTES = {
  CITIES: '/city',
};

const getPopularCities = async () => {
  const res = await axiosService.get(API_ROUTES.CITIES);
  
  return res.data.cities;
};

export const weatherService = {
  getPopularCities,
};
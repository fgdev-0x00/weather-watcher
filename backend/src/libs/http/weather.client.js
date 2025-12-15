import { createHttpClient } from './client.js';

const WEATHER_API_KEY = process.env.OPEN_WEATHER_KEY;

const weatherClient = createHttpClient({
  baseURL: 'https://api.openweathermap.org/data/2.5',
});

const getCityWeather = async (lat, lon) => {
  const params = {
      lat,
      lon,
      lang: 'es',
      units: 'metric',
      appid: WEATHER_API_KEY,
  };

  const response = await weatherClient.get('/forecast', { params });
  return response;

};

export { getCityWeather };

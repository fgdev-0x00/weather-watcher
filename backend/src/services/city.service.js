import { weatherClient } from '#libs/http/weather.client';
import { getCache, setCache, hasCache } from '#utils/localCache';
import { parseCity } from '#utils/parsers';

import { POPULAR_CITIES } from '#config/popularCities';
import { cityCoordsMock } from '#config/cityCoords.mock';

const WEATHER_API_KEY = process.env.OPEN_WEATHER_KEY;
const CACHE_TTL_MS = 10 * 60 * 1000;

const getWeather = async(lat, lon) => {
     const params = {
            lat,
            lon,
            lang: 'es',
            units: 'metric',
            appid: WEATHER_API_KEY,
        };

    const response = await weatherClient.get('/forecast', { params });
    const parsedCity = parseCity(response);

    return parsedCity;
} 


const getPopularCities = async () => {
    const allCitiesKey = 'ALL_CITIES';
    
    if(hasCache(allCitiesKey)) {
        const cachedCities = getCache(allCitiesKey);
        return {
            cities: cachedCities,
        };
    }

    const allCities = [];

    for (const city of POPULAR_CITIES) {
        const parsedName = city.trim().toLocaleLowerCase().replaceAll(' ', '_');
        const cityData = cityCoordsMock[parsedName];
        const cacheKey = `${cityData.lat},${cityData.lon}`;

        if(hasCache(cacheKey)) {
            const cachedCity = getCache(cacheKey);
            allCities.push(cachedCity);
            continue;
        }

       const cityWeather = await getWeather(cityData.lat, cityData.lon);
       cityWeather.city_name = city;

       setCache(cacheKey, cityWeather, CACHE_TTL_MS);

       allCities.push(cityWeather);
    }

    setCache(allCitiesKey, allCities, CACHE_TTL_MS);

    return {
        cities: allCities,
    };

};

export { getPopularCities }
import { getCityWeather } from '#libs/http/weather.client';
import { getCities } from '#libs/http/places.client';
import { getCache, setCache, hasCache } from '#utils/localCache';
import { parseCity } from '#utils/parsers';

const CACHE_TTL_5_MIN_MS = 300000;
const CACHE_TTL_10_MIN_MS = 600000;

const getWeather = async(lat, lon) => {
    try {
        const response = await getCityWeather(lat, lon);
        const parsedCity = parseCity(response);

        return parsedCity;
    } catch (error) {
        console.log('Get error', error);
        return null;
    }
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

    const popularCitiesKeys = 'POPULAR_CITIES';

    if(!hasCache(popularCitiesKeys)) {
        const popularCities = await getCities();
        setCache(popularCitiesKeys, popularCities, CACHE_TTL_5_MIN_MS);
    }

    const cachedpopularCities = getCache(popularCitiesKeys);

    for (const city of cachedpopularCities) {
        const lat = city.lat;
        const lon = city.long;
        const cityName = city.city_name;

        const weatherCitykey = `${lat},${lon}`;
        if(!hasCache(weatherCitykey)) {
            const cityWeather = await getWeather(lat, lon);
            setCache(weatherCitykey, cityWeather, CACHE_TTL_10_MIN_MS);
        }
        const cachedCityWeather = getCache(weatherCitykey);

       cachedCityWeather.city_name = cityName;
       cachedCityWeather.state = city.state;
       allCities.push(cachedCityWeather);
       setCache(allCitiesKey, allCities, CACHE_TTL_5_MIN_MS);
    }


    return {
        cities: allCities,
    };

};

export { getPopularCities }
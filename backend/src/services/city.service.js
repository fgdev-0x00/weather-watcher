import { weatherClient } from '#libs/http/weather.client';
import { getCache, setCache, hasCache } from '#utils/localCache';

import { POPULAR_CITIES } from '#config/popularCities';
import { cityCoordsMock } from '#config/cityCoords.mock';

const WEATHER_API_KEY = process.env.OPEN_WEATHER_KEY;
const CACHE_TTL_MS = 10 * 60 * 1000;

const TIMEZONE = 'America/Mexico_City'; 

const getLocalISODate = (dt) => {
    const date = new Date(dt * 1000); 
    
    const localDateParts = date.toLocaleString('es-MX', {
        timeZone: TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).split('/');
    
    return `${localDateParts[2]}-${localDateParts[1]}-${localDateParts[0]}`; 
};

const parseCity = (cityData) => {
    const getNumericTemp = (tempC) => {
        return Math.round(Number(tempC));
    };

    if (!cityData || cityData.cod !== "200" || !cityData.list || !cityData.city) {
        console.error("Invalid data structure or API error.");
        return null;
    }

    const cityInfo = cityData.city;
    const forecastList = cityData.list;

    const currentData = forecastList[0];
    const currentTempC = currentData.main.temp;
    
    const currentConditionText = currentData.weather[0].description.charAt(0).toUpperCase() + currentData.weather[0].description.slice(1);
    
    const dailyForecasts = {};

    for (const item of forecastList) {
        const dateKey = getLocalISODate(item.dt);
        const tempC = item.main.temp;
        
        const localDate = new Date(item.dt * 1000); 
        
        const localHour = localDate.toLocaleString('en-US', { timeZone: TIMEZONE, hour: '2-digit', hour12: false }).split(':')[0];


        if (!dailyForecasts[dateKey]) {
            
            const formattedDate = localDate.toLocaleDateString('es-MX', {
                timeZone: TIMEZONE,
                weekday: 'short',
                day: '2-digit',
            });
            
            const dateParts = formattedDate.replace(/\./g, '').split(' ');
            const finalDateString = `${dateParts[0].charAt(0).toUpperCase() + dateParts[0].slice(1)} ${dateParts[1]}`;


            dailyForecasts[dateKey] = {
                date: finalDateString,
                tempMin: tempC,
                tempMax: tempC,
                entries: [],
            };
        }
        
        dailyForecasts[dateKey].tempMin = Math.min(dailyForecasts[dateKey].tempMin, tempC);
        dailyForecasts[dateKey].tempMax = Math.max(dailyForecasts[dateKey].tempMax, tempC);
        
        dailyForecasts[dateKey].entries.push({
            hour: parseInt(localHour, 10),
            condition: item.weather[0].description,
        });
    }
    
    const sortedDailyKeys = Object.keys(dailyForecasts);

    const todayForecastKey = sortedDailyKeys[0];
    const todayForecast = dailyForecasts[todayForecastKey];

    const finalForecast = Object.values(dailyForecasts)
        .slice(1, 6)
        .map(day => {
            const dayTimeEntries = day.entries.filter(e => e.hour >= 12 && e.hour <= 21);
            
            let selectedEntry = dayTimeEntries.find(e => e.hour === 15) || dayTimeEntries[0] || day.entries[0];
            
            const conditionText = selectedEntry.condition.charAt(0).toUpperCase() + selectedEntry.condition.slice(1);

            return {
                'date': day.date,
                'max': getNumericTemp(day.tempMax),
                'min': getNumericTemp(day.tempMin),
                'condition': conditionText,
            };
        });

    return {
        'city_name': cityInfo.name,
        'temp': getNumericTemp(currentTempC), 
        'condition': currentConditionText,
        'max': getNumericTemp(todayForecast.tempMax),
        'min': getNumericTemp(todayForecast.tempMin),
        
        'seven_day_forecast': finalForecast, 
    };
};


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

        const params = {
            lat: cityData.lat,
            lon: cityData.lon,
            lang: 'es',
            units: 'metric',
            appid: WEATHER_API_KEY,
        };

       const response = await weatherClient.get('/forecast', { params });
       const parsedCity = parseCity(response);
       parsedCity.city_name = city;

       setCache(cacheKey, parsedCity, CACHE_TTL_MS);

       allCities.push(parsedCity);
    }

    setCache(allCitiesKey, allCities, CACHE_TTL_MS);

    return {
        cities: allCities,
    };

};

export { getPopularCities }
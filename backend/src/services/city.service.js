import { weatherClient } from '#libs/http/weather.client';
import { getCache, setCache, hasCache } from '#utils/localCache';

import { POPULAR_CITIES } from '#config/popularCities';
import { cityCoordsMock } from '#config/cityCoords.mock';

const WEATHER_API_KEY = process.env.OPEN_WEATHER_KEY;
const CACHE_TTL_MS = 10 * 60 * 1000;


// Constante para la conversión de unidades
const KELVIN_OFFSET = 273.15;
// Zona horaria para la conversión de fechas locales
const TIMEZONE = 'America/Mexico_City'; 

/**
 * Convierte Kelvin a Celsius.
 * @param {number} k Kelvin
 * @returns {number} Celsius redondeado.
 */
const kelvinToCelsius = (k) => {
    return Math.round(k - KELVIN_OFFSET);
};

/**
 * Obtiene la fecha local en formato ISO (YYYY-MM-DD) para usar como CLAVE DE AGRUPACIÓN.
 * @param {number} dt Timestamp en segundos (UTC).
 * @returns {string} Fecha local en formato ISO.
 */
const getLocalISODate = (dt) => {
    // Multiplicamos por 1000 para convertir segundos a milisegundos
    const date = new Date(dt * 1000); 
    
    // Usamos 'es-MX' para asegurar la localización, obteniendo DÍA/MES/AÑO
    const localDateParts = date.toLocaleString('es-MX', {
        timeZone: TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).split('/');
    
    // El formato devuelto por toLocaleString('es-MX') es generalmente DD/MM/AAAA.
    // Reordenamos a AAAA-MM-DD para el formato ISO:
    // localDateParts[0] = día, localDateParts[1] = mes, localDateParts[2] = año
    return `${localDateParts[2]}-${localDateParts[1]}-${localDateParts[0]}`; 
};

/**
 * Parsea los datos de la respuesta de la API del clima a un formato simplificado.
 *
 * @param {object} cityData El objeto de respuesta completo de la API.
 * @returns {object | null} Los datos del clima y el pronóstico simplificados.
 */
const parseCity = (cityData) => {
    // 💡 NOTA: Asumo que las funciones getLocalISODate, kelvinToCelsius y la constante TIMEZONE
    // están definidas y disponibles en el scope de este archivo.
    
    // Función auxiliar para extraer el número de la temperatura
    const getNumericTemp = (tempC) => {
        return Number(tempC);
    };

    // Validación de la estructura de datos
    if (!cityData || cityData.cod !== "200" || !cityData.list || !cityData.city) {
        console.error("Invalid data structure or API error.");
        return null;
    }

    const cityInfo = cityData.city;
    const forecastList = cityData.list;

    // ============================================
    // 1. CURRENT WEATHER (Usando el primer elemento para temperatura y condición)
    // ============================================
    const currentData = forecastList[0];
    const currentTempC = kelvinToCelsius(currentData.main.temp);
    
    // Capitalizar la primera letra de la descripción
    const currentConditionText = currentData.weather[0].description.charAt(0).toUpperCase() + currentData.weather[0].description.slice(1);
    
    // ============================================
    // 2. DAILY FORECAST PROCESSING & MIN/MAX CALCULATION
    // ============================================
    const dailyForecasts = {};

    for (const item of forecastList) {
        // Clave interna para agrupar (YYYY-MM-DD)
        const dateKey = getLocalISODate(item.dt);
        const tempC = kelvinToCelsius(item.main.temp);
        
        // Creamos un objeto Date local para obtener el formato de fecha final y la hora
        const localDate = new Date(item.dt * 1000); 
        
        // Obtener la hora local (0-23) para la estrategia de condición climática
        const localHour = localDate.toLocaleString('en-US', { timeZone: TIMEZONE, hour: '2-digit', hour12: false }).split(':')[0];


        if (!dailyForecasts[dateKey]) {
            // Inicializar el día.
            const formattedDate = localDate.toLocaleDateString('es-MX', {
                timeZone: TIMEZONE,
                weekday: 'short',    // ej. 'dom.'
                day: '2-digit',      // ej. '14'
            });
            
            // Post-procesamiento para obtener "Dom 14"
            const dateParts = formattedDate.replace(/\./g, '').split(' ');
            const finalDateString = `${dateParts[0].charAt(0).toUpperCase() + dateParts[0].slice(1)} ${dateParts[1]}`;


            dailyForecasts[dateKey] = {
                date: finalDateString,
                tempMin: tempC,
                tempMax: tempC,
                entries: [],
            };
        }
        
        // Actualizar Mínima y Máxima
        dailyForecasts[dateKey].tempMin = Math.min(dailyForecasts[dateKey].tempMin, tempC);
        dailyForecasts[dateKey].tempMax = Math.max(dailyForecasts[dateKey].tempMax, tempC);
        
        // Guardar la entrada por hora
        dailyForecasts[dateKey].entries.push({
            hour: parseInt(localHour, 10),
            condition: item.weather[0].description,
        });
    }
    
    // 💡 NUEVO: Obtener el primer día (el día actual) para extraer su Min/Max.
    // Convertimos el Map a un Array y tomamos el primer elemento (el día actual).
    const todayForecastKey = Object.keys(dailyForecasts)[0];
    const todayForecast = dailyForecasts[todayForecastKey];


    // ============================================
    // 3. SELECTING DAILY CONDITION AND FINAL FORMAT
    // ============================================
    const finalForecast = Object.values(dailyForecasts)
        .slice(0, 7) // Limitar a los próximos 7 días
        .map(day => {
            // Estrategia: Tomar la condición del horario diurno (12 PM - 9 PM) más cercano a la tarde (3 PM).
            const dayTimeEntries = day.entries.filter(e => e.hour >= 12 && e.hour <= 21);
            
            // Si hay datos diurnos, preferimos la hora 3 PM (15:00) o la primera diurna.
            let selectedEntry = dayTimeEntries.find(e => e.hour === 15) || dayTimeEntries[0] || day.entries[0];
            
            // Capitalizar la condición climática final
            const conditionText = selectedEntry.condition.charAt(0).toUpperCase() + selectedEntry.condition.slice(1);

            return {
                'date': day.date,
                'max': getNumericTemp(day.tempMax),
                'min': getNumericTemp(day.tempMin),
                'condition': conditionText,
            };
        });

    // ============================================
    // 4. FINAL STRUCTURE (Incluyendo Max/Min del día actual)
    // ============================================
    return {
        'city_name': cityInfo.name,
        'temp': getNumericTemp(currentTempC), 
        'condition': currentConditionText,
        
        // 💡 CAMBIO CLAVE: Incluir min y max del día actual
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
            appid: WEATHER_API_KEY,
        };

       const response = await weatherClient.get('/forecast', { params });
       const parsedCity = parseCity(response);
       parsedCity.city_name = city;

       setCache(cacheKey, parsedCity, CACHE_TTL_MS);

       allCities.push(parsedCity);
    }

    setCache(allCitiesKey, allCities, CACHE_TTL_MS);

    console.log(allCities);

    return {
        cities: allCities,
    };

};

export { getPopularCities }
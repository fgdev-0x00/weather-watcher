// src/pages/CityDetail.jsx (MODIFICADO)
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // Ya no necesitamos CloudSun, Sun, Cloud, CloudRain aquí
import ForecastCard from '../components/ForecastCard';
import { useWeather } from '../hooks/useWeather'; 
import { getWeatherIcon } from '../utils/weatherIcons'; // 💡 IMPORTAR LA FUNCIÓN GLOBAL
import { toTitleCase } from '../utils/formatters';

export default function CityDetail() {
  const { id: cityNameParam } = useParams(); 
  const navigate = useNavigate();
  const { cities, loading, error } = useWeather(); 

  if (loading) {
    return <div className="p-5 text-center text-indigo-600">Cargando detalle...</div>;
  }
  
  if (error) {
    return <div className="p-5 text-center text-red-600">Error al cargar el detalle del clima.</div>;
  }

  const cityData = cities.find(c => c.city_name.toLowerCase() === cityNameParam.toLowerCase());

  if (!cityData) {
    return <p className="p-5">Ciudad no encontrada</p>;
  }

  // 💡 Extraer las claves con los nuevos nombres
  const { city_name, seven_day_forecast, temp, condition, max, min } = cityData; 
  const formattedCityName = toTitleCase(city_name);
  
  // 💡 NOTA: Ya NO necesitamos extraer Max/Min del seven_day_forecast[0] 
  // porque el backend ahora los envía como 'max' y 'min' en el objeto principal.
  // La extracción de { max, min } de cityData ya es correcta.

  return (
    <div className="h-full p-5 pt-8">

      {/* BACK */}
      <button onClick={() => navigate(-1)} className="mb-8 hover:cursor-pointer">
        <ArrowLeft className="w-8 h-8" />
      </button>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 h-full">

        {/* ================= LEFT COLUMN ================= */}
        <div className="flex flex-col items-center text-center">

          {/* CITY NAME */}
          <h1 className="text-4xl font-bold mb-2">
            {formattedCityName} 
          </h1>

          {/* CONDITION */}
          <p className="text-gray-500 text-lg mb-8">
            {condition} 
          </p>

          {/* TEMP */}
          <div className="flex items-start text-indigo-600 mb-6">
            <span className="text-[6rem] font-extrabold leading-none">
              {temp} 
            </span>

            <span className="text-6xl font-semibold ml-1 mt-2">
              °C
            </span>
          </div>

          {/* ICON */}
          {getWeatherIcon(condition, "w-12 h-12 mb-6")} {/* 💡 Usar el helper */}

          {/* MIN / MAX */}
          <div className="text-xl font-medium text-gray-500">
            Máx: {max}° / Mín: {min}° 
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="md:border-l md:border-gray-200 md:pl-10">

          {/* TITLE */}
          <h2 className="text-xl font-semibold mb-4">
            Pronóstico de 7 Días
          </h2>

          {/* DIVIDER */}
          <div className="h-px bg-gray-200 mb-6" />

          {/* FORECAST GRID */}
          <div className="grid md:grid-cols-5 gap-4">

            {seven_day_forecast.map((day, index) => (
              <ForecastCard
                key={index}
                date={day.date}
                max={day.max}
                min={day.min}
                condition={day.condition}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
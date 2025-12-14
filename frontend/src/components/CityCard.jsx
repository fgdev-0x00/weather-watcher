// src/components/CityCard.jsx (MODIFICADO)
// Ya no necesitamos importar los íconos directamente aquí
import { getWeatherIcon } from '../utils/weatherIcons'; // 💡 IMPORTAR LA FUNCIÓN GLOBAL
import { toTitleCase } from '../utils/formatters';

export default function CityCard({ city, onClick }) {
  const { city_name, temp, condition } = city;
  const formattedCityName = toTitleCase(city_name);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow-lg cursor-pointer"
    >
      <div className="flex flex-col justify-center"> {/* 💡 Contenedor para alinear contenido */}
        <h3 className="font-medium">{formattedCityName}</h3> 
        
        {/* 💡 Ícono y Condición en la misma línea */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
            {/* Usamos una clase más pequeña para el ícono */}
            {getWeatherIcon(condition, "w-5 h-5")} 
            <p>{condition}</p> 
        </div>
      </div>

      <span className="text-3xl font-bold text-indigo-500">
        {temp}°
      </span>
    </div>
  );
}
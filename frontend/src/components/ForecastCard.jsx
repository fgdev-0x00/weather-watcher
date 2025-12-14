// src/components/ForecastCard.jsx (SUGERIDO)
import { getWeatherIcon } from '../utils/weatherIcons';

export default function ForecastCard({ date, max, min, condition }) {
  // NOTA: Asumo que recibes 'condition' en lugar de 'weather_condition'
  
  return (
    <div className="flex flex-col items-center p-3 rounded-lg bg-gray-50">
        <p className="text-sm font-semibold mb-2">{date}</p>
        
        {getWeatherIcon(condition, "w-8 h-8 mb-2")} 
        
        <p className="text-lg font-bold text-gray-800">{max}°</p>
        <p className="text-sm text-gray-500">{min}°</p>
    </div>
  );
}
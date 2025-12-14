import { getWeatherIcon } from '../utils/weatherIcons';
import { toTitleCase } from '../utils/formatters';

export default function CityCard({ city, onClick }) {
  const { city_name, temp, condition } = city;
  const formattedCityName = toTitleCase(city_name);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-4 flex justify-between items-center shadow-md hover:shadow-lg cursor-pointer"
    >
      <div className="flex flex-col justify-center">
        <h3 className="font-medium">{formattedCityName}</h3> 
        
        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
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
import { Cloud, Sun, CloudRain } from 'lucide-react';

export default function CityCard({ city, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow-lg cursor-pointer"
    >
      <div>
        <h3 className="font-medium">{city.name}</h3>
        <p className="text-sm text-gray-500">{city.condition}</p>
      </div>

      <span className="text-3xl font-bold text-indigo-500">
        {city.temp}°
      </span>
    </div>
  );
}

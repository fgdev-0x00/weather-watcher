import { CloudSun } from 'lucide-react';

export default function ForecastCard({ day, icon: Icon = CloudSun, max, min }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center border border-gray-200 rounded shadow-sm hover:shadow-md hover:cursor-pointer p-4">

      <span className="text-sm font-medium text-gray-500">
        {day}
      </span>

      <Icon className="w-8 h-8 text-indigo-500" />

      <span className="font-semibold">
        {max}°
      </span>

      <span className="text-sm text-gray-400">
        {min}°
      </span>
    </div>
  );
}

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CloudSun } from 'lucide-react';
import { CITIES, WEEKLY } from '../data/mock';
import ForecastCard from '../components/ForecastCard';

export default function CityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const city = CITIES.find(c => c.id === Number(id));

  if (!city) {
    return <p className="p-5">Ciudad no encontrada</p>;
  }

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
            {city.name}
          </h1>

          {/* CONDITION */}
          <p className="text-gray-500 text-lg mb-8">
            {city.condition}
          </p>

          {/* TEMP */}
          <div className="flex items-start text-indigo-600 mb-6">
            <span className="text-[6rem] font-extrabold leading-none">
              {city.temp}
            </span>

            <span className="text-6xl font-semibold ml-1 mt-2">
              °C
            </span>
          </div>

          {/* ICON */}
          <CloudSun className="w-12 h-12 text-indigo-500 mb-6" />

          {/* MIN / MAX */}
          <div className="text-xl font-medium text-gray-500">
            Máx: {city.max}° / Mín: {city.min}°
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
          <div className="grid md:grid-cols-7 gap-4">

            {WEEKLY.map(day => (
              <ForecastCard
                key={day.day}
                {...day}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

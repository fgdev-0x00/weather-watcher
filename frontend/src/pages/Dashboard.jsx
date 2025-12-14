import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CityCard from '../components/CityCard';
import { Search } from 'lucide-react';
import { useWeatherContext } from '../context/WeatherContext';
import CityCardSkeleton from '../components/CityCardSkeleton';

const SKELETON_COUNT = 9;
export default function Dashboard() {
  const navigate = useNavigate();
  const { cities, loading, error } = useWeatherContext();

  if (error) {
    return (
      <div className="h-full flex items-center justify-center flex-col p-5">
        <p className="text-xl text-red-600 mb-4">Error al cargar el clima: {error}</p>
        <p className="text-gray-500">Intente recargar la página.</p>
      </div>
    );
  }

  const cardsToRender = loading 
    ? [...Array(SKELETON_COUNT)].map((_, index) => <CityCardSkeleton key={index} />)
    : cities.map((cityData) => (
        <CityCard
          key={cityData.city_name} 
          city={cityData}
          onClick={() => navigate(`/city/${cityData.city_name}`)}
        />
      ));

  return (
    <div className="h-full flex flex-col px-5 pb-8">

      <div className="pt-8">
        <Navbar />
      </div>

      <h1 className="text-3xl font-light text-gray-900 mt-6">
        Pronóstico Global
      </h1>

      {/* <div className="mt-8">
        <div className="input-search w-full lg:max-w-4xl">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar Ciudad..."
            className="w-full bg-transparent outline-none"
            disabled={loading}
          />
        </div>
      </div> */}

      <h2 className="text-xl font-semibold text-gray-800 mt-10 mb-6">
        Ciudades Populares
      </h2>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {cardsToRender}
      </div>
    </div>
  );
}
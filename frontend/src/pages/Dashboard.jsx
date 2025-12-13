import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CityCard from '../components/CityCard';
import { CITIES } from '../data/mock';
import { Search } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col px-5 pb-8">

      {/* NAVBAR */}
      <div className="pt-8">
        <Navbar />
      </div>

      {/* TITLE */}
      <h1 className="text-3xl font-light text-gray-900 mt-6">
        Pronóstico Global
      </h1>

      {/* SEARCH */}
      <div className="mt-8">
        <div className="input-search w-full lg:max-w-4xl">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar Ciudad..."
            className="w-full bg-transparent outline-none"
          />
        </div>
      </div>

      {/* SECTION TITLE */}
      <h2 className="text-xl font-semibold text-gray-800 mt-10 mb-6">
        Ciudades Populares
      </h2>

      {/* CARDS GRID */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {CITIES.map(city => (
          <CityCard
            key={city.id}
            city={city}
            onClick={() => navigate(`/city/${city.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

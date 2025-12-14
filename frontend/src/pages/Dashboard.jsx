import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CityCard from '../components/CityCard';
import { Search } from 'lucide-react';
import { useWeather } from '../hooks/useWeather'; 
import CityCardSkeleton from '../components/CityCardSkeleton'; // 💡 Importación del Skeleton

const SKELETON_COUNT = 9; // Número de esqueletos a mostrar (basado en el diseño)

export default function Dashboard() {
  const navigate = useNavigate();
  const { cities, loading, error } = useWeather();

  // ----------------------------------------------------
  // 💡 LÓGICA DE RENDERING CONDICIONAL DE CARGA/ERROR
  // ----------------------------------------------------

  if (error) {
    return (
      <div className="h-full flex items-center justify-center flex-col p-5">
        <p className="text-xl text-red-600 mb-4">Error al cargar el clima: {error}</p>
        <p className="text-gray-500">Intente recargar la página.</p>
      </div>
    );
  }

  // 💡 Determinar qué tarjetas renderizar: Skeletons o datos reales
  const cardsToRender = loading 
    ? [...Array(SKELETON_COUNT)].map((_, index) => <CityCardSkeleton key={index} />)
    : cities.map((cityData) => (
        <CityCard
          key={cityData.city_name} 
          city={cityData}
          onClick={() => navigate(`/city/${cityData.city_name}`)}
        />
      ));

  // ----------------------------------------------------
  // 💡 FIN LÓGICA DE RENDERING
  // ----------------------------------------------------
  
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
            disabled={loading} // 💡 Desactivar la búsqueda mientras carga
          />
        </div>
      </div>

      {/* SECTION TITLE */}
      <h2 className="text-xl font-semibold text-gray-800 mt-10 mb-6">
        Ciudades Populares
      </h2>

      {/* CARDS GRID */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {cardsToRender} {/* 💡 Renderiza los Skeletons o las CityCards */}
      </div>
    </div>
  );
}
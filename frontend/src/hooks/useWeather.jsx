// src/hooks/useWeather.js
import { useEffect, useState } from 'react';
import { weatherService } from '../services/weather.service';
import { useNotify } from '../context/NotifyContext';
import { useAuth } from '../context/AuthContext';

/**
 * Hook para cargar el pronóstico de las ciudades populares.
 * @returns {{ cities: Array<object>, loading: boolean, error: string | null }}
 */
export function useWeather() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const notify = useNotify();
  const { user } = useAuth(); // Usamos 'user' para recargar si el usuario cambia (o solo si está logeado)

  useEffect(() => {
    // Solo cargamos si el usuario está autenticado
    if (!user) {
        setLoading(false);
        setCities([]);
        return;
    }
    
    const fetchCities = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await weatherService.getPopularCities();
        setCities(data);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError(err.message || 'No se pudo cargar el pronóstico.');
        notify.error('Error al cargar datos del clima.');
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [user, notify]);

  return { cities, loading, error };
}
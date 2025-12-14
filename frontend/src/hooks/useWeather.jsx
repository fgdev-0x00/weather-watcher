import { useEffect, useState } from 'react';
import { weatherService } from '../services/weather.service';
import { useNotify } from '../context/NotifyContext';
import { useAuth } from '../context/AuthContext';

export function useWeather() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const notify = useNotify();
  const { user } = useAuth();

  useEffect(() => {
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
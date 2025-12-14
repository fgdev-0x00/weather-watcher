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
    const controller = new AbortController();
    const signal = controller.signal;
    let isMounted = true; 
    
    if (!user) { 
      setLoading(false);
      setCities([]);
      return () => { 
        isMounted = false; 
        controller.abort(); 
      }; 
    }
    
    const fetchCities = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await weatherService.getPopularCities({ signal }); 
        
        if (isMounted) {
          setCities(data);
        }
      } catch (err) {
        if (err.code === 'ERR_CANCELED' || err.name === 'AbortError' || err.isCancel) { 
            return; 
        }

        console.error('Error fetching weather data:', err);
        if (isMounted) {
          setError(err.message || 'No se pudo cargar el pronóstico.');
          notify.error('Error al cargar datos del clima.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCities();

    return () => {
      isMounted = false;
      controller.abort(); 
    };
  }, [user]); 

  return { cities, loading, error };
}
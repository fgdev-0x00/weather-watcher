import { createContext, useContext } from 'react';
import { useWeather } from '../hooks/useWeather';

const WeatherContext = createContext(null);

export function WeatherProvider({ children }) {
  const weather = useWeather();

  return (
    <WeatherContext.Provider value={weather}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeatherContext must be used inside WeatherProvider');
  }
  return context;
}
